const helpers = require('./helpers');
const Basic = require('./basicData');
const Analytics = require('./analytics');

const translations = helpers.translations.Symptoms;

const CALLBACK_KEY_PREFIX = 'USER_FEEDBACK_SYMPTOM_';

const SYMPTOMS = [
    'fever',
    'cough',
    'difficulty_breathing',
    'tiredness',
    'headache',
    'diarrhea',
    'sore_throat',
    'no_smell'
];

const REPLIES = [
    ...SYMPTOMS,
    'something_else',
    'nothing_else',
];


// First time asking for symptoms
async function HandlePayloadUserSick(context) {
    await context.setState({
        nextAction: 'ASK_SYMPTOMS'
    });

    const symptomOptions = [...SYMPTOMS, 'something_else'];
    if (context.platform === 'telegram') {
        await AskSymptomsTG(context, symptomOptions);
    } else {
        await AskSymptomsFB(context, symptomOptions);
    }
}

async function AskSymptomsFB(context, optionKeys) {
    await helpers.typing(context, 500);

    const top3Symptoms = optionKeys.slice(0, 3);
    const restSymptoms = optionKeys.slice(3);

    await context.sendButtonTemplate(translations.question, helpers.makeButtonsFB(top3Symptoms, 'USER_FEEDBACK_SYMPTOM_', translations));

    await helpers.typing(context, 1000);
    await context.sendText(translations.question_further, {
        quickReplies: makeQuickRepliesFB(restSymptoms)
    });

    await helpers.typingOff(context);
}

async function HandleNothingElse(context) {
    await context.setState({
        nextAction: 'NONE'
    });

    await helpers.sendText(context, 'Okay, I see.');

    await Basic.HandleAskForTested(context);
}

async function HandlePayloadSymptomReport(context) {
    const eventKey = context.event.payload || helpers.lookupCallbackKey(context.event.text, translations, REPLIES, 'USER_FEEDBACK_SYMPTOM_');

    if (eventKey == 'USER_FEEDBACK_SYMPTOM_NOTHING_ELSE') {
        await HandleNothingElse(context);
    } else {
        await Analytics.SaveEvent(context, eventKey);

        const selectedSymptoms = extractSymptoms(context);

        const symptomsToAsk = remainingSymptoms(selectedSymptoms);

        if (symptomsToAsk.length > 0) {
            if (context.platform === 'telegram') {
                await AskSymptomsTG(context, REPLIES, selectedSymptoms);
            } else {
                await AskSymptomsFurtherFB(context, [...symptomsToAsk, 'something_else', 'nothing_else']);
            }
        } else {
            await HandleNothingElse(context);
        }
    }
}

async function AskSymptomsFurtherFB(context, optionKeys) {
    await helpers.typingOff(context);

    await helpers.typing(context, 500);

    await context.sendText(randQuestionAskMore(), {
        quickReplies: makeQuickRepliesFB(optionKeys),
    });

    await helpers.typingOff(context);
}

async function AskSymptomsTG(context, optionKeys, selectedSymptomKeys = undefined) {
    await helpers.typing(context, 400);

    const isFirstAsk = selectedSymptomKeys ? false : true;
    const question = isFirstAsk ? translations.question : getRandomQuestion();

    const symptomTitles = optionKeys.map(x => {
        const isSelected = selectedSymptomKeys && selectedSymptomKeys.indexOf(x) != -1 || false;
        return (isSelected ? '✅' : '') + translations[x];
    });

    await context.sendText(question, {
        replyMarkup: helpers.makeReplyMarkupTG(symptomTitles, 2, true)
    });
}

function getRandomQuestion() {
    const questionsMore = translations.question_more_arr;
    return questionsMore[Math.floor(Math.random() * questionsMore.length)];
}

function remainingSymptoms(currentSymptoms) {
    return SYMPTOMS.filter(x => !currentSymptoms.includes(x));
}

function extractSymptoms(context) {
    return helpers.extractEvents(context, 'USER_FEEDBACK_SYMPTOM');
}


function makeQuickRepliesFB(repliesKeyArray) {
    return helpers.makeQuickRepliesFB(repliesKeyArray, CALLBACK_KEY_PREFIX, translations);
}

module.exports = {
    HandlePayloadUserSick,
    HandlePayloadSymptomReport,
    extractSymptoms,
    remainingSymptoms
};