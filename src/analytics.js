
async function Track(context) {

    if (context.event.isPayload) {
        await TrackPayload(context);
    } else if (context.event.isText) {
        await TrackText(context);
    }

}

async function TrackText(context) {
    const currentText = context.event.text;
    const hasPayload = !!(context.event.payload);

    if (currentText && !hasPayload) {
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

module.exports = {
    Track,
};