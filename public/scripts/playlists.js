// Access token will be in url, we grab it and get playlists. 
let params = new URLSearchParams(window.location.search);
let access_token = params.get('access_token');
let playlists;

// Gets device id of user's current active device.
function getDeviceId() {
    return new Promise(resolve => {
        let options = {
            method: "GET",
            url: 'https://api.spotify.com/v1/me/player/devices',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };
        $.ajax(options).then(function(response) {
            let devices = response.devices;
            if (devices.length == 1) {
                return resolve(devices[0].id)
            }
            for (let i = 0; i < devices.length; i++) {
                // active = playing...probably.
                if (devices[i].is_active) {
                    return resolve(devices[i].id);
                }
            }
        });
    });
}

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

// When the user clicks submit, the two playlists they have chosen are sent to the server. 
function send(deviceId) {
    let data = {
        playlists: [],
        access_token: access_token, 
        deviceId: deviceId
    };
    let i = 0;
    $(".list-group").children().each(function() {
        if ($(this).hasClass("chosen")) {
            data.playlists.push(playlists[i]);
        }
        i++;
    });
    // Send the playlists chosen by user to the server, which does the rest of the work.
    // Route in get_playlists.js
    $.ajax({
        type: "POST", 
        url: '/queue', 
        data: data, 
    });
}

async function main() {
    let deviceId = await getDeviceId();
    playlists = await getUserPlaylists();
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

    button.click(function(event) {
        event.preventDefault();
        send(deviceId);
    });

}

main();

