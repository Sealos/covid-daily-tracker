
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

async function HandleZipCodeReceived(context, nextFlow) {
    const nextAction = context.state.nextAction || '';

    if (nextAction !== 'ASK_ZIPCODE') {
        return;
    }

    const text = context.event.text || '';

    const possibleNumbers = text.match(/\d+/g);

    let numbers = possibleNumbers ? possibleNumbers.map(Number).map(x => x.toString()).join('') : '';

    const isValid = numbers.length == 5;

    if (text.startsWith('no') || text.startsWith('No') || text.startsWith('stop')) {
        await context.setState({
            nextAction: 'NONE',
        });

        await context.typing(2000);
        await context.sendText('No problem!');
        await context.typingOff();

        nextFlow(context);

        return
    }

    if (!isValid) {
        await context.typing(4000);
        await context.sendText('Hmm, I didn\'t understand.\nWhat is your postal code again?');
        await context.typingOff();
    } else {
        await context.setState({
            nextAction: 'NONE',
        });

        // Handle zipcode
        await context.typing(4000);
        await context.sendText('Thank you.');
        await context.typingOff();

        nextFlow(context);
    }
}

async function HandleAskForPostalCode(context) {
    await context.setState({
        nextAction: 'ASK_ZIPCODE',
    });

    await context.typing(2000);
    await context.sendText('Where do you live? Would you mind sharing your postal code?');

    await context.typing(4000);

    await context.sendText('We are collecting this for the cause of pandemic-related data collection, which is crucial for the public to feel informed and healthcare services to evaluate and manage the on-going crisis. All data collected is kept anonymous.');

    await context.typingOff();
}


module.exports = {
    TrackText,
    TrackPayload,
    HandleAskForPostalCode,
    HandleZipCodeReceived
};