const {
    getClientInstance,
    operations: {getListingItemTitle, getListingItems}
} = require('./reddit');

const path_to_multi = 'user/betteridge_bot/m/newsmulti/';

class BetteridgeBot {
    constructor(client) {
        this.client = client;
    }

    isQuestion(listingItem) {
        return getListingItemTitle(listingItem).includes('?');
    }

    filterPostsWithQuestionsInTitle(listings) {
        return listings
            .map(getListingItems)
            .reduce((acc, curr) => [...acc, ...curr], [])
            .filter(title => this.isQuestion(title));
    }

    fetchPostsFromEachSubreddit(subreddits) {
        return Promise.all(subreddits.map(subreddit => this.client.fetchNewPosts(subreddit)));
    }

    savePosts(posts) {
        return Promise.all(posts.map(post => this.client.saveListingItem(post)))
            .then(() => posts.map(getListingItemTitle));
    }
}

async function invoke() {
    const redditClient = await getClientInstance();
    const bb = new BetteridgeBot(redditClient)

    return redditClient.fetchMultiSubreddits(path_to_multi)
        .then(subreddit => bb.fetchPostsFromEachSubreddit(subreddit))
        .then(posts => bb.filterPostsWithQuestionsInTitle(posts))
        .then(postsWithQuestions => bb.savePosts(postsWithQuestions))

}


module.exports = {invoke};