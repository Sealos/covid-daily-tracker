async function ExtraQuestion(context) {

    await context.typing(4000);
    await context.sendText('I hope this is not too much to ask. As we still don\'t know much about this virus yet, the scientists would desperately want to know more about this disease. Would you mind to answer a few further questions for research purposes?\n\nThe below data will only be collected anonymously.', {
        quickReplies: [
            {
                contentType: 'text',
                title: 'Sure!',
                payload: 'USER_FEEDBACK_CONTINUE_EXTRA_YES',
            },
            {
                contentType: 'text',
                title: 'Sorry, I can\'t',
                payload: 'USER_FEEDBACK_CONTINUE_EXTRA_NO',
            },
        ]
    });
    context.typingOff();

}

async function HandleContinueExtra(context) {

    const payload = context.event.payload;

    if (payload === 'USER_FEEDBACK_CONTINUE_EXTRA_NO') {
        await context.typing(2000);
        await context.sendText('That\s alright!');
        content.typingOff();

        //GOODBYE

    }

    if (payload === 'USER_FEEDBACK_CONTINUE_EXTRA_YES') {
        await context.typing(2000);
        await context.sendText('Thank you! Here it goes.');
        content.typingOff();

        await context.typing(4000);
        await context.sendText('In an average week when you are not sick, how much physical activity do you tend to do?');
        content.typingOff();

        await context.typing(2000);
        await context.sendText('In an average week when you are not sick, how much physical activity do you tend to do?');
        content.typingOff();



    }

}


module.exports = {
    ExtraQuestion,
    HandleContinueExtra,
};