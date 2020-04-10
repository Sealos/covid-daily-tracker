const translations = {
    GetStarted: {
        hello: 'Hello!',
        intro: 'Nice to see you the first time! (I might appear friendly like your private carer but I\'m actually a robot.)',
        question: 'How are you feeling today?',
        answer_healthy: 'Feeling healthy!',
        answer_sick: 'Feeling sick',
    },

    // Symptoms
    'fever': 'Fever',
    'cough': 'Cough',
    'headache': 'Headache',
    'diarrhea': 'Diarrhea',
    'sore_throat': 'Sore throat',
    'no_smell': 'Can\'t taste/smell',
    'tiredness': 'Tiredness',
    'difficulty_breathing': 'Difficulty breathing',
    'something_else': 'Something else...',
    'nothing_else': 'Nothing else',

    // Risk assessment
    'fever_ok': 'Below 38C',
    'fever_medium': '38.0 - 39.4C',
    'fever_high': 'Above 39.4C',

    'cough_dry': 'Yes, it\'s dry',
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
    'closeness_with_disease_yes': 'Yes, it\'s confirmed',
    'closeness_with_disease_no_idea': 'I don\'t know',

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

function extractEvents(context, prefix) {
    const state = context.state.payloads || [];

    const currentSymptoms = state
        .filter(x => x.event.includes(prefix))
        .map(x => x.event.replace(prefix + '_', '').toLowerCase());

    return currentSymptoms;
}

module.exports = {
    translations,
    getButtonsContent,
    getQuickReply,
    extractEvents
}