const translations = {
    GetStarted: {
        hello: 'Hello!',
        intro: 'Nice to see you the first time! I’m your carer chatbot.',
        question: 'How are you feeling today?',
        answer_healthy: 'Feeling healthy!',
        answer_sick: 'Feeling sick',
        healthy_advise: 'That’s great! Don’t forget to keep up the hygiene, wash your hands, stay at home and wear a facemask if you can!',
    },

    BasicData: {
        tested_question: 'Have you had a positive test result for COVID-19?',
        answer_positive: 'Yes, I have',
        answer_no_likely: 'No, but it’s likely',
        answer_no: 'No',
    },

    Symptoms: {
        question: 'I’m sorry, what are your symptoms?',
        question_further: 'Or maybe any of these?',
        question_more_arr: [
            'Anything else?',
            'And?',
            'Any more?',
        ]
    },

    Risk: {
        question_fever: 'How high is your body temperature?',
        question_cough: 'Is your cough dry?',
        question_cough_frequency: 'How frequently are you coughing?',
        question_difficulty_breathing: 'When do you feel difficult breathing?\n❗If you have difficulty breathing, call 112!',
        question_tiredness: 'How tired do you feel?',
        question_closeness_with_disease: 'Have you had close contact with someone infected with coronavirus (COVID-19)?',
        question_ongoing: 'Do you have any of the following diseases with ongoing treatment?\nHypertension, Cardiovascular disease, Lung disease, Cancer, Diabetes, Renal failure, Limited respiratory muscle function.',
        question_compromised_immune: 'Do you have a compromised immune system?',
        question_compromised_immune_example: 'For example, do you medicate with cytostatic drugs, cortisone tablets, autoimmune disease drugs such as rheumatoid arthritis or the like? \n\nHave you previously had an organ transplant, had your spleen removed, had untreated HIV or other conditions that impair the immune system?',
        question_age: 'How old are you?',
        result_high_risk: 'Your situation is a bit worrying. Please call 1177 for further telephone advice.\nRight now there may be long queues.',
        result_high_risk_2: 'If you have severe breathing problems, contact 112 instead.',
        result_high_risk_info_title: 'You can find more information below:',
        result_high_risk_info_link: 'About the coronavirus',
        result_low_risk_info_title: 'You can read more on 1177 Care guide as below:',
        result_low_risk_info_link_1: 'Cold and flu',
        result_low_risk_info_link_2: 'About staying home',
        result_low_risk_info_link_3: 'About the coronavirus',
        question_reminder: 'Would you like me to check with you again tomorrow?',
    },

    Extra: {
        question_continue_extra: 'I hope this is not too much to ask. In order to help scientists to research more about the virus, would you mind answering a few further questions?',


    },

    // Symptoms
    'fever': 'Fever',
    'cough': 'Cough',
    'headache': 'Headache',
    'diarrhea': 'Diarrhea',
    'sore_throat': 'Sore throat',
    'no_smell': 'Can’t taste/smell',
    'tiredness': 'Tiredness',
    'difficulty_breathing': 'Difficulty breathing',
    'something_else': 'Something else...',
    'nothing_else': 'Nothing else.',

    // Risk assessment
    'fever_ok': 'Below 38C',
    'fever_medium': '38.0 - 39.4C',
    'fever_high': 'Above 39.4C',

    'cough_dry': 'Yes, it’s dry',
    'cough_sputum': 'No, I have sputum',
    'cough_phlegm': 'No, I have phlegm',

    'cough_frequency_sometimes': 'Sometimes',
    'cough_frequency_often': 'Often',
    'cough_frequency_always': 'Almost all the time',

    'difficulty_breathing_light': 'On light effort',
    'difficulty_breathing_slightly': 'Slightly at rest',
    'difficulty_breathing_always': 'All the time',

    'tiredness_ok': 'Manage to stay up',
    'tiredness_some': 'Can be up briefly',
    'tiredness_high': 'Only up for toilet',
    'tiredness_bad': 'Can\'t get out of bed',

    'closeness_with_disease_no': 'No',
    'closeness_with_disease_yes': 'Yes, it’s confirmed',
    'closeness_with_disease_no_idea': 'I don’t know',

    'ongoing_none': 'None',
    'ongoing_hypertension': 'Hypertension',
    'ongoing_cardiovascular': 'Cardiac disease',
    'ongoing_lung': 'Lung disease',
    'ongoing_cancer': 'Cancer',
    'ongoing_diabetes': 'Diabetes',
    'ongoing_renal': 'Renal failure',

    'compromised_immune_yes': 'Yes',
    'compromised_immune_no': 'No',

    'age_less_60': 'Under 60',
    'age_60': '60-69',
    'age_70': '70-79',
    'age_80': '80 or older',

    // Reminders
    'reminder_morning': 'In the morning',
    'reminder_afternoon': 'In the afternoon',
    'reminder_no': 'No thanks',

    // Extra questions
    'activity_light_0_4': '0 - 4 hours',
    'activity_light_4_8': '4 - 8 hours',
    'activity_light_8_plus': '8+ hours',

    'activity_intense_0_2': '0 - 2 hours',
    'activity_intense_2_4': '2 - 4 hours',
    'activity_intense_4_plus': '4+ hours',

    'activity_stressed_1': '1',
    'activity_stressed_2': '2',
    'activity_stressed_3': '3',
    'activity_stressed_4': '4',
    'activity_stressed_5': '5',

    'caregiver_yes': 'Yes',
    'caregiver_no': 'No',
}

//Facebook messenger format
function generateOptions(array, prefix, postfix) {
    return array.map(x => {
        return {
            id: x,
            title: translations[x],
            payload: prefix + x.toUpperCase() + (postfix ? postfix : '').toUpperCase(),
        }
    });
}

function getButtonsContent(array, prefix, postfix) {
    return generateOptions(array, prefix, postfix).map(x => {
        return {
            type: 'postback',
            title: x.title,
            payload: x.payload,
        }
    });
}

function getQuickReply(array, prefix, postfix) {
    return generateOptions(array, prefix, postfix).map(x => {
        return {
            contentType: 'text',
            title: x.title,
            payload: x.payload,
        }
    });
}

//Telegram format
function makeReplyMarkupTG(buttonTitles, columnCount = 1, keepKeyboard = false) {
    return {
        keyboard: makeKeyboardTG(buttonTitles, columnCount),
        resize_keyboard: true,
        one_time_keyboard: !keepKeyboard,
    };

}

function makeKeyboardTG(buttonTitles, columnCount) {
    const buttons = buttonTitles.map(x => {
        return {
            text: x,
        }
    });

    // then add each button to row
    return buttons.reduce((acc, x, idx) => {
        if ((columnCount > 1) && (idx % columnCount !== 0)) {
            const currRow = acc.pop();
            currRow.push(x);
            acc.push(currRow);
        } else {
            acc.push([x]);
        }

        return acc;
    }, []);

}

function extractEvents(context, prefix) {
    const state = context.state.events || [];

    const currentSymptoms = state
        .filter(x => x.event.includes(prefix))
        .map(x => x.event.replace(prefix + '_', '').toLowerCase());

    return currentSymptoms;
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

async function typing(context, milliseconds) {
    if (context.platform === 'telegram') {
        await context.sendChatAction('typing');
        await context.typing(milliseconds);
    } else {
        await context.typing(milliseconds);
    }
}

async function typingOff(context) {
    if (context.platform === 'messenger') {
        await context.typingOff();
    }
}

async function routeByPlatform(context, functionTG, functionFB) {
    if (context.platform === 'telegram') {
        await functionTG(context);
    } else {
        await functionFB(context);
    }
}

module.exports = {
    translations,
    getButtonsContent,
    getQuickReply,
    makeReplyMarkupTG,
    extractEvents,
    getKeyByValue,
    typing,
    typingOff,
    routeByPlatform,
}