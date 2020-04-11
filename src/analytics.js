
async function Track(context) {

    if (context.event.isPayload) {
        await TrackPayload(context);
    } else if (context.event.isText) {
        await TrackText(context);
    }

}

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

async function TrackEvent(context, eventKey) {
    const currentEvent = eventKey;

    if (currentEvent) {
        let previousEvents = context.state.events;

        const newEvent = {
            event: currentEvent,
            date: new Date()
        };

        previousEvents.push(newEvent);

        await context.setState({
            events: previousEvents,
        });
    }
}

module.exports = {
    Track,
    TrackEvent,
};