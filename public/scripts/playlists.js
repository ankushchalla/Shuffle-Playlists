// Access token will be in url, we grab it and get playlists. 
let params = new URLSearchParams(window.location.search);
let access_token = params.get('access_token');
let playlists;

// Some API calls only work if the user has a Spotify premium account.
function isPremium() {
    return new Promise(resolve => {
        let options = {
            method: "GET",
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };
        $.ajax(options).then(function(response) {
            resolve(response.product === "premium");
        });
    });
}

// Gets device id of user's current active device.
function getDeviceId() {
    return new Promise((resolve, reject) => {
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
            else if (devices.length == 0) {
                reject(new ReferenceError("No devices found."));
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
    return new Promise((resolve, reject) => {
        let options = {
            method: "GET",
            url: 'https://api.spotify.com/v1/me/playlists?limit=50',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };
        $.ajax(options).then(function (res) {
            if (res.items.length === 0) reject(new RangeError("No playlists found."));
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
    // Make the appropriate html/css changes, then complete server-side work. 
    $(".info").addClass("display-4").removeClass("display-1").text("Your queue is being updated.");
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
    $(".list-group").remove();
    $("button").remove();
    // Send the playlists chosen by user to the server, which does the rest of the work.
    // Route in routes/api_routes/add_playlists.js
    $.ajax({
        type: "POST", 
        url: '/queue', 
        data: data, 
    }).then(function(response) {
        $(".info").text("Your queue has been updated :)")
    });
}

async function main() {
    // Redirect to the error page if the user doesn't have Spotify premium.
    let hasPremium = await isPremium();
    if (!hasPremium) window.location.replace('/error/non_premium');

    let deviceId;
    try {
        deviceId = await getDeviceId();
        playlists = await getUserPlaylists();
    }
    catch(err) {
        if (err instanceof ReferenceError) window.location.replace('/error/no_device');
        if (err instanceof RangeError) window.location.replace('/error/no_playlists');
    }
    
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
    let button = $("<div>").addClass("row d-flex text-center mb-5").append($("<a>").append($("<button>").text("Submit").attr({
        type: "button", 
        class: "btn btn-light"
    })));
    $(".container").append(button);

    button.click(function(event) {
        event.preventDefault();
        send(deviceId);
    });

}

main();



