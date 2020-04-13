const helpers = require('./helpers');
const Analytics = require('./analytics');
const Reminder = require('./reminder');

const translations = helpers.translations.Risk;

const CALLBACK_KEY_PREFIX = 'USER_FEEDBACK_ASSESSMENT_';
const REPLIES = {
    FEVER: [
        'fever_ok',
        'fever_medium',
        'fever_high'
    ],
    COUGH: [
        'cough_dry',
        'cough_sputum',
        'cough_phlegm'
    ],
    COUGH_FREQUENCY: [
        'cough_frequency_sometimes',
        'cough_frequency_often',
        'cough_frequency_always'
    ],
    DIFFICULTY_BREATHING: [
        'difficulty_breathing_light',
        'difficulty_breathing_slightly',
        'difficulty_breathing_always'
    ],
    TIREDNESS: [
        'tiredness_ok',
        'tiredness_some',
        'tiredness_high',
        'tiredness_bad'
    ],
    CONTACT: [
        'contact_no',
        'contact_yes',
        'contact_no_idea'
    ],
    ONGOING: [
        'ongoing_none',
        'ongoing_hypertension',
        'ongoing_cardiovascular',
        'ongoing_lung',
        'ongoing_cancer',
        'ongoing_diabetes',
        'ongoing_renal',
    ],
    IMMUNE: [
        'immune_yes',
        'immune_no',
    ],
    AGE: [
        'age_less_60',
        'age_60',
        'age_70',
        'age_80',
    ],
};

async function AssessFever(context) {
    await context.setState({
        nextAction: 'ASSESS_FEVER'
    });

    await helpers.typing(context, 500);

    if (context.platform === 'telegram') {
        await context.sendText(translations.question_fever, {
            replyMarkup: makeReplyMarkupTG(REPLIES.FEVER)
        });
    } else {
        await context.sendText(translations.question_fever, {
            quickReplies: makeQuickRepliesFB(REPLIES.FEVER)
        });
    }

    await helpers.typingOff(context);
}

async function AssessCough(context) {
    await context.setState({
        nextAction: 'ASSESS_COUGH'
    });

    await helpers.typing(context, 500);

    if (context.platform === 'telegram') {
        await context.sendText(translations.question_cough, {
            replyMarkup: makeReplyMarkupTG(REPLIES.COUGH)
        });
    } else {
        await context.sendText(translations.question_cough, {
            quickReplies: makeQuickRepliesFB(REPLIES.COUGH)
        });
    }

    await helpers.typingOff(context);
}

async function AssessCoughFrequency(context) {
    await context.setState({
        nextAction: 'ASSESS_COUGH_FREQUENCY'
    });

    await helpers.typing(context, 500);

    if (context.platform === 'telegram') {
        await context.sendText(translations.question_cough_frequency, {
            replyMarkup: makeReplyMarkupTG(REPLIES.COUGH_FREQUENCY)
        });
    } else {
        await context.sendText(translations.question_cough_frequency, {
            quickReplies: makeQuickRepliesFB(REPLIES.COUGH_FREQUENCY)
        });
    }

    await helpers.typingOff(context);
}

async function AssessDifficultyBreathing(context) {
    await context.setState({
        nextAction: 'ASSESS_DIFFICULTY_BREATHING'
    });

    await helpers.typing(context, 500);

    if (context.platform === 'telegram') {
        await context.sendText(translations.question_difficulty_breathing, {
            replyMarkup: makeReplyMarkupTG(REPLIES.DIFFICULTY_BREATHING)
        });
    } else {
        await context.sendText(translations.question_difficulty_breathing, {
            quickReplies: makeQuickRepliesFB(REPLIES.DIFFICULTY_BREATHING)
        });
    }

    await helpers.typingOff(context);
}

async function AssessTiredness(context) {
    await context.setState({
        nextAction: 'ASSESS_TIREDNESS'
    });

    await helpers.typing(context, 500);

    if (context.platform === 'telegram') {
        await context.sendText(translations.question_tiredness, {
            replyMarkup: makeReplyMarkupTG(REPLIES.TIREDNESS)
        });
    } else {
        await context.sendText(translations.question_tiredness, {
            quickReplies: makeQuickRepliesFB(REPLIES.TIREDNESS)
        });
    }

    await helpers.typingOff(context);
}

async function AssessRiskContact(context) {
    await context.setState({
        nextAction: 'ASSESS_CONTACT'
    });

    await helpers.typing(context, 500);

    if (context.platform === 'telegram') {
        await context.sendText(translations.question_contact, {
            replyMarkup: makeReplyMarkupTG(REPLIES.CONTACT)
        });
    } else {
        await context.sendText(translations.question_contact, {
            quickReplies: makeQuickRepliesFB(REPLIES.CONTACT)
        });
    }

    await helpers.typingOff(context);
}

async function AssessOngoingDiseases(context) {
    await context.setState({
        nextAction: 'ASSESS_ONGOING'
    });

    await helpers.typing(context, 500);

    if (context.platform === 'telegram') {
        await context.sendText(translations.question_ongoing, {
            replyMarkup: makeReplyMarkupTG(REPLIES.ONGOING)
        });
    } else {
        await context.sendText(translations.question_ongoing, {
            quickReplies: makeQuickRepliesFB(REPLIES.ONGOING)
        });
    }

    await helpers.typingOff(context);
}

async function AssessCompromisedImmune(context) {
    await context.setState({
        nextAction: 'ASSESS_IMMUNE'
    });

    await helpers.typing(context, 800);

    await context.sendText(translations.question_immune);

    await helpers.typing(context, 800);

    if (context.platform === 'telegram') {
        await context.sendText(translations.question_immune_example, {
            replyMarkup: makeReplyMarkupTG(REPLIES.IMMUNE)
        });
    } else {
        await context.sendText(translations.question_immune_example, {
            quickReplies: makeQuickRepliesFB(REPLIES.IMMUNE)
        });
    }

    await helpers.typingOff(context);
}

async function AssessAge(context) {
    await context.setState({
        nextAction: 'ASSESS_AGE'
    });

    await helpers.typing(context, 500);

    if (context.platform === 'telegram') {
        await context.sendText(translations.question_age, {
            replyMarkup: makeReplyMarkupTG(REPLIES.AGE)
        });
    } else {
        await context.sendText(translations.question_age, {
            quickReplies: makeQuickRepliesFB(REPLIES.AGE)
        });
    }

    await helpers.typingOff(context);
}

async function StartRiskAssessment(context) {
    await helpers.typing(context, 1000);
    await context.sendText(translations.intro);
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
        await context.sendText(translations.result_high_risk);
        await helpers.typing(context, 500);
        await context.sendText(translations.result_high_risk_2);
        await helpers.typing(context, 500);

        await helpers.routeByPlatform(context, SendHighRiskInfoFB, SendHighRiskInfoTG);

    } else {

        await context.sendText('Good news! You can probably manage your symptoms with self-care. I hope you will feel better soon.');

        await helpers.typing(context, 500);

        await helpers.routeByPlatform(context, SendLowRiskInfoFB, SendLowRiskInfoTG);
    }

    await Reminder.AskToCheckTomorrow(context);
}

async function SendHighRiskInfoTG(context) {
    const replyMarkup = {
        inlineKeyboard: [
            [{
                text: translations.result_high_risk_info_link,
                url: 'https://www.1177.se/Stockholm/sa-fungerar-varden/varden-i-stockholms-lan/om-corona/',
            }]
        ]
    };

    await context.sendText(translations.result_high_risk_info_title, { replyMarkup: replyMarkup });

}

async function SendHighRiskInfoFB(context) {
    const buttonContent = [
        {
            type: 'web_url',
            url: 'https://www.1177.se/Stockholm/sa-fungerar-varden/varden-i-stockholms-lan/om-corona/',
            title: translations.result_high_risk_info_link,
        },
    ];

    await context.sendButtonTemplate(translations.result_high_risk_info_title, buttonContent);
    await helpers.typingOff(context);
}

async function SendLowRiskInfoTG(context) {
    const replyMarkup = {
        inlineKeyboard: [
            [{
                text: translations.result_low_risk_info_link_1,
                url: 'https://www.1177.se/Stockholm/sjukdomar--besvar/infektioner/forkylning-och-influensa/',
            }],
            [{
                text: translations.result_low_risk_info_link_2,
                url: 'https://www.1177.se/Stockholm/sa-fungerar-varden/varden-i-stockholms-lan/om-corona/om-att-stanna-hemma/',
            }],
            [{
                text: translations.result_low_risk_info_link_3,
                url: 'https://www.1177.se/Stockholm/sa-fungerar-varden/varden-i-stockholms-lan/om-corona/',
            }],
        ]
    };

    await context.sendMessage(translations.result_low_risk_info_title, { replyMarkup: replyMarkup });

}

async function SendLowRiskInfoFB(context) {
    const buttonContent = [
        {
            type: 'web_url',
            url: 'https://www.1177.se/Stockholm/sjukdomar--besvar/infektioner/forkylning-och-influensa/',
            title: translations.result_low_risk_info_link_1,
        },
        {
            type: 'web_url',
            url: 'https://www.1177.se/Stockholm/sa-fungerar-varden/varden-i-stockholms-lan/om-corona/om-att-stanna-hemma/',
            title: translations.result_low_risk_info_link_2,
        },
        {
            type: 'web_url',
            url: 'https://www.1177.se/Stockholm/sa-fungerar-varden/varden-i-stockholms-lan/om-corona/',
            title: translations.result_low_risk_info_link_3,
        },
    ];
    const text = translations.result_low_risk_info_title;

    await context.sendButtonTemplate(text, buttonContent);
    await helpers.typingOff(context);

}

async function HandleAssessmentReply(context) {
    const nextAction = context.state.nextAction || '';
    if (!nextAction.includes('ASSESS_')) {
        return;
    }

    const questionKey = nextAction.replace('ASSESS_', '');
    const eventKey = context.event.payload || lookupCallbackKey(context.event.text, REPLIES[questionKey]);

    if (eventKey) {
        await Analytics.SaveEvent(context, eventKey);

        await ContinueRiskAssessment(context);
    } else {
        await context.sendText(`Sorry, I don\'t understand. \n` + translations[`question_${questionKey}`]);
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
    } else if (!performedAssessments.includes('contact')) {
        await AssessRiskContact(context);
    } else if (!performedAssessments.includes('ongoing')) {
        await AssessOngoingDiseases(context);
    } else if (!performedAssessments.includes('immune')) {
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
    'contact',
    'ongoing',
    'immune',
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

function makeQuickRepliesFB(repliesKeyArray) {
    return helpers.makeQuickRepliesFB(repliesKeyArray, CALLBACK_KEY_PREFIX, translations);
}

function makeReplyMarkupTG(repliesKeyArray) {
    return helpers.makeReplyMarkupTG(helpers.translateArray(repliesKeyArray, translations));
}

function lookupCallbackKey(textValue, translationKeys) {
    return helpers.lookupCallbackKey(textValue, translations, translationKeys, CALLBACK_KEY_PREFIX);
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

    'contact_yes',

    'ongoing_hypertension',
    'ongoing_cardiovascular',
    'ongoing_lung',
    'ongoing_cancer',
    'ongoing_diabetes',
    'ongoing_renal',

    'immune_yes',

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
};