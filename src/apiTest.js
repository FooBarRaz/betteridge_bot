const {BetteridgeBot} = require("./betteridge");
const {
    getClientInstance,
    operations: {getListingItemTitle, getListingItems, fullName}
} = require('./reddit');

module.exports = {
    test: async function() {
        const redditClient = await getClientInstance();
        const bb = new BetteridgeBot(redditClient);

        return Promise.resolve("reddit_api_test")
            .then(subreddit => redditClient.fetchNewPosts(subreddit, { limit: 100 }))
            .then(getListingItems)
            .then(posts => bb.commentOnPosts(posts))

    },

    cleanUp: async function() {
        const redditClient = await getClientInstance();
        const bb = new BetteridgeBot(redditClient);

        return redditClient.fetchUserComments()
            .then(comments => comments.data.children.filter(child => child.data.subreddit === 'reddit_api_test'))
            .then(comments => comments.map(fullName))
            .then(commentIds=> Promise.all(commentIds.map(commentId => redditClient.deleteComment(commentId))));
    }
}