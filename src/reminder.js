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

    await helpers.typing(context, 500);

    if (context.platform === 'telegram') {
        await context.sendText(translations.question_reminder, {
            replyMarkup: makeReplyMarkupTG(REPLIES)
        });
    } else {
        await context.sendText(translations.question_reminder, {
            quickReplies: makeQuickRepliesFB(REPLIES)
        });
    }

    await helpers.typingOff(context);
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

    await helpers.typing(context, 500);

    if ((eventKey.includes('MORNING') || eventKey.includes('AFTERNOON'))) {
        await context.sendText('Sure thing! I will do.')
    } else {
        await context.sendText('Okay.')
    }

    await helpers.typingOff(context);

    await Extra.StartExtraQuestion(context);
}


function makeQuickRepliesFB(repliesKeyArray) {
    return helpers.makeQuickRepliesFB(repliesKeyArray, CALLBACK_KEY_PREFIX, translations);
}

function makeReplyMarkupTG(repliesKeyArray) {
    return helpers.makeReplyMarkupTG(helpers.translateArray(repliesKeyArray, translations));
}

function lookupCallbackKey(textValue, translationKeys) {
    return helpers.lookupCallbackKey(textValue, translations, translationKeys, CALLBACK_KEY_PREFIX);
}


module.exports = {
    AskToCheckTomorrow,
    HandleReminder,
};