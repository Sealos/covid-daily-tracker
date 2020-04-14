const helpers = require('./helpers');
const Extra = require('./extraQuestions');
const Analytics = require('./analytics');

const translations = helpers.translations.Reminder;
const CALLBACK_KEY_PREFIX = 'USER_FEEDBACK_REMINDER_';
const REPLIES = [
    'reminder_morning',
    'reminder_afternoon',
    'reminder_no'
];

async function AskToCheckTomorrow(context) {
    await context.setState({
        nextAction: 'ASK_REMINDER'
    });

    await helpers.sendTextWithReplies(context, translations.question_reminder, REPLIES, translations, CALLBACK_KEY_PREFIX);
}

async function HandleReminder(context) {
    const nextAction = context.state.nextAction || '';
    if (nextAction !== 'ASK_REMINDER') {
        return;
    }

    const eventKey = context.event.payload || lookupCallbackKey(context.event.text, REPLIES) || '';

    if (eventKey) {
        await Analytics.SaveEvent(context, eventKey);
    }

    if ((eventKey.includes('MORNING') || eventKey.includes('AFTERNOON'))) {
        await helpers.sendText(context, 'Sure thing! I will do.')
    } else {
        await helpers.sendText(context, 'Okay.')
    }

    await Extra.StartExtraQuestion(context);
}

function lookupCallbackKey(textValue, translationKeys) {
    return helpers.lookupCallbackKey(textValue, translations, translationKeys, CALLBACK_KEY_PREFIX);
}


module.exports = {
    AskToCheckTomorrow,
    HandleReminder,
};