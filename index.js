const reddit = require('./reddit')

async function run() {
    reddit.hotHeadlines()
        .then(console.log);
}

run();

