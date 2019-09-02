const https = require('https');

function promiseToFetch(url, options) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, function (res) {
            const chunks = [];
            res.on("data", chunk => {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks);
                resolve(JSON.parse(body));
            });

        }).on('error', reject);

        req.end();
    });
}

function basicAuth(user, pass) {
    const userPass = `${user}:${pass}`;
    return `Basic ${Buffer.from(userPass).toString('base64')}`;
}


module.exports = { promiseToFetch, basicAuth }

