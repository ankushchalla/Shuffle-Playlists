import { isPremium, getDeviceId, getUserPlaylists } from './user_info.js';

// Access token will be in url, we grab it and get playlists. 
let params = new URLSearchParams(window.location.search);
let access_token = params.get('access_token');

function getLength(maxTotal) {
    // Give user prompt to choose length of queue.
    let input = $("<input>").attr({
        type: "number",
        id: "length",
        min: "1",
        max: `${maxTotal * 2}`,
        value: maxTotal
    });
    $(".header").empty().append($("<h2>").addClass("display-4 info").text(`Choose how many songs to add to your queue (max ${maxTotal * 2}):`)
        .append(input));
    $(".btn-row").removeClass("text-center");

    // Grab value when it arrives, return.
    return new Promise(resolve => {
        $("button").click(function (event) {
            event.preventDefault();
            resolve($("#length").val());
        });
    })
}

// When the user clicks submit, the two playlists they have chosen are sent to the server. 
async function send(allPlaylists, deviceId) {
    // Make the appropriate html/css changes, then complete server-side work. 
    $(".info").addClass("display-4").removeClass("display-1").text("Your queue is being updated.");
    let data = {
        playlists: [],
        access_token: access_token,
        deviceId: deviceId
    };
    let i = 0;
    $(".list-group").children().each(function () {
        if ($(this).hasClass("chosen")) {
            data.playlists.push(allPlaylists[i]);
        }
        i++;
    });
    $(".list").remove();

    let maxTotal;
    data.playlists[0].total <= data.playlists[1].total ? maxTotal = data.playlists[0].total : maxTotal = data.playlists[1].total
    // Prompt user for queue length, add to data.
    data.length = await getLength(maxTotal);
    $("button").remove();
    // Send the playlists chosen by user to the server, which does the rest of the work.
    // Route in routes/api_routes/add_playlists.js
    $.ajax({
        type: "POST",
        url: '/add_playlists',
        data: data,
    }).then(function (response) {
        $(".info").text("Your queue has been updated :)")
    });
}

async function main() {
    // Redirect to the error page if the user doesn't have Spotify premium.
    let hasPremium = await isPremium(access_token);
    if (!hasPremium) window.location.replace('/error/non_premium');

    // An array of object, each object containing relevant playlist data.
    let allPlaylist;
    let deviceId;
    try {
        deviceId = await getDeviceId(access_token);
        // For each playlist returned, we have its name, an href to its songs, and total # of songs. 
        allPlaylist = await getUserPlaylists(access_token);
    }
    catch (err) {
        if (err instanceof ReferenceError) window.location.replace('/error/no_device');
        if (err instanceof RangeError) window.location.replace('/error/no_playlists');
    }

    // Render names of playlists in alphabetical order for user to select.
    allPlaylist.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
    for (let i = 0; i < allPlaylist.length; i++) {
        let playlist = allPlaylist[i];
        let name = $("<li>").addClass("list-group-item list-group-item-action").text(playlist.name + ` (${playlist.total})`);
        if (i === allPlaylist.length - 1) {
            name.attr("id", "last");
        }
        $(".list-group").append(name);
        name.click(function () {
            $(this).toggleClass("chosen");
        });
    }
    let button = $("<div>").addClass("row d-flex text-center mb-5 btn-row").append($("<a>").append($("<button>").text("Submit").attr({
        type: "button",
        class: "btn btn-light"
    })));
    $(".container").append(button);

    button.click(function (event) {
        event.preventDefault();
        send(allPlaylist, deviceId);
    });

}

main();



