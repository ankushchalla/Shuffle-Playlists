// Access token will be in url, we grab it and get playlists. 
let params = new URLSearchParams(window.location.search);
let access_token = params.get('access_token');

function getUserPlaylists() {
    return new Promise((resolve) => {
        let options = {
            method: "GET",
            url: 'https://api.spotify.com/v1/me/playlists',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };
        $.ajax(options).then(function (res) {
            let allPlaylists = res.items.map(playlist => {
                return {
                    name: playlist.name,
                    tracks: playlist.tracks.href
                };
            })
            resolve(allPlaylists);
        });
    });
}

async function main() {
    let playlists = await getUserPlaylists();
    playlists.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
    for (let i = 0; i < playlists.length; i++) {
        let playlist = playlists[i];
        let name = $("<li>").addClass("list-group-item list-group-item-action").text(playlist.name);
        if (i === playlists.length - 1) {
            name.attr("id", "last");
        }
        $(".list-group").append(name);
        name.click(function () {
            $(this).toggleClass("chosen");
        });
    }
    let button = $("<div>").addClass("row d-flex text-center mb-5").append($("<a>").append($("<button>").text("Submit")));
    $(".container").append(button);


}

$(".list-group").click(function() {
    console.log("clicked");
})

main();