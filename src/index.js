const Analytics = require('./analytics');
const GetStarted = require('./getStarted');
const Symptoms = require('./symptoms');
const Extra = require('./extraQuestions');
const Risk = require('./riskAssessment');

async function HandlePayloadTested(context) {
  await Analytics.HandleAskForPostalCode(context);
}

async function HandlePayloadHealthy(context) {
  await context.typing(2000);
  await context.sendText("That's great! Don't forget to keep up the hygiene, wash your hands, stay at home and wear a facemask if you can!");
  await context.typingOff();

  await Risk.HandleAskForTested(context);
}

async function HandleDebugCases(context) {
  const text = context.event.text;

  if (text.includes('debug:')) {
    await GetStarted.ResetState(context);
  }

  if (text == 'debug:zip') {
    await Analytics.HandleAskForPostalCode(context);
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

  if (context.event.isPayload) {
    await Analytics.TrackPayload(context);

    // Check if I have enough data to do assessment

  }
  else if (context.event.isText) {
    await Analytics.TrackText(context);

    await HandleDebugCases(context);

    // After zipcode, start risk assessment
    await Analytics.HandleZipCodeReceived(context, Risk.StartRiskAssessment);

    // Check if waiting for postal number
  }


  // Routes 
  const payload = context.event.isPayload && context.event.payload;
  const text = context.event.isText && context.event.text;
  
  if (payload == 'GET_STARTED' ||
    text &&
    text == 'Start' ||
    text.startsWith('Hi') ||
    text.startsWith('hi') ||
    text.startsWith('Hello') ||
    text.startsWith('hello')) {
    await GetStarted.GetStarted(context);
  }

  else if (payload === 'USER_FEEDBACK_IS_HEALTHY' || text === GetStarted.callbacks.USER_FEEDBACK_IS_HEALTHY) {
    await HandlePayloadHealthy(context);
  }

  else if (payload == 'USER_FEEDBACK_IS_SICK') {
    await Symptoms.HandlePayloadUserSick(context);
  }

  else if (payload.includes('USER_FEEDBACK_SICK')) {
    await Symptoms.HandlePayloadSymptomReport(context);
  }

  else if (payload.includes('USER_FEEDBACK_ASSESSMENT')) {
    await Risk.ContinueRiskAssessment(context);
  }

  else if (payload.includes('USER_FEEDBACK_TESTED')) {
    await HandlePayloadTested(context);
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
