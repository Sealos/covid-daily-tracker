const helpers = require('./helpers');
const Analytics = require('./analytics');
const Goodbye = require('./goodbye');

const translations = helpers.translations.Extra;

const CALLBACK_KEY_PREFIX = 'USER_FEEDBACK_CONTINUE_EXTRA_';

// replies's translation keys
const REPLIES = {
    START: [
        'start_yes',
        'start_no'
    ],
    ACTIVITY_LIGHT: [
        'activity_light_0_4',
        'activity_light_4_8',
        'activity_light_8_plus',
    ],
    ACTIVITY_INTENSE: [
        'activity_intense_0_2',
        'activity_intense_2_4',
        'activity_intense_4_plus'
    ],
    STRESSED: [
        'stressed_1',
        'stressed_2',
        'stressed_3',
        'stressed_4',
        'stressed_5'
    ],
    CAREGIVER: [
        'caregiver_yes',
        'caregiver_no'
    ],
}

async function StartExtraQuestion(context) {
    await context.setState({
        nextAction: 'CONTINUE_EXTRA'
    });

    await helpers.typing(context, 1200);

    if (context.platform === 'telegram') {
        await context.sendText(translations.question_continue_extra, {
            replyMarkup: makeReplyMarkupTG(REPLIES.START)
        });
    } else {
        await context.sendText(translations.question_continue_extra, {
            quickReplies: makeQuickRepliesFB(REPLIES.START)
        });
    }

    await helpers.typingOff(context);
}

async function AskActivityLight(context) {
    await context.setState({
        nextAction: 'EXTRA_ASK_ACTIVITY_LIGHT'
    });

    await helpers.typing(context, 1000);

    await context.sendText(translations.question_activity);

    await helpers.typing(context, 1000);

    if (context.platform === 'telegram') {
        await context.sendText(translations.question_activity_light, {
            replyMarkup: makeReplyMarkupTG(REPLIES.ACTIVITY_LIGHT)
        });
    } else {
        await context.sendText(translations.question_activity_light, {
            quickReplies: makeQuickRepliesFB(REPLIES.ACTIVITY_LIGHT)
        });
    }

    await helpers.typingOff(context);
}

async function AskActivityIntense(context) {
    await context.setState({
        nextAction: 'EXTRA_ASK_ACTIVITY_INTENSE'
    });

    await helpers.typing(context, 1000);

    if (context.platform === 'telegram') {
        await context.sendText(translations.question_activity_intense, {
            replyMarkup: makeReplyMarkupTG(REPLIES.ACTIVITY_INTENSE)
        });
    } else {
        await context.sendText(translations.question_activity_intense, {
            quickReplies: makeQuickRepliesFB(REPLIES.ACTIVITY_INTENSE)
        });
    }

    await helpers.typingOff(context);
}

async function AskIfStressed(context) {
    await context.setState({
        nextAction: 'EXTRA_ASK_STRESSED'
    });

    await helpers.typing(context, 1000);

    if (context.platform === 'telegram') {
        await context.sendText(translations.question_stressed, {
            replyMarkup: makeReplyMarkupTG(REPLIES.STRESSED)
        });
    } else {
        await context.sendText(translations.question_stressed, {
            quickReplies: makeQuickRepliesFB(REPLIES.STRESSED)
        });
    }

    await helpers.typingOff(context);
}

async function AskIfCaregiver(context) {
    await context.setState({
        nextAction: 'EXTRA_ASK_CAREGIVER'
    });

    await helpers.typing(context, 1000);

    if (context.platform === 'telegram') {
        await context.sendText(translations.question_caregiver, {
            replyMarkup: makeReplyMarkupTG(REPLIES.CAREGIVER)
        });
    } else {
        await context.sendText(translations.question_caregiver, {
            quickReplies: makeQuickRepliesFB(REPLIES.CAREGIVER)
        });
    }

    await helpers.typingOff(context);
}

async function FinishQuestions(context) {
    await context.setState({
        nextAction: 'NONE'
    });

    await helpers.typing(context, 2000);

    await context.sendText(translations.thank_you);

    await helpers.typingOff(context);

    await Goodbye.Goodbye(context);
}

async function HandleContinueExtra(context) {
    const callbackKey = context.event.payload || lookupCallbackKey(context.event.text, REPLIES.START);

    if (callbackKey === 'USER_FEEDBACK_CONTINUE_EXTRA_START_NO') {
        await helpers.typing(context, 500);
        await context.sendText('That\'s alright!');
        await helpers.typingOff(context);

        await Goodbye.Goodbye(context);

        return;
    }

    if (callbackKey === 'USER_FEEDBACK_CONTINUE_EXTRA_START_YES') {
        await helpers.typing(context, 500);
        await context.sendText('Thank you! Here it goes.');
        await helpers.typingOff(context);

        await AskExtraQuestions(context);
    }
}

async function AskExtraQuestions(context) {
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

async function HandleExtraReply(context) {
    const nextAction = context.state.nextAction || '';
    if (!nextAction.includes('EXTRA_ASK_')) {
        return;
    }

    const questionKey = nextAction.replace('EXTRA_ASK_', '');
    const callbackKey = context.event.payload || lookupCallbackKey(context.event.text, REPLIES[questionKey]);

    if (!callbackKey) {
        await context.sendText(`Sorry, I don\'t understand.`);
        await AskExtraQuestions(context);
        return;
    }

    await Analytics.SaveEvent(context, callbackKey);

    const previousAnswers = extractExtraQuestionsAnswers(context);

    const currentAnswer = callbackKey.toLowerCase();

    if (previousAnswers.includes('activity_light_0_4') && currentAnswer.includes('activity_intense_0_2')) {
        await helpers.typing(context, 1200);
        await context.sendText('Keeping yourself physically active helps to support the immune system. Why not try to incorporate some physical activity in your daily routines, such as a brisk walk or jog, or doing some yoga at home?');
        await helpers.typingOff(context);
    } else if (previousAnswers.includes('activity_light_8_plus') && currentAnswer.includes('activity_intense_4_plus')) {
        await helpers.typing(context, 1200);
        await context.sendText('Physical activity and hard training is great and will help to keep you fit and strong. However, make sure you also schedule sufficient recovery time.');
        await helpers.typingOff(context);
    } else if (currentAnswer.includes('activity_intense')) {
        await helpers.typing(context, 800);
        await context.sendText('Regular physical activity supports the immune system and keeps us fit and healthy. Keep it up!');
        await helpers.typingOff(context);
    }

    if (currentAnswer.includes('stressed_3') || currentAnswer.includes('stressed_4') || currentAnswer.includes('stressed_5')) {
        await helpers.typing(context, 1600);
        await context.sendText('Looking after our mental wellbeing is important during the pandemic.\nTry to avoid media sources if you find them stressful, take some time out in nature, or practice mindfulness meditation for 10 min each day.');
        await helpers.typingOff(context);
    } else if (currentAnswer.includes('stressed_1') || currentAnswer.includes('stressed_2')) {
        await helpers.typing(context, 1600);
        await context.sendText('Glad to know you\'re feeling fine! It\'s important to care for our mental wellbeing during the pandemic. Keep in mind that social distancing doesn\'t mean social isolation.Try to keep the social connection through digital means!');
        await helpers.typingOff(context);
    }

    if (currentAnswer.includes('caregiver_yes')) {
        await helpers.typing(context, 1200);

        const url = 'https://www.hopkinsmedicine.org/health/conditions-and-diseases/coronavirus/coronavirus-caregiving-for-the-elderly';
        const urlTitle = 'Read more here';
        if (context.platform === 'telegram') {
            await context.sendText(translations.advise_caregiver_yes, {
                replyMarkup: {
                    inlineKeyboard: [[{
                        text: urlTitle,
                        url: url,
                    }]]
                }
            });
        } else {
            await context.sendButtonTemplate(translations.advise_caregiver_yes, [{
                type: 'web_url',
                url: url,
                title: urlTitle,
            }]);
        }

        await helpers.typingOff(context);

    } else if (currentAnswer.includes('caregiver_no')) {
        await helpers.typing(context, 1200);
        await context.sendText(translations.advise_caregiver_no);
        await helpers.typingOff(context);
    }

    await AskExtraQuestions(context);
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

function makeQuickRepliesFB(repliesKeyArray) {
    return helpers.makeQuickRepliesFB(repliesKeyArray, CALLBACK_KEY_PREFIX, translations);
}

function makeReplyMarkupTG(repliesKeyArray) {
    return helpers.makeReplyMarkupTG(helpers.translateArray(repliesKeyArray, translations));
}

function lookupCallbackKey(textValue, translationKeys) {
    return helpers.lookupCallbackKey(textValue, translations, translationKeys, CALLBACK_KEY_PREFIX);
}

module.exports = {
    StartExtraQuestion,
    HandleContinueExtra,
    HandleExtraReply,
};