const helpers = require('./helpers');
const translations = helpers.translations.GetStarted;

const callbacks = {
    USER_FEEDBACK_IS_HEALTHY: translations.answer_healthy,
    USER_FEEDBACK_IS_SICK: translations.answer_sick,
};

async function ResetState(context) {
    return await context.setState({
        nextAction: 'NONE',
        payloads: [],
        text: []
    });
}


async function GetStarted(context) {
    await ResetState(context);

    if (context.platform === 'telegram') {
        await GetStartedTG(context);
    } else if (context.platform === 'messenger') {
        await GetStartedFB(context);
    }

}

async function GetStartedFB(context) {
    await context.typing(2000);
    await context.sendText(translations.hello);
    await context.typingOff();

    await context.typing(4000);
    await context.sendText(translations.intro);
    await context.typingOff();

    await context.typing(4000);
    await context.sendText(translations.question, {
        quickReplies: [
            {
                contentType: 'text',
                title: callbacks.USER_FEEDBACK_IS_HEALTHY,
                payload: 'USER_FEEDBACK_IS_HEALTHY',
            },
            {
                contentType: 'text',
                title: callbacks.USER_FEEDBACK_IS_SICK,
                payload: 'USER_FEEDBACK_IS_SICK',
            },
        ]
    });
    await context.typingOff();
}


async function GetStartedTG(context) {
    await context.sendChatAction('typing');
    await context.typing(500);
    await context.sendText(translations.hello);

    await context.sendChatAction('typing');
    await context.typing(1000);
    await context.sendText(translations.intro);

    await context.sendChatAction('typing');
    await context.typing(1000);
    await context.sendText(translations.question, {
        replyMarkup: {
            keyboard: [
              [
                {
                    text: callbacks.USER_FEEDBACK_IS_HEALTHY,
                },
              ],
              [
                {
                    text: callbacks.USER_FEEDBACK_IS_SICK,
                },
              ],
            ],
            resize_keyboard: true,
        }
    });
}

module.exports = {
    GetStarted,
    ResetState,
    callbacks,
};