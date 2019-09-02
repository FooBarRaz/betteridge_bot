const web = require('./webutil');

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
            "Authorization": web.basicAuth(clientId, clientSecret),
            "cache-control": "no-cache",
        }
    };

    const url = `${authEndpoint}?grant_type=password&username=${username}&password=${password}`
    return web.promiseToFetch(url, options).then(data => data.access_token);
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

    return web.promiseToFetch(url, options);
}

module.exports = { getToken, getPostsFrom, hotHeadlines }
