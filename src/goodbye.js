const helpers = require('./helpers');

async function Goodbye(context) {
    const reminderAnswers = extractReminder(context);

    await context.typing(2000);

    if (reminderAnswers.includes('reminder_afternoon') || reminderAnswers.includes('reminder_morning')) {
        await context.sendText('I will talk to you again tomorrow! Rest well.');
    } else {
        await context.sendText('I hope I will hear from you again. Take care until then.');
    }

    await context.typingOff();
}

function extractReminder(context) {
    return helpers.extractEvents(context, 'USER_FEEDBACK_REMINDER');
}

module.exports = {
    Goodbye,
}