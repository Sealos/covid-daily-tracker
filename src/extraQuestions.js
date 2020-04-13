const helpers = require('./helpers');
const Analytics = require('./analytics');
const Goodbye = require('./goodbye');

const translations = helpers.translations.Extra;

async function StartExtraQuestion(context) {
    await context.setState({
        nextAction: 'CONTINUE_EXTRA'
    });

    await helpers.typing(context, 4000);
    await context.sendText(translations.question_continue_extra, {
        quickReplies: [
            {
                contentType: 'text',
                title: 'Sure!',
                payload: 'USER_FEEDBACK_CONTINUE_EXTRA_START_YES',
            },
            {
                contentType: 'text',
                title: 'Sorry, I can\'t',
                payload: 'USER_FEEDBACK_CONTINUE_EXTRA_START_NO',
            },
        ]
    });

    await helpers.typingOff(context);
}

async function AskActivityLight(context) {
    await helpers.typing(context, 2000);

    const replies = helpers.makeQuickRepliesFB(['activity_light_0_4', 'activity_light_4_8', 'activity_light_8_plus'], 'USER_FEEDBACK_CONTINUE_EXTRA_', translations);

    await context.sendText('In an average week when you are not sick, how much physical activity do you tend to do?');

    await helpers.typing(context, 2000);

    await context.sendText('(1) Light-moderate activity (e.g. a brisk walk or bike ride)', { quickReplies: replies });

    await helpers.typingOff(context);
}

async function AskActivityIntense(context) {
    await helpers.typing(context, 2000);

    const replies = helpers.makeQuickRepliesFB(['activity_intense_0_2', 'activity_intense_2_4', 'activity_intense_4_plus'], 'USER_FEEDBACK_CONTINUE_EXTRA_', translations);

    await context.sendText('(2) High-intensity activity (such as weight training, HIIT or fast running)', { quickReplies: replies });

    await helpers.typingOff(context);
}

async function AskIfStressed(context) {
    await helpers.typing(context, 2000);

    const replies = helpers.makeQuickRepliesFB(['activity_stressed_1', 'activity_stressed_2', 'activity_stressed_3', 'activity_stressed_4', 'activity_stressed_5'], 'USER_FEEDBACK_CONTINUE_EXTRA_');

    await context.sendText('How would you rate your general stress levels at the moment, on a scale of 1 - 5?\n\n1 - I am not at all stressed or anxious.\n5 - I feel very stressed and/or anxious', { quickReplies: replies });

    await helpers.typingOff(context);
}

async function AskIfCaregiver(context) {
    await helpers.typing(context, 2000);

    const replies = helpers.makeQuickRepliesFB(['caregiver_yes', 'caregiver_no'], 'USER_FEEDBACK_CONTINUE_EXTRA_', translations);

    await context.sendText('Are you a caregiver to a vulnerable person?', { quickReplies: replies });

    await helpers.typingOff(context);
}

async function FinishQuestions(context) {
    await helpers.typing(context, 2000);

    await context.sendText('That\'s all I would like to ask for today. Thank you for helping us to combat this crisis.');

    await helpers.typingOff(context);

    await Goodbye.Goodbye(context);
}

async function HandleContinueExtra(context) {

    const payload = context.event.payload;

    if (payload === 'USER_FEEDBACK_CONTINUE_EXTRA_START_NO') {
        await helpers.typing(context, 2000);
        await context.sendText('That\s alright!');
        await helpers.typingOff(context);

        await Goodbye.Goodbye(context);

        return;
    }

    if (payload === 'USER_FEEDBACK_CONTINUE_EXTRA_START_YES') {
        await helpers.typing(context, 2000);
        await context.sendText('Thank you! Here it goes.');
        await helpers.typingOff(context);
    }

    await HandleQuestionAnswers(context);

    const performedExtraQuestions = extractPerformedExtraQuestions(context);

    if (!performedExtraQuestions.includes('activity_light')) {
        await AskActivityLight(context);
    } else if (!performedExtraQuestions.includes('activity_intense')) {
        await AskActivityIntense(context);
    } else if (!performedExtraQuestions.includes('stressed')) {
        await AskIfStressed(context);
    } else if (!performedExtraQuestions.includes('caregiver')) {
        await AskIfCaregiver(context);
    } else {
        await FinishQuestions(context);
    }
}

async function HandleQuestionAnswers(context) {
    const payload = context.event.payload;

    if (!payload) {
        return;
    }

    const eventKey = context.event.payload || helpers.getKeyByValue(callbackTitles, context.event.text);
    await Analytics.SaveData(context, eventKey);

    const previousAnswers = extractExtraQuestionsAnswers(context);

    const currentAnswer = payload.toLowerCase();

    if (previousAnswers.includes('activity_light_0_4') && currentAnswer.includes('activity_intense_0_2')) {
        await helpers.typing(context, 4000);
        await context.sendText('Keeping yourself physically active helps to support the immune system. Why not try to incorporate some physical activity in your daily routines, such as a brisk walk or jog, or doing some yoga at home?');
        await helpers.typingOff(context);
    } else if (previousAnswers.includes('activity_light_8_plus') && currentAnswer.includes('activity_intense_4_plus')) {
        await helpers.typing(context, 4000);
        await context.sendText('Physical activity and hard training is great and will help to keep you fit and strong. However, make sure you also schedule sufficient recovery time.');
        await helpers.typingOff(context);
    } else if (currentAnswer.includes('activity_intense')) {
        await helpers.typing(context, 2000);
        await context.sendText('Regular physical activity supports the immune system and keeps us fit and healthy. Keep it up!');
        await helpers.typingOff(context);
    }

    if (currentAnswer.includes('stressed_3') || currentAnswer.includes('stressed_4') || currentAnswer.includes('stressed_5')) {
        await helpers.typing(context, 5000);
        await context.sendText('Looking after our mental wellbeing is important during the pandemic.\nTry to avoid media sources if you find them stressful, take some time out in nature, or practice mindfulness meditation for 10 min each day.');
        await helpers.typingOff(context);
    } else if (currentAnswer.includes('stressed_1') || currentAnswer.includes('stressed_2')) {
        await helpers.typing(context, 5000);
        await context.sendText('Glad to know you\'re feeling fine! It\'s important to care for our mental wellbeing during the pandemic. Keep in mind that social distancing doesn\'t mean social isolation.Try to keep the social connection through digital means!');
        await helpers.typingOff(context);
    }

    if (currentAnswer.includes('caregiver_yes')) {
        await helpers.typing(context, 5000);

        const buttonContent = [
            {
                type: 'web_url',
                url: 'https://www.hopkinsmedicine.org/health/conditions-and-diseases/coronavirus/coronavirus-caregiving-for-the-elderly',
                title: 'Read more here',
            },
        ];
        const text = 'As a caregiver you should take all the precautions you can to keep yourself well, such as keeping good hygiene, avoiding crowds, etc.\nYou should practice physical distancing but not social isolation. While keeping our older adults safe, we should also keep in mind that social isolation can have a negative impact on older people’s immunity and mental health. You may help them to access online services and outreach for spiritual solace and supports.';

        await context.sendButtonTemplate(text, buttonContent);
        await helpers.typingOff(context);
    } else if (currentAnswer.includes('caregiver_no')) {
        await helpers.typing(context, 5000);
        await context.sendText('I see. Try to keep an eye on the old folks in your neighborhood if you can. They are very vulnerable during this time, try to reach out to offer help if possible.');
        await helpers.typingOff(context);
    }
}

const extraQuestions = [
    'activity_light',
    'activity_intense',
    'stressed',
    'caregiver'
]

function extractPerformedExtraQuestions(context) {
    const answers = extractExtraQuestionsAnswers(context);

    return extraQuestions.filter(question => {
        let isIncluded = false;
        answers.forEach(element => {
            isIncluded = isIncluded || element.includes(question);
        });

        return isIncluded;
    })
}

function extractExtraQuestionsAnswers(context) {
    return helpers.extractEvents(context, 'USER_FEEDBACK_CONTINUE_EXTRA');
}

module.exports = {
    StartExtraQuestion,
    HandleContinueExtra,
};