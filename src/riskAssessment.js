const helpers = require('./helpers');
const Extra = require('./extraQuestions');
const Analytics = require('./analytics');

const translations = helpers.translations;
const assessmentReplies = {
    fever: [
        'fever_ok',
        'fever_medium',
        'fever_high'
    ],
    cough: [
        'cough_dry',
        'cough_sputum',
        'cough_phlegm'
    ],
    cough_frequency: [
        'cough_frequency_sometimes',
        'cough_frequency_often',
        'cough_frequency_always'
    ],
    difficulty_breathing: [
        'difficulty_breathing_light',
        'difficulty_breathing_slightly',
        'difficulty_breathing_always'
    ],
    tiredness: [
        'tiredness_ok',
        'tiredness_some',
        'tiredness_high',
        'tiredness_bad'
    ],
    closeness_with_disease: [
        'closeness_with_disease_no',
        'closeness_with_disease_yes',
        'closeness_with_disease_no_idea'
    ],
    ongoing: [
        'ongoing_none',
        'ongoing_hypertension',
        'ongoing_cardiovascular',
        'ongoing_lung',
        'ongoing_cancer',
        'ongoing_diabetes',
        'ongoing_renal',
    ],
    compromised_immune: [
        'compromised_immune_yes',
        'compromised_immune_no',
    ],
    age: [
        'age_less_60',
        'age_60',
        'age_70',
        'age_80',
    ],
};
const assessmentCallbackTitles = {};
for (let key in assessmentReplies) {
    assessmentCallbackTitles[key] = assessmentReplies[key].reduce((acc, x) => {
        acc[`USER_FEEDBACK_ASSESSMENT_${x.toUpperCase()}`] = translations[x];
        return acc;
    }, {});
};

const reminderReplies = ['reminder_morning', 'reminder_afternoon', 'reminder_no'];
const reminderCallbackTitles = reminderReplies.reduce((acc, x) => {
    acc[`USER_FEEDBACK_REMINDER_${x.toUpperCase()}`] = translations[x];
    return acc;
}, {});


async function AssessFeverTG(context) {
    await context.setState({
        nextAction: 'ASSESS_FEVER'
    });
    await helpers.typing(context, 500);

    await context.sendText(translations.Risk.question_fever, {
        replyMarkup: helpers.makeReplyMarkupTG(assessmentReplies.fever)
    });
}

async function AssessFeverFB(context) {
    await context.setState({
        nextAction: 'ASSESS_FEVER'
    });

    await helpers.typing(context, 2000);

    const replies = helpers.getQuickReply(assessmentReplies.fever, 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText(translations.Risk.question_fever, { quickReplies: replies });

    await helpers.typingOff(context);
}

async function AssessCoughTG(context) {
    await context.setState({
        nextAction: 'ASSESS_COUGH'
    });

    await helpers.typing(context, 500);

    await context.sendText(translations.Risk.question_cough, {
        replyMarkup: helpers.makeReplyMarkupTG(assessmentReplies.cough)
    });
}

async function AssessCoughFB(context) {
    await context.setState({
        nextAction: 'ASSESS_COUGH'
    });

    await helpers.typing(context, 2000);

    const replies = helpers.getQuickReply(assessmentReplies.cough, 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText(translations.Risk.question_cough, { quickReplies: replies });

    await helpers.typingOff(context);
}

async function AssessCoughFrequencyTG(context) {
    await context.setState({
        nextAction: 'ASSESS_COUGH_FREQUENCY'
    });

    await helpers.typing(context, 500);

    await context.sendText(translations.Risk.question_cough_frequency, {
        replyMarkup: helpers.makeReplyMarkupTG(assessmentReplies.cough_frequency)
    });
}

async function AssessCoughFrequencyFB(context) {
    await context.setState({
        nextAction: 'ASSESS_COUGH_FREQUENCY'
    });

    await helpers.typing(context, 2000);

    const replies = helpers.getQuickReply(assessmentReplies.cough_frequency, 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText(translations.Risk.question_cough_frequency, { quickReplies: replies });

    await helpers.typingOff(context);
}

async function AssessDifficultyBreathingTG(context) {
    await context.setState({
        nextAction: 'ASSESS_DIFFICULTY_BREATHING'
    });

    await helpers.typing(context, 500);

    await context.sendText(translations.Risk.question_difficulty_breathing, {
        replyMarkup: helpers.makeReplyMarkupTG(assessmentReplies.difficulty_breathing)
    });
}

async function AssessDifficultyBreathingFB(context) {
    await context.setState({
        nextAction: 'ASSESS_DIFFICULTY_BREATHING'
    });

    await helpers.typing(context, 2000);

    const replies = helpers.getQuickReply(assessmentReplies.difficulty_breathing, 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText(translations.Risk.question_difficulty_breathing, { quickReplies: replies });

    await helpers.typingOff(context);
}

async function AssessTirednessTG(context) {
    await context.setState({
        nextAction: 'ASSESS_TIREDNESS'
    });

    await helpers.typing(context, 500);

    await context.sendText(translations.Risk.question_tiredness, {
        replyMarkup: helpers.makeReplyMarkupTG(assessmentReplies.tiredness)
    });
}

async function AssessTirednessFB(context) {
    await context.setState({
        nextAction: 'ASSESS_TIREDNESS'
    });

    await helpers.typing(context, 2000);

    const replies = helpers.getQuickReply(assessmentReplies.tiredness, 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText(translations.Risk.question_tiredness, { quickReplies: replies });

    await helpers.typingOff(context);
}

async function AssessRiskContactTG(context) {
    await context.setState({
        nextAction: 'ASSESS_CLOSENESS_WITH_DISEASE'
    });

    await helpers.typing(context, 500);

    await context.sendText(translations.Risk.question_closeness_with_disease, {
        replyMarkup: helpers.makeReplyMarkupTG(assessmentReplies.closeness_with_disease)
    });
}

async function AssessRiskContactFB(context) {
    await context.setState({
        nextAction: 'ASSESS_CLOSENESS_WITH_DISEASE'
    });

    await helpers.typing(context, 2000);

    const replies = helpers.getQuickReply(assessmentReplies.closeness_with_disease, 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText(translations.Risk.question_closeness_with_disease, { quickReplies: replies });

    await helpers.typingOff(context);
}

async function AssessOngoingDiseasesTG(context) {
    await context.setState({
        nextAction: 'ASSESS_ONGOING'
    });

    await helpers.typing(context, 500);

    await context.sendText(translations.Risk.question_ongoing, {
        replyMarkup: helpers.makeReplyMarkupTG(assessmentReplies.ongoing)
    });
}

async function AssessOngoingDiseasesFB(context) {
    await context.setState({
        nextAction: 'ASSESS_ONGOING'
    });

    await helpers.typing(context, 2000);

    const replies = helpers.getQuickReply(assessmentReplies.ongoing, 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText(translations.Risk.question_ongoing, { quickReplies: replies });

    await helpers.typingOff(context);
}

async function AssessCompromisedImmuneTG(context) {
    await context.setState({
        nextAction: 'ASSESS_COMPROMISED_IMMUNE'
    });

    await helpers.typing(context, 800);

    await context.sendText(translations.Risk.question_compromised_immune);

    await helpers.typing(context, 800);

    await context.sendText(translations.Risk.question_compromised_immune_example, {
        replyMarkup: helpers.makeReplyMarkupTG(assessmentReplies.compromised_immune)
    });
}

async function AssessCompromisedImmuneFB(context) {
    await context.setState({
        nextAction: 'ASSESS_COMPROMISED_IMMUNE'
    });

    await helpers.typing(context, 3000);

    const replies = helpers.getQuickReply(assessmentReplies.compromised_immune, 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText(translations.Risk.question_compromised_immune);

    await helpers.typing(context, 3000);

    await context.sendText(translations.Risk.question_compromised_immune_example, { quickReplies: replies });

    await helpers.typingOff(context);
}

async function AssessAgeTG(context) {
    await context.setState({
        nextAction: 'ASSESS_AGE'
    });

    await helpers.typing(context, 500);

    await context.sendText(translations.Risk.question_age, {
        replyMarkup: helpers.makeReplyMarkupTG(assessmentReplies.age)
    });
}

async function AssessAgeFB(context) {
    await context.setState({
        nextAction: 'ASSESS_AGE'
    });

    await helpers.typing(context, 3000);

    const replies = helpers.getQuickReply(assessmentReplies.age, 'USER_FEEDBACK_ASSESSMENT_');

    await context.sendText(translations.Risk.question_age, { quickReplies: replies });

    await helpers.typingOff(context);
}

async function StartRiskAssessment(context) {
    await helpers.typing(context, 1000);
    await context.sendText('If it\'s okay, I am going to ask a few more questions to assess your situation to see if you can take care of yourself at home or if you need to contact the healthcare provider.');
    await helpers.typingOff(context);

    await ContinueRiskAssessment(context);
}

async function FinishAssessment(context) {
    await context.setState({
        nextAction: 'NONE'
    });

    const isDangerousCase = containsDangerousAnswer(context);
    const hasManyHighRiskAnswers = getNumberOfHighRiskAnswers(context) >= 3;
    const isHighRisk = isDangerousCase || hasManyHighRiskAnswers;

    await helpers.typing(context, 500);
    await context.sendText('One moment please...');
    await helpers.typing(context, 1000);

    if (isHighRisk) {
        await context.sendText(translations.Risk.result_high_risk);
        await helpers.typing(context, 500);
        await context.sendText(translations.Risk.result_high_risk_2);
        await helpers.typing(context, 500);

        await helpers.routeByPlatform(context, SendHighRiskInfoTG, SendHighRiskInfoFB);

    } else {

        await context.sendText('Good news! You can probably manage your symptoms with self-care. I hope you will feel better soon.');

        await helpers.typing(context, 500);

        await helpers.routeByPlatform(context, SendLowRiskInfoTG, SendLowRiskInfoFB);
    }

    await AskToCheckTomorrow(context);
}

async function SendHighRiskInfoTG(context) {
    const replyMarkup = {
        inlineKeyboard: [
            [{
                text: translations.Risk.result_high_risk_info_link,
                url: 'https://www.1177.se/Stockholm/sa-fungerar-varden/varden-i-stockholms-lan/om-corona/',
            }]
        ]
    };

    await context.sendText(translations.Risk.result_high_risk_info_title, { replyMarkup: replyMarkup });

}

async function SendHighRiskInfoFB(context) {
    const buttonContent = [
        {
            type: 'web_url',
            url: 'https://www.1177.se/Stockholm/sa-fungerar-varden/varden-i-stockholms-lan/om-corona/',
            title: translations.Risk.result_high_risk_info_link,
        },
    ];

    await context.sendButtonTemplate(translations.Risk.result_high_risk_info_title, buttonContent);
    await helpers.typingOff(context);
}

async function SendLowRiskInfoTG(context) {
    const replyMarkup = {
        inlineKeyboard: [
            [{
                text: translations.Risk.result_low_risk_info_link_1,
                url: 'https://www.1177.se/Stockholm/sjukdomar--besvar/infektioner/forkylning-och-influensa/',
            }],
            [{
                text: translations.Risk.result_low_risk_info_link_2,
                url: 'https://www.1177.se/Stockholm/sa-fungerar-varden/varden-i-stockholms-lan/om-corona/om-att-stanna-hemma/',
            }],
            [{
                text: translations.Risk.result_low_risk_info_link_3,
                url: 'https://www.1177.se/Stockholm/sa-fungerar-varden/varden-i-stockholms-lan/om-corona/',
            }],
        ]
    };

    await context.sendMessage(translations.Risk.result_low_risk_info_title, { replyMarkup: replyMarkup });

}

async function SendLowRiskInfoFB(context) {
    const buttonContent = [
        {
            type: 'web_url',
            url: 'https://www.1177.se/Stockholm/sjukdomar--besvar/infektioner/forkylning-och-influensa/',
            title: translations.Risk.result_low_risk_info_link_1,
        },
        {
            type: 'web_url',
            url: 'https://www.1177.se/Stockholm/sa-fungerar-varden/varden-i-stockholms-lan/om-corona/om-att-stanna-hemma/',
            title: translations.Risk.result_low_risk_info_link_2,
        },
        {
            type: 'web_url',
            url: 'https://www.1177.se/Stockholm/sa-fungerar-varden/varden-i-stockholms-lan/om-corona/',
            title: translations.Risk.result_low_risk_info_link_3,
        },
    ];
    const text = translations.Risk.result_low_risk_info_title;

    await context.sendButtonTemplate(text, buttonContent);
    await helpers.typingOff(context);

}

async function AskToCheckTomorrow(context) {
    await context.setState({
        nextAction: 'ASK_REMINDER'
    });

    return await helpers.routeByPlatform(context, AskToCheckTomorrowTG, AskToCheckTomorrowFB);
}

async function AskToCheckTomorrowTG(context) {
    await helpers.typing(context, 3000);

    await context.sendText(translations.Risk.question_reminder, {
        replyMarkup: helpers.makeReplyMarkupTG(reminderReplies)
    });
}

async function AskToCheckTomorrowFB(context) {
    await helpers.typing(context, 3000);

    const replies = helpers.getQuickReply(reminderReplies, 'USER_FEEDBACK_REMINDER_');

    await context.sendText(translations.Risk.question_reminder, { quickReplies: replies });

    await helpers.typingOff(context);
}

async function HandleReminder(context) {
    const nextAction = context.state.nextAction || '';
    if (nextAction !== 'ASK_REMINDER') {
        return;
    }

    const eventKey = context.event.payload || helpers.getKeyByValue(reminderCallbackTitles, context.event.text) || '';

    if (eventKey) {
        console.log(eventKey);
        await Analytics.SaveData(context, eventKey);
    }

    await helpers.typing(context, 500);

    if ((eventKey.includes('MORNING') || eventKey.includes('AFTERNOON'))) {
        await context.sendText('Sure thing! I will do.')
    } else {
        await context.sendText('Okay.')
    }

    await helpers.typingOff(context);

    await Extra.StartExtraQuestion(context);
}

async function HandleAssessmentReply(context) {
    const nextAction = context.state.nextAction || '';
    if (!nextAction.includes('ASSESS_')) {
        return;
    }

    const groupKey = nextAction.replace('ASSESS_', '').toLowerCase();
    const eventKey = context.event.payload || helpers.getKeyByValue(assessmentCallbackTitles[groupKey], context.event.text);

    if (eventKey) {
        await Analytics.SaveData(context, eventKey);

        await ContinueRiskAssessment(context);
    } else {
        await context.sendText(`Sorry, I don\'t understand. \n` + translations.Risk[`question_${groupKey}`]);
    }

}

async function ContinueRiskAssessment(context) {
    const currentSymptoms = extractSymptoms(context);

    const performedAssessments = extractPerformedAssessments(context);

    if (currentSymptoms.includes('fever') && !performedAssessments.includes('fever')) {
        await helpers.routeByPlatform(context, AssessFeverTG, AssessFeverFB);
    } else if (currentSymptoms.includes('cough') && !performedAssessments.includes('cough')) {
        await helpers.routeByPlatform(context, AssessCoughTG, AssessCoughFB);
    } else if (currentSymptoms.includes('cough') && !performedAssessments.includes('cough_frequency')) {
        await helpers.routeByPlatform(context, AssessCoughFrequencyTG, AssessCoughFrequencyFB);
    } else if (currentSymptoms.includes('difficulty_breathing') && !performedAssessments.includes('difficulty_breathing')) {
        await helpers.routeByPlatform(context, AssessDifficultyBreathingTG, AssessDifficultyBreathingFB);
    } else if (currentSymptoms.includes('tiredness') && !performedAssessments.includes('tiredness')) {
        await helpers.routeByPlatform(context, AssessTirednessTG, AssessTirednessFB);
    } else if (!performedAssessments.includes('closeness')) {
        await helpers.routeByPlatform(context, AssessRiskContactTG, AssessRiskContactFB);
    } else if (!performedAssessments.includes('ongoing')) {
        await helpers.routeByPlatform(context, AssessOngoingDiseasesTG, AssessOngoingDiseasesFB);
    } else if (!performedAssessments.includes('compromised')) {
        await helpers.routeByPlatform(context, AssessCompromisedImmuneTG, AssessCompromisedImmuneFB);
    } else if (!performedAssessments.includes('age')) {
        await helpers.routeByPlatform(context, AssessAgeTG, AssessAgeFB);
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
    return helpers.extractEvents(context, 'USER_FEEDBACK_SYMPTOM');
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
        return answers.includes(x)
    })

    return result.length;
}

function containsDangerousAnswer(context) {
    const answers = extractAssessmentsAnswers(context);

    const result = [
        'difficulty_breathing_slightly',
        'difficulty_breathing_always',
    ].filter(x => {
        return answers.includes(x)
    })

    return result.length > 0;
}

module.exports = {
    StartRiskAssessment,
    HandleAssessmentReply,
    ContinueRiskAssessment,
    FinishAssessment,
    HandleReminder,
    AskToCheckTomorrow,
};