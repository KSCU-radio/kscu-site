
// function insertTracks(data) {
//     function duration(duration_time) {
//         let minutes = Math.floor(duration_time / 60)
//         let seconds = duration_time % 60
//         if (seconds < 10) {
//             seconds = "0" + seconds
//         }
//         return minutes + ":" + seconds
//     }

//     // Function to add quotes to a string
//     document.getElementById("playing-song").innerHTML = trimToLength(data[0]["song"], 40) + " - <em>" + trimToLength(data[0]["artist"], 40) + "</em>"

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
// }


// async function fetchTracks() {
//     // console.log("Fetching track data...");
//     request = `/.netlify/functions/spins`
//     // console.log("Request: " + request)
//     let response = await fetch(request);
//     let res = await response.json();
//     let data = res["items"]

//     insertTracks(data)

//     store("recentTracks", data)
//     // console.log("Stored track data...");
//     insertTracks(data)
// }

// async function updateTracks() {
//     console.log(new Date(store("songEnd")))
//     if (new Date(store("songEnd")) > Date.now()) {
//         // console.log("Inserted stored track data...");
//         insertTracks(store.get("recentTracks"));
//     } else {
//         // console.log("Track has ended, fetching new data...")
//         fetchTracks()
//     }

//     setTimeout(updateTracks, 15000)
// }


// async function putRecentTracks() {
//     if (store.has("recentTracks")) {
//         updateTracks()
//     } else {
//         fetchTracks();
//         updateTracks()
//     }
// }

// putRecentTracks()


// New code

// startTracks



function placeSpins() {

    data = store.get("recentTracks")

    document.getElementById("playing-song").innerHTML = data[0]["song"] + " - <em>" + data[0]["artist"], 40 + "</em>"

    if (window.location.pathname == '/') {
        // Loop over first 5 elements of data and place them their image, song, and artist in playing-image-n, playing-song-n, and playing-artist-n
        for (let i = 1; i < 5; i++) {
            document.getElementById("playing-song-" + i).innerHTML = data[i]["song"]
            document.getElementById("playing-artist-" + i).innerHTML = data[i]["artist"]
            if (data[i]["image"] != null) {
                document.getElementById("playing-image-" + i).onerror = "this.onerror=null;this.src='/vinyl.svg'";
                document.getElementById("playing-image-" + i).src = data[i]["image"]
                // console.log(data[i]["image"])
                // loadIMG(i, data[i]["image"])
            } else {
                document.getElementById("playing-image-" + i).src = "/vinyl.svg"
            }   
        }
    }
    if (typeof sound !== 'undefined' && sound.playing()) {
        document.title = data[0]["song"] + " - " + data[0]["artist"]
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: (data[0]["song"] + " - " + data[0]["artist"]),
                artist: store.get("showData")[0]["title"] + " - " + store.get("showData")[0]["DJ_name"],
                album: "",
                artwork: [
                    { src: "/kscu-round-92.png", sizes: "92x92", type: "image/png" },
                    { src: "/kscu-round-128.png", sizes: "128x128", type: "image/png" },
                    { src: "/kscu-round-192.png", sizes: "192x192", type: "image/png" },
                    { src: "/kscu-round-256.png", sizes: "256x256", type: "image/png" },
                    { src: "/kscu-round-384.png", sizes: "384x384", type: "image/png" },
                    { src: "/kscu-round-512.png", sizes: "512x512", type: "image/png" },
                ]
            });
        }
    }
}

async function fetchTracks() {
    // console.log("Fetching track data...");
    request = `/.netlify/functions/spins`
    let response = await fetch(request);
    let res = await response.json();
    let data = res
    // console.log(data)
    store.remove("recentTracks")
    store("recentTracks", data)
}

var progressiveTimer = 10000

async function updateTracks() {
    // First fetch new data
    // console.log("Fetching new track data...")
    await fetchTracks()

    // Then place the new data
    placeSpins()

    // Log using CountAPI that data has been fetched from Spinitron API
    fetch("https://api.countapi.xyz/hit/kscu.org/spinitronRequests")
        .then(async response => {
            // let data = await response.json()
            // console.log("Spinitron API requests since API's creation on 12/2/2022: " + data.value)
        })
        .catch(error => {
            console.error('There was an error fetching the API hitcounter!', error);
        });

    // Then grab the end time of the first track
    let songEnd = store.get("recentTracks")[0]["end"]
    
    if (new Date(songEnd) > Date.now()) {
        progressiveTimer = 10000
        setTimeout(updateTracks, (new Date(songEnd) - Date.now()) + 20000 + Math.floor(Math.random() * 10000))
    } else {
        progressiveTimer = progressiveTimer + 10000
        setTimeout(updateTracks, progressiveTimer)
    }
}

async function startTracks() {
    if (store.has("recentTracks")) {
        placeSpins() // Place the stored data immediately on page load
        songEnd = store.get("recentTracks")[0]["end"]
        if (new Date(songEnd) > Date.now()) {
            // console.log("Song ends in  " + ((new Date(songEnd) - Date.now()) / 1000 / 60).toFixed(2) + "mins")
            setTimeout(updateTracks, (new Date(songEnd) - Date.now())+ 20000 + Math.floor(Math.random() * 10000))
        } else {
            updateTracks()
        }
    } else {
        updateTracks()
    }
}

startTracks()