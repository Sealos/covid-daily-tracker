
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

async function HandleZipCodeReceived(context) {
    const nextAction = context.state.nextAction || '';

    if (nextAction !== 'ASK_ZIPCODE') {
        return;
    }

    const text = context.event.text || '';

    const possibleNumbers = text.match(/\d+/g);

    let numbers = possibleNumbers ? possibleNumbers.map(Number).map(x => x.toString()).join('') : '';

    const isValid = numbers.length == 5;

    if (text.includes('no') || text.includes('No') || text.includes('stop')) {
        await context.setState({
            nextAction: 'NONE',
        });

        await context.typing(2000);
        await context.sendText('No problem!');
        context.typingOff();

        return
    }

    if (!isValid) {
        await context.typing(4000);
        await context.sendText('Hmm, I didn\'t understand that\nCould you send that again?');
        context.typingOff();
    } else {
        await context.setState({
            nextAction: 'NONE',
        });

        // Handle zipcode
        await context.typing(4000);
        await context.sendText('Thank you.\nYou can come back tomorrow to report how you\'re feeling\nI can help you keep track of your symptoms');
        context.typingOff();
    }
}

async function HandleAskForPostalCode(context) {
    await context.setState({
        nextAction: 'ASK_ZIPCODE',
    });

    await context.typing(4000);
    await context.sendText('We are building a analytics for everyone to use. Help us be better!\nWould you mind sharing your postal code?');
    context.typingOff();
}


module.exports = {
    TrackText,
    TrackPayload,
    HandleAskForPostalCode,
    HandleZipCodeReceived
};