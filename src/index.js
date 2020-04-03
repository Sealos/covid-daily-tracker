const { withProps } = require('bottender');
const { router, text } = require('bottender/router');


async function HandleDelivery(context) {
  await context.sendText(`Watermark: ${context.event.delivery.watermark}`);
}

async function HandleRead(context) {
  await context.sendText(`Watermark: ${context.event.read.watermark}`);
}

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
      ]);

      await context.sendText(`received the text message: ${context.event.text}`);
    }
  }

  if (context.event.isPayload) {
    let previousPayloads = context.state.payloads;

    const newPayload = {
      event: context.event.payload,
      date: new Date()
    };

    previousPayloads.push(newPayload);

    context.setState({
      payloads: previousPayloads,
    });

    await context.sendText(`received the payload: ${context.event.payload}`);
  }

  if (context.event.isLikeSticker) {
    await context.sendText(':D');
  }

  if (context.event.isDelivery) {
    return HandleDelivery;
  }
  if (context.event.isRead) {
    return HandleRead;
  }
};
