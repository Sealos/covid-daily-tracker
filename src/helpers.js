const translations = {
    // Symptoms
    'fever': 'Fever',
    'cough': 'Cough',
    'dry_cough': 'Dry Cough',
    'headache': 'Headache',
    'diarrhea': 'Diarrhea',
    'sore_throat': 'Sore throat',
    'no_smell': 'I can\'t smell',
    'tiredness': 'Tiredness',
    'difficulty_breathing': 'Difficuly breathing',
    'something_else': 'Something else',
    'nothing_else': 'Nothing else',

    // Risk assessment
    'fever_ok': 'Below 37.5C',
    'fever_medium': '37.5 - 39.4C',
    'fever_high': '38.0 - 39.4C',

    'cough_dry': 'Yes, it\'s dry',
    'cough_sputum': 'No, I have sputum',
    'cough_phlegm': 'No, I have phlegm',

    'cough_frequency_sometimes': 'Sometimes',
    'cough_frequency_often': 'Often',
    'cough_frequency_always': 'All the time',

    'difficulty_breathing_light': 'On light effort',
    'difficulty_breathing_slightly': 'On light effort',
    'difficulty_breathing_always': 'On light effort',

    'tiredness_ok': 'Manage to stay up',
    'tiredness_some': 'Can be up briefly',
    'tiredness_high': 'Only up for toilet',
    'tiredness_bad': 'Can\'t get out of bed',

    'closeness_with_disease_no': 'No',
    'closeness_with_disease_yes': 'Yes, it\'s confirmed',
    'closeness_with_disease_no_idea': 'I don\'t know',

    'ongoing_none': 'None',
    'ongoing_hypertension': 'Hypertension',
    'ongoing_cardiovascular': 'Cardiovascular disease',
    'ongoing_lung': 'Lung Disease',
    'ongoing_cancer': 'Cancer',
    'ongoing_diabetes': 'Diabetes',
    'ongoing_renal': 'Renal failure',

    'compromised_immune_yes': 'Yes',
    'compromised_immune_no': 'No',

    'age_less_60': 'Under 60',
    'age_60': '60-69',
    'age_70': '70-79',
    'age_80': '80 or older',
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
    getButtonsContent,
    getQuickReply,
    extractEvents
}