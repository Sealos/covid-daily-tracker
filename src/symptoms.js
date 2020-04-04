const helpers = require('./helpers');
const Analytics = require('./analytics');

// First time asking for symptoms
async function HandlePayloadUserSick(context) {
    await context.setState({
        nextAction: 'ASK_SYMPTOMS'
    });

    await context.typing(4000);

    const initialSymptoms = helpers.getButtonsContent(['fever', 'cough', 'difficulty_breathing'], 'USER_FEEDBACK_SICK_');
    const extraSymptoms = helpers.getQuickReply(['headache', 'diarrhea', 'sore_throat', 'no_smell', 'something_else'], 'USER_FEEDBACK_SICK_');

    await context.sendButtonTemplate('I’m sorry, what are your symptoms?', initialSymptoms);

    await context.typing(1000);
    await context.sendText('Or maybe any of these?', { quickReplies: extraSymptoms, });

    await context.typingOff();
}

async function HandleNothingElse(context) {
    await context.typingOff();

    await context.typing(4000);

    await context.sendText('Okay, I see.\nI will ask some questions to questions assess better');

    await context.typingOff();

    await HandleAskForTested(context);
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

            await context.typingOff();

            await context.typing(2000);

            const waysToAskMore = [
                'Anything else?',
                'Or maybe any of these?',
                'What about this ones?'
            ];

            const text = waysToAskMore[Math.floor(Math.random() * waysToAskMore.length)];

            await context.sendText(text, { quickReplies: extraSymptoms, });

            await context.typingOff();
        } else {
            await HandleNothingElse(context);
        }
    }
}

async function HandleAskForTested(context) {
    await context.typing(2000);
    await context.sendText('Have you had a positive test result for COVID-19?', {
        quickReplies: [
            {
                contentType: 'text',
                title: 'Yes, I have',
                payload: 'USER_FEEDBACK_TESTED_POSITIVE',
            },
            {
                contentType: 'text',
                title: 'No, but it\'s likely',
                payload: 'USER_FEEDBACK_TESTED_NO_LIKELY',
            },
            {
                contentType: 'text',
                title: 'No',
                payload: 'USER_FEEDBACK_TESTED_NO',
            },
        ],
    });

    context.typingOff();
}

function remainingSymptoms(currentSymptoms) {
    const allValidSymptoms = [
        'fever',
        'cough',
        'dry_cough',
        'headache',
        'diarrhea',
        'difficulty_breathing',
        'sore_throat',
        'no_smell'
    ];

    return allValidSymptoms.filter(x => !currentSymptoms.includes(x));
}

function extractSymptoms(context) {
    const state = context.state.payloads || [];

    const currentSymptoms = state
        .filter(x => x.event.includes('USER_FEEDBACK_SICK'))
        .map(x => x.event.replace('USER_FEEDBACK_SICK_', '').toLowerCase());

    return currentSymptoms;
}

module.exports = {
    HandlePayloadUserSick,
    HandlePayloadSymptomReport,
    HandleAskForTested
};