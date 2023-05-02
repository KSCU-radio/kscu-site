const formatSpin_AMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2, '0');
    let strTime = hours + ':' + minutes
    return strTime;
}

async function fetchSpins() {
    // console.log("hello from fetchSpins()")
    try {
        let request = `https://kscuapi.org/spins/get`
        let response = await fetch(request);
        if (response.status != 200) {
            throw new Error("Error: " + response.status)
        }

        let data = await response.json();

        try {
            store.remove("spin_data")
            store.remove("recentTracks")
            store('spin_data', data)
        }
        catch (error) {
            store('spin_data', data)
            // console.log("Error: " + error)
        }
    }
    catch (error) {
        // console.log("Error: " + error)
        // wait a random time between 0.2-0.6 seconds and try again
        setTimeout(fetchSpins, Math.floor(Math.random() * 400) + 200)
    }
}

async function placeSpins() {
    // console.log("hello from placeSpins()")
    let data;
    try {
        data = store.get("spin_data");
    }
    catch (error) {
        await fetchSpins()
        data = store.get("spin_data");
    }
    const song = data["spin-0"].song
    const artist = data["spin-0"].artist
    document.getElementById("playing-song").innerHTML = `${song} - <em>${artist}</em>`;
    const elems = ['spin-0', 'spin-1', 'spin-2', 'spin-3', 'spin-4', 'spin-5', 'spin-6', 'spin-7', 'spin-8', 'spin-9'];
    if (window.location.pathname == '/') {
        for (let i = 1; i < 7; i++) {
            j = elems[i];
            document.getElementById("playing-song-" + i).innerHTML = data[j]["song"]
            document.getElementById("playing-artist-" + i).innerHTML = data[j]["artist"]
            document.getElementById("year-" + i).innerHTML = data[j]["released"]
            // document.getElementById("year-" + i).innerHTML = "At " + formatSpin_AMPM(new Date(data[j]["start"]))
            if (data[j]["image"] != null) {
                document.getElementById("playing-image-" + i).onerror = "this.onerror=null;this.src='/vinyl.svg'";
                document.getElementById("playing-image-" + i).src = data[j]["image"]
            } else {
                document.getElementById("playing-image-" + i).src = "/vinyl.svg"
            }
        }
    }

    if (typeof sound !== 'undefined' && sound.playing()) {
        const show_data = store.get("show_data");
        document.title = `${song} - ${artist}`;
        media_title = `${song} - ${artist}`;
        const cur_djs = data["dj-0"][0].name;
        if (show_data["dj-0"].length > 1) {
            for (var i = 1; i < show_data["dj-0"].length; i++) {
                cur_djs += ", " + show_data["dj-0"][i].name;
            }
        }
        media_artist = `${show_data["show-0"].title} - ${cur_djs}`;
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                    title: media_title,
                    artist: media_artist,
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

async function updateSpins() {
    await fetchSpins();
    await placeSpins();
}

placeSpins();
updateSpins();

// Open a SSE connection to the /streams/ endpoint
async function openSSE() {
    // console.log("Opening SSE connection...")
    let eventSource = new EventSource(`https://kscuapi.org/spins/stream/`);
    eventSource.onmessage = async function (event) {
        // console.log("Received message: " + event.data)
        if (event.data == "Spin outdated - Update needed.") {
            await updateSpins();
        }
    }
}

openSSE();