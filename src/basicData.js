const helpers = require('./helpers');

const translations = helpers.translations.BasicData;


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
                title: translations.answer_positive,
                payload: 'USER_FEEDBACK_TESTED_POSITIVE',
            },
            {
                contentType: 'text',
                title: translations.answer_no_likely,
                payload: 'USER_FEEDBACK_TESTED_NO_LIKELY',
            },
            {
                contentType: 'text',
                title: translations.answer_no,
                payload: 'USER_FEEDBACK_TESTED_NO',
            },
        ],
    });

    await helpers.typingOff(context);
}

async function HandleAskForTestedTG(context) {
    await helpers.typing(context, 1000);
    await context.sendText(translations.tested_question, {
        replyMarkup: {
            keyboard: [
                [{
                    text: translations.answer_positive,
                }],
                [{
                    text: translations.answer_no_likely,
                }],
                [{
                    text: translations.answer_no,
                }],
            ],
            resize_keyboard: true,
        }
    });
}

async function HandlePayloadTested(context) {
    await context.setState({
        nextAction: 'NONE',
    });

    await HandleAskForPostalCode(context);
}

async function HandleAskForPostalCode(context) {
    await context.setState({
        nextAction: 'ASK_ZIPCODE',
    });

    await helpers.typing(context, 1000);
    await context.sendText('Where do you live? Would you mind sharing your postal code?');

    await helpers.typingOff(context);
}

async function HandleZipCodeReceived(context, nextFlow) {
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

        await helpers.typing(context, 2000);
        await context.sendText('No problem!');
        await helpers.typingOff(context);

        nextFlow(context);

        return
    }

    if (!isValid) {
        await helpers.typing(context, 4000);
        await context.sendText('Hmm, I didn\'t understand.\nWhat is your postal code again?');
        await helpers.typingOff(context);
    } else {
        await context.setState({
            nextAction: 'NONE',
        });

        // Handle zipcode
        await helpers.typing(context, 4000);
        await context.sendText('Thank you.');
        await helpers.typingOff(context);

        //@TOFIX: only continue to RiskAssessment if "feeling sick." else "Goodbye"
        nextFlow(context);
    }
}


module.exports = {
    HandleAskForTested,
    HandlePayloadTested,
    HandleAskForPostalCode,
    HandleZipCodeReceived,
};