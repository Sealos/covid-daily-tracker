const helpers = require('./helpers');
const Basic = require('./basicData');

// First time asking for symptoms
async function HandlePayloadUserSick(context) {
    await context.setState({
        nextAction: 'ASK_SYMPTOMS'
    });

    await helpers.typing(context, 4000);

    const initialSymptoms = helpers.getButtonsContent(['fever', 'cough', 'difficulty_breathing'], 'USER_FEEDBACK_SICK_');
    const extraSymptoms = helpers.getQuickReply(['headache', 'diarrhea', 'sore_throat', 'no_smell', 'something_else'], 'USER_FEEDBACK_SICK_');

    await context.sendButtonTemplate('I’m sorry, what are your symptoms?', initialSymptoms);

    await helpers.typing(context, 1000);
    await context.sendText('Or maybe any of these?', { quickReplies: extraSymptoms, });

    await helpers.typingOff(context);
}

async function HandleNothingElse(context) {
    await helpers.typingOff(context);

    await helpers.typing(context, 4000);

    await context.sendText('Okay, I see.');

    await helpers.typingOff(context);

    await Basic.HandleAskForTested(context);
}

async function HandlePayloadSymptomReport(context) {
    const payload = context.event.payload;

    if (payload == 'USER_FEEDBACK_SICK_NOTHING_ELSE') {
        await HandleNothingElse(context);
    } else {
        const currentSymptoms = extractSymptoms(context);

        const symptomsToAsk = remainingSymptoms(currentSymptoms);

        if (symptomsToAsk.length > 0) {

            const extraSymptoms = helpers.getQuickReply(symptomsToAsk.concat(['nothing_else']), 'USER_FEEDBACK_SICK_');

            await helpers.typingOff(context);

            await helpers.typing(context, 2000);

            const waysToAskMore = [
                'Anything else?',
                'Or maybe any of these?',
                'What about these ones?'
            ];

            const text = waysToAskMore[Math.floor(Math.random() * waysToAskMore.length)];

            await context.sendText(text, { quickReplies: extraSymptoms, });

            await helpers.typingOff(context);
        } else {
            await HandleNothingElse(context);
        }
    }
}

function remainingSymptoms(currentSymptoms) {
    const allValidSymptoms = [
        'fever',
        'cough',
        'headache',
        'diarrhea',
        'tiredness',
        'difficulty_breathing',
        'sore_throat',
        'no_smell'
    ];

    return allValidSymptoms.filter(x => !currentSymptoms.includes(x));
}

function extractSymptoms(context) {
    return helpers.extractEvents(context, 'USER_FEEDBACK_SICK');
}

module.exports = {
    HandlePayloadUserSick,
    HandlePayloadSymptomReport,
    extractSymptoms,
    remainingSymptoms
};