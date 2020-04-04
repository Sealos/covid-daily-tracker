async function TrackText(context) {
  const currentText = context.event.text;

  if (currentText) {
    let previousTexts = context.state.texts || [];

    const newText = {
      text: currentText,
      date: new Date()
    };

    previousTexts.push(newText);

    await context.setState({
      text: previousTexts,
    });
  }
}

async function TrackPayload(context) {
  const currentPayload = context.event.payload;

  if (currentPayload) {
    let previousPayloads = context.state.payloads;

    const newPayload = {
      event: currentPayload,
      date: new Date()
    };

    previousPayloads.push(newPayload);

    await context.setState({
      payloads: previousPayloads,
    });
  }
}

async function HandleAskForPostalCode(context) {
  await context.typing(2000);
  await context.sendText('We are building a analytics for everyone to use. Help us be better!');
  await context.typing(2000);
  await context.sendText('Would you mind sharing your postal code?');
  context.typingOff();
}

async function HandleAskForTested(context) {
  await context.typing(2000);
  await context.sendText('Have you had a positive test result for COVID-19?', {
    quickReplies: [
      {
        contentType: 'text',
        title: 'Yes, I have',
        payload: 'USER_FEEDBACK_TESTED_POSITIVE',
      },
      {
        contentType: 'text',
        title: 'No, but it\'s likely',
        payload: 'USER_FEEDBACK_TESTED_NO_LIKELY',
      },
      {
        contentType: 'text',
        title: 'No',
        payload: 'USER_FEEDBACK_TESTED_NO',
      },
    ],
  });

  context.typingOff();
}

async function HandlePayloadTested(context) {


  await HandleAskForPostalCode(context);
}

async function HandlePayloadHealthy(context) {
  await context.typing(2000);
  await context.sendText("That's great! Don't forget to keep up the hygiene, wash your hands, stay at home and wear a facemask if you can! {link to XXX}");

  context.typingOff();
}

async function HandlePayloadUserSick(context) {

  await context.typing(4000);

  await context.sendButtonTemplate('I’m sorry, what are your symptoms?', [
    {
      type: 'postback',
      title: 'Fever',
      payload: 'USER_FEEDBACK_SICK_FEVER',
    },
    {
      type: 'postback',
      title: 'Cough',
      payload: 'USER_FEEDBACK_SICK_COUGH',
    },
    {
      type: 'postback',
      title: 'Difficult breathing',
      payload: 'USER_FEEDBACK_SICK_BREATHING',
    },
  ]);

  await context.typing(1000);
  await context.sendText('Or maybe any of these?', {
    quickReplies: [
      {
        contentType: 'text',
        title: 'Headache',
        payload: 'USER_FEEDBACK_SICK_HEADACHE',
      },
      {
        contentType: 'text',
        title: 'Diarrhea',
        payload: 'USER_FEEDBACK_SICK_DIARREHEA',
      },
      {
        contentType: 'text',
        title: 'Sore Throat',
        payload: 'USER_FEEDBACK_SICK_SORE_THROAT',
      },
      {
        contentType: 'text',
        title: 'I can\'t smell',
        payload: 'USER_FEEDBACK_SICK_SMELL',
      },
      {
        contentType: 'text',
        title: 'Something else',
        payload: 'USER_FEEDBACK_SICK_SOMETHING_ELSE',
      },
    ],
  });

  await context.typingOff();
}

async function HandlePayloadSymptomReport(context) {
  const payload = context.event.payload;

  let handled = false;

  if (payload.includes('FEVER')) {
    handled = true;

    await context.typingOff();

    await context.typing(4000);
    await context.sendText('Anything else?', {
      quickReplies: [
        {
          contentType: 'text',
          title: 'Dry cough',
          payload: 'USER_FEEDBACK_SICK_DRY_COUGH',
        },
        {
          contentType: 'text',
          title: 'Difficult breathing',
          payload: 'USER_FEEDBACK_SICK_BREATHING',
        },
        {
          contentType: 'text',
          title: 'Headache',
          payload: 'USER_FEEDBACK_SICK_HEADACHE',
        },
        {
          contentType: 'text',
          title: 'Diarrhea',
          payload: 'USER_FEEDBACK_SICK_DIARREHEA',
        },
        {
          contentType: 'text',
          title: 'Nothing else',
          payload: 'USER_FEEDBACK_SICK_NOTHING_ELSE',
        },
      ],
    });
  }

  if (payload.includes('COUGH')) {
    handled = true;

    await HandleAskForTested(context);
  }

  if (payload == 'USER_FEEDBACK_SICK_NOTHING_ELSE') {
    handled = true;

    await context.typingOff();

    await context.typing(4000);

    await context.sendText('Okay, I see. Checking how else I can help...');

    await HandleAskForPostalCode(context);
  }

  if (!handled) {
    await context.sendText('I have a bug, I did not handle action: ' + payload);
  }
}

async function GetStarted(context) {

  await context.typing(2000);

  await context.sendText('Hello!');

  await context.typingOff();

  await context.typing(4000);

  await context.sendButtonTemplate("How are you feeling today?", [
    {
      type: 'postback',
      title: 'Feeling healthy!',
      payload: 'USER_FEEDBACK_IS_HEALTHY',
    },
    {
      type: 'postback',
      title: 'Feeling sick',
      payload: 'USER_FEEDBACK_IS_SICK',
    },
  ]);

  await context.typingOff();
}


module.exports = async function App(context) {

  if (context.event.isText) {
    await TrackText(context);

    // Check if waiting for postal number

    if (context.event.text == 'start' || context.event.text == 'Start') {
      await GetStarted(context);
    }
  }

  if (context.event.isPayload) {
    await TrackPayload(context);

    // Check if I have enough data to do assessment

    let handled = false;

    const payload = context.event.payload;
    if (payload == 'GET_STARTED') {
      handled = true;
      await GetStarted(context);
    }

    if (payload == 'USER_FEEDBACK_IS_HEALTHY') {
      handled = true;
      await HandlePayloadHealthy(context);
    }

    if (payload == 'USER_FEEDBACK_IS_SICK') {
      handled = true;
      await HandlePayloadUserSick(context);
    }

    if (payload.includes('USER_FEEDBACK_SICK')) {
      handled = true;
      await HandlePayloadSymptomReport(context);
    }

    if (payload.includes('USER_FEEDBACK_TESTED')) {
      handled = true;
      await HandlePayloadTested(context);
    }

    if (!handled) {
      await context.sendText('I have a bug, I did not handle action: ' + payload);
    }
  }

  console.log(context.event);
};
