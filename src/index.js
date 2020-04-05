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

  if (text == 'start' ||
    text == 'Start' ||
    text.startsWith('Hi') ||
    text.startsWith('hi') ||
    text.startsWith('Hello') ||
    text.startsWith('hello')) {
    await GetStarted.GetStarted(context);
  }

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

  if (context.event.isText) {
    await Analytics.TrackText(context);

    await HandleDebugCases(context);

    // After zipcode, start risk assessment
    await Analytics.HandleZipCodeReceived(context, Risk.StartRiskAssessment);

    // Check if waiting for postal number
  }

  if (context.event.isPayload) {
    await Analytics.TrackPayload(context);

    // Check if I have enough data to do assessment

    let handled = false;

    const payload = context.event.payload;
    if (payload == 'GET_STARTED') {
      handled = true;
      await GetStarted.GetStarted(context);
    }

    if (payload == 'USER_FEEDBACK_IS_HEALTHY') {
      handled = true;
      await HandlePayloadHealthy(context);
    }

    if (payload == 'USER_FEEDBACK_IS_SICK') {
      handled = true;
      await Symptoms.HandlePayloadUserSick(context);
    }

    if (payload.includes('USER_FEEDBACK_SICK')) {
      handled = true;
      await Symptoms.HandlePayloadSymptomReport(context);
    }

    if (payload.includes('USER_FEEDBACK_ASSESSMENT')) {
      handled = true;
      await Risk.ContinueRiskAssessment(context);
    }

    if (payload.includes('USER_FEEDBACK_TESTED')) {
      handled = true;
      await HandlePayloadTested(context);
    }

    if (payload.includes('USER_FEEDBACK_CONTINUE_EXTRA')) {
      handled = true;
      await Extra.HandleContinueExtra(context);
    }

    if (payload.includes('USER_FEEDBACK_REMINDER_')) {
      handled = true;
      await Risk.HandleReminder(context);
    }

    if (!handled) {
      await context.sendText('I have a bug, I did not handle action: ' + payload);
    }
  }
};
