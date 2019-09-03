const {
    fetchNewPosts,
    fetchMultiSubreddits,
    saveListingItem,
    operations: {getListingItemTitle, getListingItems}
} = require('./reddit');

const path_to_multi = 'user/betteridge_bot/m/newsmulti/';

async function invoke() {
    return fetchMultiSubreddits(path_to_multi)
        .then(fetchPostsFromEachSubreddit)
        .then(filterPostsWithQuestionsInTitle)
        .then(savePosts)
}

function isQuestion(listingItem) {
    return getListingItemTitle(listingItem).includes('?');
}

function filterPostsWithQuestionsInTitle(listings) {
    return listings
        .map(getListingItems)
        .reduce((acc, curr) => [...acc, ...curr], [])
        .filter(isQuestion);
}

function fetchPostsFromEachSubreddit(subreddits) {
    return Promise.all(subreddits.map(fetchNewPosts));
}

function savePosts(posts) {
    return Promise.all(posts.map(saveListingItem))
        .then(() => posts.map(getListingItemTitle));
}

module.exports = {invoke};