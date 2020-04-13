const helpers = require('./helpers');
const Analytics = require('./analytics');
const Extra = require('./extraQuestions');
const Risk = require('./riskAssessment');

const translations = helpers.translations.BasicData;
const callbackTitles = {
    USER_FEEDBACK_TESTED_POSITIVE: translations.answer_positive,
    USER_FEEDBACK_TESTED_NO_LIKELY: translations.answer_no_likely,
    USER_FEEDBACK_TESTED_NO: translations.answer_no,
};

async function HandleAskForTested(context) {
    await context.setState({
        nextAction: 'ASK_TESTED',
    });

    if (context.platform === 'telegram') {
        await HandleAskForTestedTG(context);
    } else {
        await HandleAskForTestedFB(context);
    }
}

async function HandleAskForTestedFB(context) {
    await helpers.typing(context, 1000);
    await context.sendText(translations.tested_question, {
        quickReplies: [
            {
                contentType: 'text',
                title: callbackTitles.USER_FEEDBACK_TESTED_POSITIVE,
                payload: 'USER_FEEDBACK_TESTED_POSITIVE',
            },
            {
                contentType: 'text',
                title: callbackTitles.USER_FEEDBACK_TESTED_NO_LIKELY,
                payload: 'USER_FEEDBACK_TESTED_NO_LIKELY',
            },
            {
                contentType: 'text',
                title: callbackTitles.USER_FEEDBACK_TESTED_NO,
                payload: 'USER_FEEDBACK_TESTED_NO',
            },
        ],
    });

    await helpers.typingOff(context);
}

async function HandleAskForTestedTG(context) {
    await helpers.typing(context, 1000);
    await context.sendText(translations.tested_question, {
        replyMarkup: helpers.makeReplyMarkupTG(Object.values(callbackTitles))
    });
}

async function HandlePayloadTested(context) {
    await context.setState({
        nextAction: 'NONE',
    });

    const eventKey = context.event.payload || helpers.getKeyByValue(callbackTitles, context.event.text);
    await Analytics.SaveEvent(context, eventKey);

    await AskForPostalCode(context);
}

async function AskForPostalCode(context) {
    await context.setState({
        nextAction: 'ASK_ZIPCODE',
    });

    await helpers.typing(context, 1000);
    await context.sendText('Where do you live? Would you mind sharing your postal code?');

    await helpers.typingOff(context);
}

async function HandleZipCodeReceived(context) {
    const nextAction = context.state.nextAction || '';

    if (nextAction !== 'ASK_ZIPCODE') {
        return;
    }

    const text = context.event.text || '';

    const possibleNumbers = text.match(/\d+/g);

    let numbers = possibleNumbers ? possibleNumbers.map(Number).map(x => x.toString()).join('') : '';

    const isValid = numbers.length == 5;

    if (text.startsWith('no') || text.startsWith('No') || text.startsWith('stop')) {
        await context.setState({
            nextAction: 'NONE',
        });

        await helpers.typing(context, 500);
        await context.sendText('No problem!');
        await helpers.typingOff(context);
    } else if (isValid) {
        await context.setState({
            nextAction: 'NONE',
        });

        await Analytics.SaveEvent(context, 'USER_FEEDBACK_POSTAL_CODE', numbers);

        // Handle zipcode
        await helpers.typing(context, 500);
        await context.sendText('Thank you.');
        await helpers.typingOff(context);

    } else {
        await helpers.typing(context, 1000);
        await context.sendText('Hmm, I didn’t understand.\nWhat is your postal code again?');
        await helpers.typingOff(context);
        return;
    }

    const isUserHealthy = helpers.extractEvents(context, 'USER_FEEDBACK_IS_HEALTHY').length > 0;
    if (isUserHealthy) {
        await Extra.StartExtraQuestion(context);
    } else {
        await Risk.StartRiskAssessment(context);
    }

}


module.exports = {
    HandleAskForTested,
    HandlePayloadTested,
    AskForPostalCode,
    HandleZipCodeReceived,
};