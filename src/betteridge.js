const {
    getClientInstance,
    operations: {getListingItemTitle, getListingItems, fullName}
} = require('./reddit');
const {containsPolarQuestion} = require('./questions');

const path_to_multi = 'user/betteridge_bot/m/newsmulti/';

class BetteridgeBot {
    constructor(client) {
        this.client = client;
    }

    filterPostsWithPolarQuestionsInTitle(listings) {
        return listings
            .map(getListingItems)
            .reduce((acc, curr) => [...acc, ...curr], [])
            .filter(post => containsPolarQuestion(getListingItemTitle(post)));
    }

    fetchPostsFromEachSubreddit(subreddits) {
        return Promise.all(
            subreddits.map(
                subreddit => this.client.fetchNewPosts(subreddit, {limit: 100})));
    }

    savePosts(posts) {
        return Promise.all(posts.map(post => this.client.saveListingItem(post)))
            .then(() => posts.map(getListingItemTitle));
    }

    commentOnPosts(posts) {
        const comment =
            `The answer is *no*, according to [Betteridge's Law of Headlines](https://en.wikipedia.org/wiki/Betteridge's_law_of_headlines)`;

        return Promise.all(
            posts.map(post =>
                this.client.postComment(fullName(post), comment)
                    .then(() => post)))
            .then(allPosts => Promise.all(
                allPosts.map(
                    post => this.client.hide(fullName(post))
                        .then(() => post)
                ))).then(() => posts.map(getListingItemTitle))
    }

}

module.exports = {
    BetteridgeBot,
    invoke: async function () {
        const redditClient = await getClientInstance();
        const bb = new BetteridgeBot(redditClient);

        return redditClient.fetchMultiSubreddits(path_to_multi)
            .then(subreddits => bb.fetchPostsFromEachSubreddit(subreddits))
            .then(posts => bb.filterPostsWithPolarQuestionsInTitle(posts))
            .then(postsWithQuestions => bb.commentOnPosts(postsWithQuestions))
    }
};