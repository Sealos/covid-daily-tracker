const helpers = require('./helpers');
const Basic = require('./basicData');
const Symptoms = require('./symptoms');
const Analytics = require('./analytics');

const translations = helpers.translations.GetStarted;
const callbackTitles = {
    USER_FEEDBACK_IS_HEALTHY: translations.answer_healthy,
    USER_FEEDBACK_IS_SICK: translations.answer_sick,
};

async function ResetState(context) {
    return await context.setState({
        nextAction: 'NONE',
        payloads: [],
        text: [],
        events: [],
    });
}


async function GetStarted(context) {
    await ResetState(context);

    await helpers.typing(context, 400);
    await context.sendText(translations.hello);
    await helpers.typingOff(context);

    await helpers.typing(context, 800);
    await context.sendText(translations.intro);
    await helpers.typingOff(context);

    await helpers.typing(context, 400);

    await context.setState({
        nextAction: 'GREETING_QUESTION',
    });

    if (context.platform === 'telegram') {
        await GreetingQuestionTG(context);
    } else {
        await GreetingQuestionFB(context);
    }

    await helpers.typingOff(context);
}

async function GreetingQuestionFB(context) {
    await context.sendText(translations.question, {
        quickReplies: [
            {
                contentType: 'text',
                title: callbackTitles.USER_FEEDBACK_IS_HEALTHY,
                payload: 'USER_FEEDBACK_IS_HEALTHY',
            },
            {
                contentType: 'text',
                title: callbackTitles.USER_FEEDBACK_IS_SICK,
                payload: 'USER_FEEDBACK_IS_SICK',
            },
        ]
    });
}

async function GreetingQuestionTG(context) {
    await context.sendText(translations.question, {
        replyMarkup: {
            keyboard: [
                [
                    {
                        text: callbackTitles.USER_FEEDBACK_IS_HEALTHY,
                    },
                ],
                [
                    {
                        text: callbackTitles.USER_FEEDBACK_IS_SICK,
                    },
                ],
            ],
            resize_keyboard: true,
        }
    });
}

async function HandleGreetingReply(context) {
    const nextAction = context.state.nextAction || '';
    const payload = context.event.isPayload && context.event.payload || '';
    const text = context.event.isText && context.event.text || '';

    if (nextAction !== 'GREETING_QUESTION') {
        return;
    }

    await context.setState({
        nextAction: 'NONE',
    });

    if (payload === 'USER_FEEDBACK_IS_HEALTHY' || text === callbackTitles.USER_FEEDBACK_IS_HEALTHY) {
        await HandlePayloadHealthy(context);
        await Analytics.SaveData(context, 'USER_FEEDBACK_IS_HEALTHY');
    }

    else if (payload === 'USER_FEEDBACK_IS_SICK' || text === callbackTitles.USER_FEEDBACK_IS_SICK) {
        await Symptoms.HandlePayloadUserSick(context);
        await Analytics.SaveData(context, 'USER_FEEDBACK_IS_SICK');
    }

}

async function HandlePayloadHealthy(context) {
    await helpers.typing(context, 500);
    await context.sendText(translations.healthy_advise);
    await helpers.typingOff(context);

    await Basic.HandleAskForTested(context);
}

module.exports = {
    GetStarted,
    ResetState,
    HandleGreetingReply,
    callbackTitles,
};