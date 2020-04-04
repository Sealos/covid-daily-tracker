async function ResetState(context) {
    return await context.setState({
        nextAction: 'NONE',
        payloads: [],
        text: []
    });
}

async function GetStarted(context) {

    await ResetState(context);

    await context.typing(2000);

    await context.sendText('Hello!');

    await context.typingOff();

    await context.typing(4000);


    await context.sendText("How are you feeling today?", {
        quickReplies: [
            {
                contentType: 'text',
                title: 'Feeling healthy!',
                payload: 'USER_FEEDBACK_IS_HEALTHY',
            },
            {
                contentType: 'text',
                title: 'Feeling sick',
                payload: 'USER_FEEDBACK_IS_SICK',
            },
        ]
    });

    await context.typingOff();
}

module.exports = { GetStarted, ResetState };