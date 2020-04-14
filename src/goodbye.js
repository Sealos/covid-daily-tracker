const helpers = require('./helpers');

async function Goodbye(context) {
    const reminderAnswers = extractReminder(context);

    if (reminderAnswers.includes('reminder_afternoon') || reminderAnswers.includes('reminder_morning')) {
        await helpers.sendText(context, 'I will talk to you again tomorrow! Rest well.');
    } else {
        await helpers.sendText(context, 'I hope I will hear from you again. Take care until then.');
    }
}

function extractReminder(context) {
    return helpers.extractEvents(context, 'USER_FEEDBACK_REMINDER');
}

module.exports = {
    Goodbye,
}