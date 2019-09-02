const reddit = require('./reddit');

exports.handler = async (event, context) => {
    const result = reddit.hotHeadlines();
    return context.succeed(result);
};
