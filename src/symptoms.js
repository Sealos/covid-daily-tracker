const helpers = require('./helpers');
const Basic = require('./basicData');
const Analytics = require('./analytics');

const translations = helpers.translations.Symptoms;
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

    const top3Symptoms = symptomOptions.slice(0, 3);
    const restSymptoms = symptomOptions.slice(3);

    await context.sendButtonTemplate(translations.question, helpers.makeButtonsFB(top3Symptoms, 'USER_FEEDBACK_SYMPTOM_', translations));

    await helpers.typing(context, 1000);
    await context.sendText(translations.question_further, {
        quickReplies: helpers.makeQuickRepliesFB(restSymptoms, 'USER_FEEDBACK_SYMPTOM_', translations)
    });

    await helpers.typingOff(context);
}

async function AskSymptomsTG(context, symptomKeys, selectedSymptomKeys = undefined) {
    await helpers.typing(context, 100);

    const isFirstAsk = selectedSymptomKeys ? false : true;
    const question = isFirstAsk ? translations.question : randQuestionAskMore();

    const symptomTitles = symptomKeys.map(x => {
        const isSelected = selectedSymptomKeys && selectedSymptomKeys.indexOf(x) != -1 || false;
        return (isSelected ? '✅' : '') + translations[x];
    });

    await context.sendText(question, {
        replyMarkup: helpers.makeReplyMarkupTG(symptomTitles, 2, true)
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
        await Analytics.SaveEvent(context, eventKey);

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
    const extraSymptoms = helpers.makeQuickRepliesFB(symptomsToAsk.concat(['something_else']).concat(['nothing_else']), 'USER_FEEDBACK_SYMPTOM_', translations);

    await helpers.typingOff(context);

    await helpers.typing(context, 2000);

    await context.sendText(randQuestionAskMore(), { quickReplies: extraSymptoms, });

    await helpers.typingOff(context);

}

function randQuestionAskMore() {
    const questionsMore = translations.question_more_arr;
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