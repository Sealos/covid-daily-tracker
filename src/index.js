const Analytics = require('./analytics');
const GetStarted = require('./getStarted');
const Symptoms = require('./symptoms');
const Extra = require('./extraQuestions');
const Risk = require('./riskAssessment');
const Basic = require('./basicData');


async function HandleDebugCases(context) {
    const text = context.event.text;

    if (text === 'debug:state') {
        console.log(context.state);
        await context.sendText(context.state);
    }
    else if (text.includes('debug:')) {
        await GetStarted.ResetState(context);
    }

    if (text == 'debug:zip') {
        await Basic.HandleAskForPostalCode(context);
    }

    if (text == 'debug:sick') {
        await Symptoms.HandlePayloadUserSick(context);
    }

    if (text == 'debug:risk') {
        await Risk.StartRiskAssessment(context);
    }

    if (text == 'debug:extra') {
        await Extra.StartExtraQuestion(context);
    }

    if (text == 'debug:reminder') {
        await Risk.AskToCheckTomorrow(context);
    }
}

module.exports = async function App(context) {
    // For some reasons, isEcho, isRead, isDelivery are also subscribed..
    if (context.event.isEcho || context.event.isRead || context.event.isDelivery) {
        return;
    }

    Analytics.Track(context);

    if (context.event.isText) {
        await HandleDebugCases(context);
    }

    // Routes 
    const payload = context.event.isPayload && context.event.payload || '';
    const text = context.event.isText && context.event.text || '';
    const nextAction = context.state.nextAction || '';


    // console.log(`event.isText: ${context.event.isText}, event.isEcho: ${context.event.isEcho}, event.isRead: ${context.event.isRead}, event.isDelivery: ${context.event.isDelivery}`);
    console.log(`payload: ${payload}; text: ${text}; nextAction: ${nextAction}`);

    if (payload == 'GET_STARTED' ||
        text &&
        text == 'Start' ||
        text.startsWith('Hi') ||
        text.startsWith('hi') ||
        text.startsWith('Hello') ||
        text.startsWith('hello')) {
        await GetStarted.GetStarted(context);
    }

    else if (nextAction === 'GREETING_QUESTION') {
        await GetStarted.HandleGreetingReply(context);
    }

    else if (nextAction === 'ASK_SYMPTOMS' || payload.includes('USER_FEEDBACK_SYMPTOM')) {
        await Symptoms.HandlePayloadSymptomReport(context);
    }

    else if (payload.includes('USER_FEEDBACK_ASSESSMENT')) {
        await Risk.ContinueRiskAssessment(context);
    }

    else if (nextAction === 'ASK_TESTED') {
        await Basic.HandlePayloadTested(context);
    }

    else if (nextAction === 'ASK_ZIPCODE') {
        await Basic.HandleZipCodeReceived(context, Risk.StartRiskAssessment);
    }

    else if (payload.includes('USER_FEEDBACK_CONTINUE_EXTRA')) {
        await Extra.HandleContinueExtra(context);
    }

    else if (payload.includes('USER_FEEDBACK_REMINDER_')) {
        await Risk.HandleReminder(context);
    }

    else if (payload) {
        await context.sendText('I have a bug, I did not handle action: ' + payload);
    }

    else {
        await context.sendText('Sorry, I don\'t understand.');
    }
};
