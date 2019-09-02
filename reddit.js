const https = require('https');

const username = process.env.username;
const password = process.env.password;
const clientId = process.env.client_id;
const clientSecret = process.env.client_secret;
const authEndpoint = 'https://www.reddit.com/api/v1/access_token';
const api = 'https://oauth.reddit.com';

async function getToken() {
    const options = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": basicAuth(clientId, clientSecret),
            "cache-control": "no-cache",
        }
    };

    const url = `${authEndpoint}?grant_type=password&username=${username}&password=${password}`
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, function (res) {
            const chunks = [];
            res.on("data", chunk => {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks);
                const token = JSON.parse(body).access_token;
                resolve(token);
            });

        }).on('error', reject);

        req.end();
    });
}

function basicAuth(user, pass) {
    const userPass = `${user}:${pass}`;
    return `Basic ${Buffer.from(userPass).toString('base64')}`;
}

function headlines({data}) {
    return data.children
        .map(posts => posts.data)
        .map(post => ({title: post.title, subreddit: post.subreddit}));
}

async function getPostsFrom(location) {
    const url = `${api}/${location}`;
    return getToken()
        .then(token => getFromApi(url, token))
        .then(headlines);
}

async function getHotHeadlines(token, opts) {
   const url = `${api}/r/all/hot`;
   return getFromApi(url, token)
       .then(headlines);
}

async function hotHeadlines() {
    return getToken()
        .then(getHotHeadlines);
}

async function getFromApi(url, token) {
    token = token || await getToken();

    const options = {
        "method": "GET",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${token}`,
            "cache-control": "no-cache",
            "User-Agent": "BetteridgeBot by betteridge_bot"
        }
    };
    return new Promise((resolve, reject) => {
        const req = https.get(url, options, res => {
            const chunks = [];

            res.on("data", chunk => {
                chunks.push(chunk);
            });

            res.on("end", () => {
                const body = Buffer.concat(chunks);
                resolve(JSON.parse(body))
            });
        }).on('error', reject);

        req.end();
    })
}

module.exports = {getToken, getPostsFrom, hotHeadlines }
