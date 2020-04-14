const helpers = require('./helpers');
const Basic = require('./basicData');
const Symptoms = require('./symptoms');
const Analytics = require('./analytics');

const translations = helpers.translations.GetStarted;
const CALLBACK_KEY_PREFIX = 'USER_FEEDBACK_';
const REPLIES = [
    'is_healthy',
    'is_sick',
];

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

    await helpers.sendText(context, translations.hello);

    await helpers.sendText(context, translations.intro);

    await context.setState({
        nextAction: 'GREETING_QUESTION',
    });

    await helpers.sendTextWithReplies(context, translations.question, REPLIES, translations, CALLBACK_KEY_PREFIX);

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

    if (payload === 'USER_FEEDBACK_IS_HEALTHY' || text === translations['is_healthy']) {
        await HandlePayloadHealthy(context);
        await Analytics.SaveEvent(context, 'USER_FEEDBACK_IS_HEALTHY');
    }

    else if (payload === 'USER_FEEDBACK_IS_SICK' || text === translations['is_sick']) {
        await Symptoms.HandlePayloadUserSick(context);
        await Analytics.SaveEvent(context, 'USER_FEEDBACK_IS_SICK');
    }

}

async function HandlePayloadHealthy(context) {
    await helpers.sendText(context, translations.healthy_advise);

    await Basic.HandleAskForTested(context);
}

module.exports = {
    GetStarted,
    ResetState,
    HandleGreetingReply,
};