const {fetchNewPosts, fetchMultiSubreddits, saveListingItem, operations} = require('./reddit');

const path_to_multi = 'user/betteridge_bot/m/newsmulti/';

function isQuestion(listingItem) {
    return operations.getListingItemTitle(listingItem).includes('?');
}

async function invoke() {
    const subreddits = await fetchMultiSubreddits(path_to_multi)
    return Promise.all(
        subreddits
            .map(eachSubreddit => fetchNewPosts(eachSubreddit, {limit: 75,}))
            .map(eachPromiseForNewPosts => eachPromiseForNewPosts
                .then(listing => {
                        const listingsWithQuestions = operations.getListingItems(listing)
                            .filter(isQuestion);
                        console.log(`Found ${listingsWithQuestions.length} items`);
                        listingsWithQuestions.forEach(saveListingItem); //instead of saving item, we will comment 'No', and upvote
                        return listingsWithQuestions;
                    }
                )));
}

module.exports = {invoke};