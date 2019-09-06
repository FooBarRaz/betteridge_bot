require('./src/betteridge')
    .invoke()
    .then(console.log)
    .catch(err => console.log(`ERR: ${err}`));
