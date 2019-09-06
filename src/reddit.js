const web = require('./webutil');
const qs = require('querystring');

const username = process.env.username;
const password = process.env.password;
const clientId = process.env.client_id;
const clientSecret = process.env.client_secret;
const authEndpoint = 'https://www.reddit.com/api/v1/access_token';
const api = 'https://oauth.reddit.com';

class RedditClient {
    constructor(token){
        this.token = token;
    }

    apiOptions(method) {
        return {
            "method": method,
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Bearer ${this.token}`,
                "cache-control": "no-cache",
                "User-Agent": "BetteridgeBot by betteridge_bot"
            }
        };
    }


    async getFromApi(path, params) {
        // token = token || await getAuthToken();

        let paramString;
        if (params) {
            paramString = qs.stringify(params);
        }

        const url = `${api}/${path}${params ? `?${paramString}` : ''}`;

        return web.promiseToFetchData(url, this.apiOptions("GET"));
    }

    async postToApi(path, body, params) {
        const options = {...this.apiOptions("POST"), body};
        const paramString = params ? `?${qs.stringify(params)}` : '';
        const url = `${api}/${path}${paramString}`;

        return web.promiseToFetchData(url, options);
    }

    async postComment(parent, text) {
        return this.postToApi(`api/comment`, null, { parent, text })
    }

    async fetchUserComments(params) {
        return this.getFromApi(`user/${username}/comments`, params);
    }

    async deleteComment(id) {
        return this.postToApi(`api/del`, null, { id })
    }

    async fetchMultiSubreddits(multipath) {
        const url = `api/multi/${multipath}`;
        return this.getFromApi(url)
            .then(({data}) => data.subreddits.map(sub => sub.name));
    }

    async fetchNewPosts(subreddit, params) {
        return this.getFromApi(`r/${subreddit}/new`, params);
    }

    async saveListingItem(listingItem) {
        return this.postToApi("api/save", null, null, {id: listingItem.data.name})
    }

    async fetchSavedLinks() {
        return this.getFromApi(`user/${username}/saved`);
    }

    async hide(id) {
        return this.postToApi("api/hide", null, {id})
    }


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
    return web.promiseToFetchData(url, options).then(data => data.access_token);
}

async function getClientInstance() {
    return getAuthToken().then(token => new RedditClient(token))

}

const operations = {
    getListingItems: listing => listing.data.children,
    getListingItemTitle: listingItem => listingItem.data.title,
    getTitlesFromListing: listing =>
        listing.data.children
            .map(posts => posts.data)
            .map(post => post.title),
    fullName: listingItem => `${listingItem.kind}_${listingItem.data.id}`,
    category: listingItem => listingItem.kind,
    itemName: listingItem => listingItem.data.name,
};

module.exports = {
    getClientInstance,
    operations
};
