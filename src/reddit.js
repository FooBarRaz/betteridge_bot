const web = require('./webutil');
const qs = require('querystring');

const username = process.env.username;
const password = process.env.password;
const clientId = process.env.client_id;
const clientSecret = process.env.client_secret;
const authEndpoint = 'https://www.reddit.com/api/v1/access_token';
const api = 'https://oauth.reddit.com';

function apiOptions(method, token) {
    return {
        "method": method,
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Bearer ${token}`,
            "cache-control": "no-cache",
            "User-Agent": "BetteridgeBot by betteridge_bot"
        }
    };
}

async function getAuthToken() {
    const options = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": web.basicAuth(clientId, clientSecret),
            "cache-control": "no-cache",
        }
    };

    const url = `${authEndpoint}?grant_type=password&username=${username}&password=${password}`;
    return web.promiseToFetch(url, options).then(data => data.access_token);
}

async function getFromApi(path, token, params) {
    token = token || await getAuthToken();

    let paramString;
    if (params) {
        paramString = qs.stringify(params);
    }

    const url = `${api}/${path}${params ? `?${paramString}` : ''}`;

    return web.promiseToFetch(url, apiOptions("GET", token));
}

async function postToApi(path, body, token, params) {
    token = token || await getAuthToken();

    const options = {...apiOptions("POST", token), body};
    const paramString = params ? `?${qs.stringify(params)}` : '';
    const url = `${api}/${path}${paramString}`;

    return web.promiseToFetch(url, options);
}

async function fetchMultiSubreddits(multipath) {
    const url = `api/multi/${multipath}`;
    return getFromApi(url)
        .then(({data}) => data.subreddits.map(sub => sub.name));
}


async function fetchNewPosts(subreddit, params) {
    return getFromApi(`r/${subreddit}/new`, token, params);
}

async function saveListingItem(listingItem) {
    return postToApi("api/save", null, null, {id: listingItem.data.name})
}

const operations = {
    getListingItems: listing => listing.data.children,
    getListingItemTitle: listingItem => listingItem.data.title,
    getTitlesFromListing: listing =>
        listing.data.children
            .map(posts => posts.data)
            .map(post => post.title),
    fullName: listingItem => `${listingItem.kind}_${listingItem.data.id}`,
    category: listingItem => listingItem.kind
};

module.exports = {
    fetchMultiSubreddits,
    fetchNewPosts,
    saveListingItem,
    operations
};
