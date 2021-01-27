// Array shuffler used in get_playlists.

// Fisher-Yates shuffle.
function shuffle(array) {
    let input = array;

    for (let i = input.length - 1; i >= 0; i--) {
        // Pick a random int between 0 and i (inclusive because of the floor + i+1 combo).
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}

module.exports = shuffle;