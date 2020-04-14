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

    await sendTextWithReplies(context, translations.question_continue_extra, REPLIES.START);
}

async function AskActivityLight(context) {
    await context.setState({
        nextAction: 'EXTRA_ASK_ACTIVITY_LIGHT'
    });

    await helpers.sendText(context, translations.question_activity);

    await sendTextWithReplies(context, translations.question_activity_light, REPLIES.ACTIVITY_LIGHT);
}

async function AskActivityIntense(context) {
    await context.setState({
        nextAction: 'EXTRA_ASK_ACTIVITY_INTENSE'
    });

    await sendTextWithReplies(context, translations.question_activity_intense, REPLIES.ACTIVITY_INTENSE);
}

async function AskIfStressed(context) {
    await context.setState({
        nextAction: 'EXTRA_ASK_STRESSED'
    });

    await sendTextWithReplies(context, translations.question_stressed, REPLIES.STRESSED);
}

async function AskIfCaregiver(context) {
    await context.setState({
        nextAction: 'EXTRA_ASK_CAREGIVER'
    });

    await sendTextWithReplies(context, translations.question_caregiver, REPLIES.CAREGIVER);
}

async function FinishQuestions(context) {
    await context.setState({
        nextAction: 'NONE'
    });

    await helpers.sendText(context, translations.thank_you);

    await Goodbye.Goodbye(context);
}

async function HandleContinueExtra(context) {
    const callbackKey = context.event.payload || lookupCallbackKey(context.event.text, REPLIES.START);

    if (callbackKey === 'USER_FEEDBACK_CONTINUE_EXTRA_START_NO') {
        await helpers.sendText(context, translations.start_no_response);

        await Goodbye.Goodbye(context);

        return;
    }

    if (callbackKey === 'USER_FEEDBACK_CONTINUE_EXTRA_START_YES') {
        await helpers.sendText(context, translations.start_yes_response);

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
        await helpers.sendText(context, translations.do_not_understand);
        await AskExtraQuestions(context);
        return;
    }

    await Analytics.SaveEvent(context, callbackKey);

    const previousAnswers = extractExtraQuestionsAnswers(context);

    const currentAnswer = callbackKey.toLowerCase();

    if (previousAnswers.includes('activity_light_0_4') && currentAnswer.includes('activity_intense_0_2')) {
        await helpers.sendText(context, translations.advise_low_activity);
    } else if (previousAnswers.includes('activity_light_8_plus') && currentAnswer.includes('activity_intense_4_plus')) {
        await helpers.sendText(context, translations.advise_high_activity);
    } else if (currentAnswer.includes('activity_intense')) {
        await helpers.sendText(context, translations.advise_moderate_activity);
    }

    if (currentAnswer.includes('stressed_3') || currentAnswer.includes('stressed_4') || currentAnswer.includes('stressed_5')) {
        await helpers.sendText(context, translations.advise_stress_high);
    } else if (currentAnswer.includes('stressed_1') || currentAnswer.includes('stressed_2')) {
        await helpers.sendText(context, translations.advise_stress_low);
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
        await helpers.sendText(context, translations.advise_caregiver_no);
    }

    await AskExtraQuestions(context);
}



function extractPerformedExtraQuestions(context) {
    const answers = extractExtraQuestionsAnswers(context);

    const extraQuestions = [
        'activity_light',
        'activity_intense',
        'stressed',
        'caregiver'
    ];

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

async function sendTextWithReplies(context, text, repliesKeyArray) {
    return await helpers.sendTextWithReplies(context, text, repliesKeyArray, translations, CALLBACK_KEY_PREFIX);
}

function lookupCallbackKey(textValue, translationKeys) {
    return helpers.lookupCallbackKey(textValue, translations, translationKeys, CALLBACK_KEY_PREFIX);
}

module.exports = {
    StartExtraQuestion,
    HandleContinueExtra,
    HandleExtraReply,
};