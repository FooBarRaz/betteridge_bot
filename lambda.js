const reddit = require('./reddit');

exports.handler = async (event) => {
    return reddit.hotHeadlines().then(console.log);
};
