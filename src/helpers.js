const translations = {
    'fever': 'Fever',
    'cough': 'Cough',
    'dry_cough': 'Dry Cough',
    'headache': 'Headache',
    'diarrhea': 'Diarrhea',
    'sore_throat': 'Sore throat',
    'no_smell': 'I can\'t smell',
    'difficulty_breathing': 'Difficuly breathing',
    'something_else': 'Something else',
    'nothing_else': 'Nothing else'
}

function generateOptions(array, prefix) {
    return array.map(x => {
        return {
            id: x,
            title: translations[x],
            payload: prefix + x.toUpperCase(),
        }
    });
}

function getButtonsContent(array, prefix) {
    return generateOptions(array, prefix).map(x => {
        return {
            type: 'postback',
            title: x.title,
            payload: x.payload,
        }
    });
}

function getQuickReply(array, prefix) {
    return generateOptions(array, prefix).map(x => {
        return {
            contentType: 'text',
            title: x.title,
            payload: x.payload,
        }
    });
}

module.exports = {
    getButtonsContent,
    getQuickReply
}