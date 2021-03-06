const helpers = require('./helpers');
const Analytics = require('./analytics');
const Extra = require('./extraQuestions');
const Risk = require('./riskAssessment');

const translations = helpers.translations.BasicData;

const CALLBACK_TITLES = {
    USER_FEEDBACK_TESTED_POSITIVE: translations.positive,
    USER_FEEDBACK_TESTED_NO_LIKELY: translations.no_likely,
    USER_FEEDBACK_TESTED_NO: translations.no,
};

async function HandleAskForTested(context) {
    await context.setState({
        nextAction: 'ASK_TESTED',
    });

    await helpers.sendTextWithReplies(context, translations.tested_question, ['positive', 'no_likely', 'no'], translations, 'USER_FEEDBACK_TESTED_');
}

async function HandlePayloadTested(context) {
    await context.setState({
        nextAction: 'NONE',
    });

    const eventKey = context.event.payload || helpers.getKeyByValue(CALLBACK_TITLES, context.event.text);
    await Analytics.SaveEvent(context, eventKey);

    await AskForPostalCode(context);
}

async function AskForPostalCode(context) {
    await context.setState({
        nextAction: 'ASK_ZIPCODE',
    });

    await helpers.sendText(context, 'Where do you live? Would you mind sharing your postal code?');
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

        await helpers.sendText(context, 'No problem!');
    } else if (isValid) {
        await context.setState({
            nextAction: 'NONE',
        });

        await Analytics.SaveEvent(context, 'USER_FEEDBACK_POSTAL_CODE', numbers);

        // Handle zipcode
        await helpers.sendText(context, 'Thank you.');

    } else {
        await helpers.sendText(context, 'Hmm, I didn’t understand.\nWhat is your postal code again?');
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