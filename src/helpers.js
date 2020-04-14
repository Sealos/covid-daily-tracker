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
        positive: 'Yes, I have',
        no_likely: 'No, but it’s likely',
        no: 'No',
    },

    Symptoms: {
        question: 'I’m sorry, what are your symptoms?',
        question_further: 'Or maybe any of these?',
        question_more_arr: [
            'Anything else?',
            'And?',
            'Any more?',
        ],
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
    },

    Risk: {
        intro: 'If it\'s okay, I am going to ask a few more questions to assess your situation to see if you can take care of yourself at home or if you need to contact the healthcare provider.',
        question_fever: 'How high is your body temperature?',
        question_cough: 'Is your cough dry?',
        question_cough_frequency: 'How frequently are you coughing?',
        question_difficulty_breathing: 'When do you feel difficult breathing?\n❗If you have difficulty breathing, call 112!',
        question_tiredness: 'How tired do you feel?',
        question_contact: 'Have you had close contact with someone infected with coronavirus (COVID-19)?',
        question_ongoing: 'Do you have any of the following diseases with ongoing treatment?\nHypertension, Cardiovascular disease, Lung disease, Cancer, Diabetes, Renal failure, Limited respiratory muscle function.',
        question_immune: 'Do you have a compromised immune system?',
        question_immune_example: 'For example, do you medicate with cytostatic drugs, cortisone tablets, autoimmune disease drugs such as rheumatoid arthritis or the like? \n\nHave you previously had an organ transplant, had your spleen removed, had untreated HIV or other conditions that impair the immune system?',
        question_age: 'How old are you?',
        result_high_risk: 'Your situation is a bit worrying. Please call 1177 for further telephone advice.\nRight now there may be long queues.',
        result_high_risk_2: 'If you have severe breathing problems, contact 112 instead.',
        result_high_risk_info_title: 'You can find more information below:',
        result_high_risk_info_link: 'About the coronavirus',
        result_low_risk_info_title: 'You can read more on 1177 Care guide as below:',
        result_low_risk_info_link_1: 'Cold and flu',
        result_low_risk_info_link_2: 'About staying home',
        result_low_risk_info_link_3: 'About the coronavirus',

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

        'contact_no': 'No',
        'contact_yes': 'Yes, it’s confirmed',
        'contact_no_idea': 'I don’t know',

        'ongoing_none': 'None',
        'ongoing_hypertension': 'Hypertension',
        'ongoing_cardiovascular': 'Cardiac disease',
        'ongoing_lung': 'Lung disease',
        'ongoing_cancer': 'Cancer',
        'ongoing_diabetes': 'Diabetes',
        'ongoing_renal': 'Renal failure',

        'immune_yes': 'Yes',
        'immune_no': 'No',

        'age_less_60': 'Under 60',
        'age_60': '60-69',
        'age_70': '70-79',
        'age_80': '80 or older',
    },

    Reminder: {
        question_reminder: 'Would you like me to check with you again tomorrow?',

        // Reminders
        'reminder_morning': 'In the morning',
        'reminder_afternoon': 'In the afternoon',
        'reminder_no': 'No thanks',
    },

    Extra: {
        question_continue_extra: 'I hope this is not too much to ask. In order to help scientists to research more about the virus, would you mind answering a few further questions?',
        start_yes: 'Sure!',
        start_no: 'Sorry, I can\'t',
        start_yes_response: 'Thank you! Here it goes.',
        start_no_response: 'That\'s alright!',
        do_not_understand: 'Sorry, I don\'t understand.',
        question_activity: 'In an average week when you are not sick, how much physical activity do you tend to do?',
        question_activity_light: '(1) Light-moderate activity (e.g. a brisk walk or bike ride)',
        question_activity_intense: '(2) High-intensity activity (such as weight training, HIIT or fast running)',
        question_stressed: 'How would you rate your general stress levels at the moment, on a scale of 1 - 5?\n\n1 - I am not at all stressed or anxious.\n5 - I feel very stressed and/or anxious',
        question_caregiver: 'Are you a caregiver to a vulnerable person, such as an older adult?',
        thank_you: 'That\'s all I would like to ask for today. Thank you for helping us to combat this crisis.',

        // Extra questions
        'activity_light_0_4': '0 - 4 hours',
        'activity_light_4_8': '4 - 8 hours',
        'activity_light_8_plus': '8+ hours',

        'activity_intense_0_2': '0 - 2 hours',
        'activity_intense_2_4': '2 - 4 hours',
        'activity_intense_4_plus': '4+ hours',

        'stressed_1': '1',
        'stressed_2': '2',
        'stressed_3': '3',
        'stressed_4': '4',
        'stressed_5': '5',

        'caregiver_yes': 'Yes',
        'caregiver_no': 'No',

        advise_low_activity: 'Keeping yourself physically active helps to support the immune system. Why not try to incorporate some physical activity in your daily routines, such as a brisk walk or jog, or doing some yoga at home?',
        advise_high_activity: 'Physical activity and hard training is great and will help to keep you fit and strong. However, make sure you also schedule sufficient recovery time.',
        advise_moderate_activity: 'Regular physical activity supports the immune system and keeps us fit and healthy. Keep it up!',
        advise_caregiver_yes: 'As a caregiver you should take all the precautions you can to keep yourself well, such as keeping good hygiene, avoiding crowds, etc.\nYou should practice physical distancing but not social isolation. While keeping our older adults safe, we should also keep in mind that social isolation can have a negative impact on older people’s immunity and mental health. You may help them to access online services and outreach for spiritual solace and supports.',
        advise_caregiver_no: 'I see. Even so, keep in mind that, we should practice physical distancing but not social isolation because social isolation can have a negative impact on our immunity and mental health. If you can, try to keep an eye on the older adults in your neighborhood. They are very vulnerable during this time, try to reach out to offer help if possible.',
        advise_stress_high: 'Looking after our mental wellbeing is important during the pandemic.\nTry to avoid media sources if you find them stressful, take some time out in nature, or practice mindfulness meditation for 10 min each day.',
        advise_stress_low: 'Glad to know you\'re feeling fine! It\'s important to care for our mental wellbeing during the pandemic. Keep in mind that social distancing doesn\'t mean social isolation.Try to keep the social connection through digital means!',
    },
};

//Facebook messenger format
function makePayloadOptionsFB(keyArray, prefix, translations) {
    return keyArray.map(x => {
        return {
            payload: `${prefix}${x.toUpperCase()}`,
            title: translations[x],
        };
    });
}

function makeButtonsFB(keyArray, prefix, translations) {
    return makePayloadOptionsFB(keyArray, prefix, translations).map(x => {
        return {
            type: 'postback',
            ...x,
        }
    });
}

function makeQuickRepliesFB(keyArray, prefix, translations) {
    return makePayloadOptionsFB(keyArray, prefix, translations).map(x => {
        return {
            contentType: 'text',
            ...x,
        }
    });
}

//Telegram format
function makeReplyMarkupTG(buttonTitleArray, columnCount = 1, keepKeyboard = false) {
    return {
        keyboard: makeKeyboardTG(buttonTitleArray, columnCount),
        resize_keyboard: true,
        one_time_keyboard: !keepKeyboard,
    };

}

function makeKeyboardTG(buttonTitleArray, columnCount) {
    const buttons = buttonTitleArray.map(x => {
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

    const eventKeys = state
        .filter(x => x.event.includes(prefix))
        .map(x => x.event.replace(prefix + '_', '').toLowerCase());

    return eventKeys;
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function lookupCallbackKey(text, dictionary, dictionaryKeyArray, prefix) {
    const key = dictionaryKeyArray.find(x => dictionary[x] === text);
    return key ? prefix + key.toUpperCase() : '';
}

function translateArray(keyArray, translations) {
    return keyArray.map(x => translations[x]);
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

async function routeByPlatform(context, functionFB, functionTG) {
    if (context.platform === 'telegram') {
        await functionTG(context);
    } else {
        await functionFB(context);
    }
}

async function sendText(context, text, milliseconds) {

    if (milliseconds === undefined) {
        // Maybe we can get the length of the text and randomize it
        milliseconds = 500;
    }

    await helpers.typingOff(context);

    await helpers.typing(context, milliseconds);

    await context.sendText(text);

}

async function sendQuickReply(context, text, options) {

}

module.exports = {
    translations,
    makeButtonsFB,
    makeQuickRepliesFB,
    makeReplyMarkupTG,
    extractEvents,
    getKeyByValue,
    lookupCallbackKey,
    typing,
    typingOff,
    routeByPlatform,
    translateArray,
    sendText,
    sendQuickReply
}