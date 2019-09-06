require('./src/apiTest')
    .test()
    .then(console.log)
    .catch(err => console.log(`ERR: ${err}`));