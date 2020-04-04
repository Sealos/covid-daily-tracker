const Symptoms = require('./symptoms');
const helpers = require('./helpers');

async function HandleAskForTested(context) {
    await context.typing(2000);
    await context.sendText('Have you had a positive test result for COVID-19?', {
        quickReplies: [
            {
                contentType: 'text',
                title: 'Yes, I have',
                payload: 'USER_FEEDBACK_TESTED_POSITIVE',
            },
            {
                contentType: 'text',
                title: 'No, but it\'s likely',
                payload: 'USER_FEEDBACK_TESTED_NO_LIKELY',
            },
            {
                contentType: 'text',
                title: 'No',
                payload: 'USER_FEEDBACK_TESTED_NO',
            },
        ],
    });

    context.typingOff();
}

async function AssessFever(context) {
    await context.typing(2000);

    const replies = helpers.getQuickReply(['fever_ok', 'fever_medium', 'fever_high'], 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText('How high is your body temperature?', { quickReplies: replies });

    await context.typingOff();
}

async function AssessCough(context) {
    await context.typing(2000);

    const replies = helpers.getQuickReply(['cough_dry', 'cough_sputum', 'cough_phlegm'], 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText('Is your cough dry?', { quickReplies: replies });

    await context.typingOff();
}

async function AssessCoughFrequency(context) {
    await context.typing(2000);

    const replies = helpers.getQuickReply(['cough_frequency_sometimes', 'cough_frequency_often', 'cough_frequency_always'], 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText('How frequently are you coughing?', { quickReplies: replies });

    await context.typingOff();
}

async function AssessDifficultyBreathing(context) {

    await context.typing(2000);

    const replies = helpers.getQuickReply(['difficulty_breathing_light', 'difficulty_breathing_slightly', 'difficulty_breathing_always'], 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText('When do you feel difficult breathing?\n❗If you have difficulty breathing, call 112!', { quickReplies: replies });

    await context.typingOff();
}

async function AssessTiredness(context) {

    await context.typing(2000);

    const replies = helpers.getQuickReply(['tiredness_ok', 'tiredness_some', 'tiredness_high', 'tiredness_bad'], 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText('How tired do you feel?', { quickReplies: replies });

    await context.typingOff();
}

async function AssessRiskContact(context) {
    await context.typing(2000);

    const replies = helpers.getQuickReply(['closeness_with_disease_no', 'closeness_with_disease_yes', 'closeness_with_disease_no_idea'], 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText('Have you had close contact with someone infected with coronavirus (covid-19)?', { quickReplies: replies });

    await context.typingOff();
}

async function AssessOngoingDiseases(context) {
    await context.typing(2000);

    const quickReplies = [
        'ongoing_none',
        'ongoing_hypertension',
        'ongoing_cardiovascular',
        'ongoing_lung',
        'ongoing_cancer',
        'ongoing_diabetes',
        'ongoing_renal',
    ];

    const replies = helpers.getQuickReply(quickReplies, 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText('Do you have any of the following diseases with ongoing treatment?', { quickReplies: replies });

    await context.typingOff();
}

async function AssessCompromisedImmune(context) {
    await context.typing(3000);

    const quickReplies = [
        'compromised_immune_no',
        'compromised_immune_yes',
    ];

    const replies = helpers.getQuickReply(quickReplies, 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText('Have you compromised your immune system?\nFor example, do you medicate with cytostatic drugs, cortisone tablets, autoimmune disease drugs such as rheumatoid arthritis or the like?');

    await context.typing(3000);

    await context.sendText('Have you previously had an organ transplant, had your spleen removed, had untreated HIV or other conditions that impair the immune system ?', { quickReplies: replies });

    await context.typingOff();
}

async function AssessAge(context) {
    await context.typing(3000);

    const quickReplies = [
        'age_less_60',
        'age_60',
        'age_70',
        'age_80',
    ];

    const replies = helpers.getQuickReply(quickReplies, 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText('How old are you?', { quickReplies: replies });

    await context.typingOff();
}

async function StartRiskAssessment(context) {
    await context.typing(3000);
    await context.sendText('If it\'s okay, I am going to ask a few more questions to assess your situation to see if you can take care of yourself at home or if you need to contact the healthcare provider.');
    await context.typingOff();

    ContinueRiskAssessment(context);
}

async function FinishAssessment(context) {
    const isHighRisk = containsDangerousAnswer(context) || getNumberOfHighRiskAnswers(context) >= 3;

    await context.typing(2000);
    await context.sendText('One moment please...');
    await context.typing(3000);

    if (isHighRisk) {
        await context.typing(3000);
        await context.sendText('Your situation is a bit worrying. Please call 1177 for further telephone advice.\nRight now there may be long queues.');
        await context.typing(2000);
        await context.sendText('If you have severe breathing problems, contact 112 instead.');
        await context.typing(2000);
        await context.sendText('You can find more information on About the corona virus in Stockholm - 1177 Care guide');
        await context.sendText('https://www.1177.se/Stockholm/sa-fungerar-varden/varden-i-stockholms-lan/om-corona/');
        await context.typingOff();
    } else {
        /*
        [You can read more here:
        Cold and flu - 1177 Care guide
        How long to stay home and take care of yourself
        About the corona virus in Stockholm - 1177 Care guide ] URLS?
        */

        await context.sendText('Good news! You can probably manage your symptoms with self-care. I hope you will feel better soon.');
        await context.typingOff();
    }


}

async function ContinueRiskAssessment(context) {
    const currentSymptoms = extractSymptoms(context);

    const performedAssessments = extractPerformedAssessments(context);

    if (currentSymptoms.includes('fever') && !performedAssessments.includes('fever')) {
        await AssessFever(context);
    } else if (currentSymptoms.includes('cough') && !performedAssessments.includes('cough')) {
        await AssessCough(context);
    } else if (currentSymptoms.includes('cough') && !performedAssessments.includes('cough_frequency')) {
        await AssessCoughFrequency(context);
    } else if (currentSymptoms.includes('difficulty_breathing') && !performedAssessments.includes('difficulty_breathing')) {
        await AssessDifficultyBreathing(context);
    } else if (currentSymptoms.includes('tiredness') && !performedAssessments.includes('tiredness')) {
        await AssessTiredness(context);
    } else if (!performedAssessments.includes('closeness')) {
        await AssessRiskContact(context);
    } else if (!performedAssessments.includes('ongoing')) {
        await AssessOngoingDiseases(context);
    } else if (!performedAssessments.includes('compromised')) {
        await AssessCompromisedImmune(context);
    } else if (!performedAssessments.includes('age')) {
        await AssessAge(context);
    } else {
        await FinishAssessment(context);
    }
}

const assessments = [
    'fever',
    'cough',
    'cough_frequency',
    'difficulty_breathing',
    'tiredness',
    'closeness',
    'ongoing',
    'compromised',
    'age',
]

function extractPerformedAssessments(context) {
    const answers = extractAssessmentsAnswers(context);

    return assessments.filter(assessment => {
        let isIncluded = false;
        answers.forEach(element => {
            isIncluded = isIncluded || element.includes(assessment);
        });

        return isIncluded;
    })
}

function extractAssessmentsAnswers(context) {
    return helpers.extractEvents(context, 'USER_FEEDBACK_ASSESSMENT');
}

function extractSymptoms(context) {
    return helpers.extractEvents(context, 'USER_FEEDBACK_SICK');
}

const highRiskAnswers = [
    'fever_medium',
    'fever_high',

    'cough_often',
    'cough_always',

    'difficulty_breathing_slightly',
    'difficulty_breathing_always',

    'tiredness_high',
    'tiredness_bad',

    'closeness_with_disease_yes',

    'ongoing_hypertension',
    'ongoing_cardiovascular',
    'ongoing_lung',
    'ongoing_cancer',
    'ongoing_diabetes',
    'ongoing_renal',

    'compromised_immune_yes',

    'age_60',
    'age_70',
    'age_80'
]

function getNumberOfHighRiskAnswers(context) {
    const answers = extractAssessmentsAnswers(context);

    const result = highRiskAnswers.filter(x => {
        answers.includes(x)
    })

    return result.length;
}

function containsDangerousAnswer(context) {
    const answers = extractAssessmentsAnswers(context);

    const result = highRiskAnswers.filter(x => {
        answers.includes(x)
    })

    return result.length;
}

module.exports = {
    StartRiskAssessment,
    HandleAskForTested,
    ContinueRiskAssessment
};