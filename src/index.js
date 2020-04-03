module.exports = async function App(context) {

  if (context.event.isText) {
    if (context.event.text == 'state') {

      const state = JSON.stringify(context.state);
      await context.sendText(`This is what I know: ${state}`);
    } else {

      let previousTexts = context.state.texts || [];

      const newText = {
        text: context.event.text,
        date: new Date()
      };

      previousTexts.push(newText);

      context.setState({
        text: previousTexts,
      });

      console.log(context);

      await context.sendButtonTemplate("Hello!, how are you feeling today?", [
        {
          type: 'postback',
          title: 'Feeling healthy!',
          payload: 'USER_FEEDBACK_IS_HEALTHY',
        },
        {
          type: 'postback',
          title: 'I\'m not sure...',
          payload: 'USER_FEEDBACK_IS_NOT_SURE',
        },
        {
          type: "phone_number",
          title: "Call for help",
          payload: "1177"
        }
      ]);
    }

    await context.sendText('Hi!', {
      quickReplies: [
        {
          contentType: 'text',
          title: 'Test 1',
          payload: 'Test2',
        },
        {
          contentType: 'user_phone_number',
        },
        {
          contentType: 'user_email',
        },
      ],
    });
  }

  if (context.event.isPayload) {
    let previousPayloads = context.state.payloads;

    const currentPayload = context.event.payload;

    const newPayload = {
      event: currentPayload,
      date: new Date()
    };

    previousPayloads.push(newPayload);

    context.setState({
      payloads: previousPayloads,
    });

  }

  if (context.event.isLikeSticker) {
    await context.sendText(':D');
  }
};
