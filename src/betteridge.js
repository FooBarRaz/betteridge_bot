const {fetchNewPosts, fetchMultiSubreddits, saveListingItem, operations} = require('./reddit');

const path_to_multi = 'user/betteridge_bot/m/newsmulti/';

function isQuestion(listingItem) {
    return operations.getListingItemTitle(listingItem).includes('?');
}

async function invoke() {
    return fetchMultiSubreddits(path_to_multi)
        .then(subreddits =>
            Promise.all(
                subreddits
                    .map(eachSubreddit => fetchNewPosts(eachSubreddit, {limit: 75,}))
                    .map(eachPromiseForNewPosts => eachPromiseForNewPosts
                        .then(listing => operations.getListingItems(listing)
                            .filter(isQuestion)
                            .map(saveListingItem) //instead of saving item, we will comment 'No', and upvote
                        ))));
}

module.exports = {invoke};