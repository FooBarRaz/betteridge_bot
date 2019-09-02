const {fetchNewPosts, fetchMultiSubreddits, saveListingItem, operations} = require('./reddit');

const path_to_multi = 'user/betteridge_bot/m/newsmulti/';

function isQuestion(listingItem) {
    return operations.getListingItemTitle(listingItem).includes('?');
}

function filterListingsWithQuestionsInThem(listings) {
    return listings
        .map(operations.getListingItems)
        .reduce((acc, curr) => [...acc, ...curr], [])
        .filter(isQuestion);
}

async function invoke() {
    return fetchMultiSubreddits(path_to_multi)
        .then(subreddits => Promise.all(subreddits.map(fetchNewPosts)))
        .then(filterListingsWithQuestionsInThem)
        .then(listing => Promise.all(listing.map(saveListingItem)).then(() => listing.map(operations.getListingItemTitle)))
}

module.exports = {invoke};