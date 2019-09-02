const reader = require('./readHeadlines');

exports.handler = async (event) => {
    return new Promise((resolve, reject) => {
        reader.doTheThing(resolve, reject);
    });
};
