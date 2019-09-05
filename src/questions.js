module.exports = {
    isPredicateQuestion: (string) => {
        return getQuestions(string);
    },

    getQuestions: ({split}) => {
        return split('.')
            .reduce((acc, curr) => [...acc, ...curr.split(':')], [])
            .map(s => s.trim());
    }
};