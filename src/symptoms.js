const helpers = require('./helpers');
const Basic = require('./basicData');
const Analytics = require('./analytics');

const translations = helpers.translations;
const allValidSymptoms = [
    'fever',
    'cough',
    'difficulty_breathing',
    'tiredness',
    'headache',
    'diarrhea',
    'sore_throat',
    'no_smell'
];

const callbackTitles = allValidSymptoms.reduce((acc, x) => {
    acc[`USER_FEEDBACK_SYMPTOM_${x.toUpperCase()}`] = translations[x];
    return acc;
}, {
    USER_FEEDBACK_SYMPTOM_SOMETHING_ELSE: translations.something_else,
    USER_FEEDBACK_SYMPTOM_NOTHING_ELSE: translations.nothing_else,
});


// First time asking for symptoms
async function HandlePayloadUserSick(context) {
    await context.setState({
        nextAction: 'ASK_SYMPTOMS'
    });

    const symptomOptions = [...allValidSymptoms, 'something_else'];
    if (context.platform === 'telegram') {
        await AskSymptomsTG(context, symptomOptions);
    } else {
        await AskSymptomsFB(context, symptomOptions);
    }

}

async function AskSymptomsFB(context, symptomOptions) {
    await helpers.typing(context, 500);
    const initialSymptoms = helpers.getButtonsContent(symptomOptions.slice(0, 3), 'USER_FEEDBACK_SYMPTOM_');
    const extraSymptoms = helpers.getQuickReply(symptomOptions.slice(3), 'USER_FEEDBACK_SYMPTOM_');

    await context.sendButtonTemplate(translations.Symptoms.question, initialSymptoms);

    await helpers.typing(context, 1000);
    await context.sendText(translations.Symptoms.question_further, { quickReplies: extraSymptoms, });

    await helpers.typingOff(context);
}

async function AskSymptomsTG(context, symptomOptions, selectedSymptoms) {
    await helpers.typing(context, 100);

    const isFirstAsk = selectedSymptoms ? false : true;
    const question = isFirstAsk ? translations.Symptoms.question : randQuestionAskMore();

    await context.sendText(question, {
        replyMarkup: {
            keyboard: helpers.makeKeyboardTG(symptomOptions, 2, selectedSymptoms),
            resize_keyboard: true,
        }
    });

}

async function HandleNothingElse(context) {
    await context.setState({
        nextAction: 'NONE'
    });

    await helpers.typingOff(context);

    await helpers.typing(context, 500);

    await context.sendText('Okay, I see.');

    await helpers.typingOff(context);

    await Basic.HandleAskForTested(context);
}

async function HandlePayloadSymptomReport(context) {
    const eventKey = context.event.payload || helpers.getKeyByValue(callbackTitles, context.event.text);

    if (eventKey == 'USER_FEEDBACK_SYMPTOM_NOTHING_ELSE') {
        await HandleNothingElse(context);
    } else {
        await Analytics.SaveData(context, eventKey);

        const selectedSymptoms = extractSymptoms(context);

        const symptomsToAsk = remainingSymptoms(selectedSymptoms);

        if (symptomsToAsk.length > 0) {
            if (context.platform === 'telegram') {
                const symptomOptions = [...allValidSymptoms, 'something_else', 'nothing_else'];
                await AskSymptomsTG(context, symptomOptions, selectedSymptoms);
            } else {
                await AskSymptomsFurtherFB(context, symptomsToAsk);
            }
        } else {
            await HandleNothingElse(context);
        }
    }
}

async function AskSymptomsFurtherFB(context, symptomsToAsk) {
    const extraSymptoms = helpers.getQuickReply(symptomsToAsk.concat(['something_else']).concat(['nothing_else']), 'USER_FEEDBACK_SYMPTOM_');

    await helpers.typingOff(context);

    await helpers.typing(context, 2000);

    await context.sendText(randQuestionAskMore(), { quickReplies: extraSymptoms, });

    await helpers.typingOff(context);

}

function randQuestionAskMore() {
    const questionsMore = translations.Symptoms.question_more_arr;
    return questionsMore[Math.floor(Math.random() * questionsMore.length)];
}

function remainingSymptoms(currentSymptoms) {
    return allValidSymptoms.filter(x => !currentSymptoms.includes(x));
}

function extractSymptoms(context) {
    return helpers.extractEvents(context, 'USER_FEEDBACK_SYMPTOM');
}

module.exports = {
    HandlePayloadUserSick,
    HandlePayloadSymptomReport,
    extractSymptoms,
    remainingSymptoms
};