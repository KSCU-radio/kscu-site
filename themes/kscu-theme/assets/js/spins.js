
function trimToLength(string, length) {
    if (string.length > length) {
        trimmedStr = string.substring(0, length - 3)
        // return trimmedStr to nearest word
        return trimmedStr.substring(0, Math.min(trimmedStr.length, trimmedStr.lastIndexOf(" "))) + "..."
    } else {
        return string
    }
}

function insertTracks(data) {
    function duration(duration_time) {
        let minutes = Math.floor(duration_time / 60)
        let seconds = duration_time % 60
        if (seconds < 10) {
            seconds = "0" + seconds
        }
        return minutes + ":" + seconds
    }

    // Function to add quotes to a string
    document.getElementById("playing-song").innerHTML = trimToLength(data[0]["song"], 40) + " - <em>" + trimToLength(data[0]["artist"], 40) + "</em>"

    // image = String(data[0]['image'])
    // console.log(image)
    // let imageSRC = document.getElementById("album-art")
    // imageSRC.src = image
    // let list = document.getElementById("past-tracks");
    // // Clear the list
    // list.innerHTML = ""
    // for (let i = 1; i < data.length; i++) {
    //     let row = document.createElement("tr");
    //     song_title = data[i]["song"]
    //     artist = data[i]["artist"]

    //     row.innerHTML = song_title + " (" + duration(data[i]["duration"]) + ")";
    //     list.appendChild(row);
    // }
}


async function fetchTracks() {
    // console.log("Fetching track data...");
    request = `/.netlify/functions/spins`
    // console.log("Request: " + request)
    let response = await fetch(request);
    let data = await response.json();
    // console.log("Recieved track data...");
    // console.log(data);

    insertTracks(data)

    store("recentTracks", data)
    store("songEnd", data[0]["end"])
    // console.log("Stored track data...");
    insertTracks(data)
}

async function updateTracks() {
    console.log(new Date(store("songEnd")))
    if (new Date(store("songEnd")) > Date.now()) {
        // console.log("Inserted stored track data...");
        insertTracks(store.get("recentTracks"));
    } else {
        // console.log("Track has ended, fetching new data...")
        fetchTracks()
    }

    setTimeout(updateTracks, 15000)
}


async function putRecentTracks() {
    if (store.has("recentTracks")) {
        updateTracks()
    } else {
        fetchTracks();
        updateTracks()
    }
}

putRecentTracks()