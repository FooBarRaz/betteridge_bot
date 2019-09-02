const qs = require("querystring");
const https = require('https');

const username = process.env.username;
const password = process.env.password;
const clientId = process.env.client_id;
const clientSecret = process.env.client_secret;
const authEndpoint = 'https://www.reddit.com/api/v1/access_token';

module.exports = {
    doTheThing: function(resolve, reject) {
        doWithToken(token => readHeadline(token, resolve))
    }
}

function getBasicAuth(user, pass) {
    const userPass = `${user}:${pass}`;
    return `Basic ${Buffer.from(userPass).toString('base64')}`;
}

function doWithToken(callback) {
    const options = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": getBasicAuth(clientId, clientSecret),
            "cache-control": "no-cache",
        }
    };

    let f = function(res) {
        const chunks = [];
        res.on("data", chunk => {
            chunks.push(chunk);
        });

        res.on("end", function() {
            const body = Buffer.concat(chunks);
            const token = JSON.parse(body).access_token;
            callback(token);
        });
    };
    const req = https.request(authEndpoint, options, f);

    req.write(qs.stringify({
        grant_type: 'password',
        username: username,
        password: password,
    }));

    req.end();
}

function getAndDo(url, options, callback) {
    const req = https.get(url, options, res => {
        const chunks = [];

        res.on("data", chunk => {
            chunks.push(chunk);
        });

        res.on("end", () => {
            const body = Buffer.concat(chunks);
            const data = JSON.parse(body);
            callback(data);
        });
    });

    req.end();
}

function readHeadline(token, callback) {
    const options = {
        "method": "GET",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${token}`,
            "cache-control": "no-cache",
            "User-Agent": "BetteridgeBot by betteridge_bot"
        }
    };
    const url = 'https://oauth.reddit.com/r/all/hot';
    getAndDo(url, options, ({ data }) => callback(extractHeadlineInfo(data.children.map(x => x.data))));
}

function writeHeadlinesToConsole(posts) {
    let postInfo =
        postInfo
            .forEach(console.log);
    return {
        statusCode: 200,
        body: JSON.stringify(postInfo)
    }
}

function extractHeadlineInfo(posts) {
    return posts
        .map(
            post => ({
                title: post.title,
                subreddit: post.subreddit_name_prefixed
            }));
}
