const betteridge = require('./src/betteridge');

exports.handler = async (event, context) => {
    return context.succeed(await betteridge.invoke());
};
