
const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2, '0');
    let strTime = hours + ':' + minutes
    return strTime;
}

// async function fetchShow() {
//     try {
//         request = `/.netlify/functions/show`
//         console.log("Request: " + request)
//         let response = await fetch(request);
//         let data = await response.json();
//         console.log("Recieved data...");
//         store('showData', data)
//         return { statusCode: 500, body: "Next Show: " + title }
//     }
//     catch (error) { return { statusCode: 500, body: error.toString() } }
// } 

// async function getShow() {
//     function placeData(data) { // if show is upcoming 
//         if (new Date(data['start_time']) > Date.now()) {
//             // if show is in the future
//             // document.getElementById('isLive').innerHTML = "Up Next on KSCU:"
//             document.getElementById('show_title').innerHTML = '<b>' + data['title'] + '</b>'  + " with " + data['DJ_name']
//         } else {
//             // if show is live
//             // document.getElementById('isLive').innerHTML = "Live Now:  ";
//             // console.log("Starting animation.")
//             // document.getElementById('live-now-circle').style.animationPlayState = "running";
//             // document.getElementById('live-now-circle').style.display = "inline-block";
//             document.getElementById('show_title').innerHTML = '<b>' + data['title'] + '</b>' + " with " + data['DJ_name']
//         }
//     }

//     if (store.has("showData")) {
//         data = store.get("showData")
//         end_time = new Date(data['end_time'])
//         if (end_time > new Date()) {
//             // Show is currently on
//             if ((data['title']) != document.getElementById("show_title").innerHTML) {
//                 console.log("Old show is still on air, placing data...")
//                 placeData(data)
//             } else {
//                 console.log("Show in DOM does not match current show, fetching new show...")
//                 x = await fetchShow()
//                 placeData(store.get("showData"))
//             }
//         } else {
//             console.log("Show is over, fetching new show...")
//             x = await fetchShow()
//             placeData(store.get("showData"))
//         }
//     } else {
//         console.log("No show data found, fetching...")
//         x = await fetchShow()
//         placeData(store.get("showData"))
//     }
//     // Repeat after 5 minutes
//     setTimeout(getShow, 300000)
// }

// getShow()

// // New code
function placeShow() {
    data = store.get("showData")
    document.getElementById("show_title").innerHTML = "<b>" + data[0]["title"] + "</b>" + " with " + data[0]["DJ_name"]
    // If on homepage
    if (window.location.pathname == '/') {
        document.getElementById("next-show-and-dj").innerHTML = "<b>" + data[1]["title"] + "</b>" + " with " + data[1]["DJ_name"]
        document.getElementById("next-time").innerHTML = formatAMPM(new Date(data[1]["start_time"])) + " - " + formatAMPM(new Date(data[1]["end_time"]))
        document.getElementById("next-genre").innerHTML = data[1]["category"]
        // Set genre svg to the respective [category].svg based on the category in data[1]
        svg = "genres/default.svg"
        switch(data[1]["category"]) {
            case "Automation":
                svg = "genres/Automation.svg"
                break
            case "Blues":
                svg = "genres/Blues.svg"
                break
            case "Country":
                svg = "genres/Country.svg"
                break
            case "Electronic":
                svg = "genres/Electronic.svg"
                break
            case "Hip-Hop":
                svg = "genres/Hip-Hop.svg"
                break
            case "Indie":
                svg = "genres/Indie.svg"
                break
            case "Jazz":
                svg = "genres/Jazz.svg"
                break
            case "Pop":
                svg = "genres/Pop.svg"
                break
            case "Punk":
                svg = "genres/Punk.svg"
                break
            case "Rock":
                svg = "genres/Rock.svg"
                break
            case "Soul":
                svg = "genres/Soul.svg"
                break
            case "Sports":
                svg = "genres/Sports.svg"
                break
            case "Talk":
                svg = "genres/Talk.svg"
                break
            default:
                // For use the hour of the day (0-12) to determine which svg to use
                hour = new Date(data[1]["start_time"]).getHours() % 12 || 12;
                console.log(hour)
                svg = "genres/Other" + hour + ".svg"
        }
        document.getElementById("next-genre-svg").src = svg
    }
}

async function fetchShow() {
        try {
                request = `/.netlify/functions/show`
        // console.log("Request: " + request)
        let response = await fetch(request);
        let data = await response.json();
        // console.log("Recieved data...");
        store.remove("showData")
        store('showData', data)
        return { statusCode: 500, body: "Next Show: " + title }
    }
    catch (error) { return { statusCode: 500, body: error.toString() } }
} 

var showTimer = 60000

async function updateShow() {
    // First fetch new data
    // console.log("Fetching new show data...")
    await fetchShow()

    // Then place the new data
    placeShow()

    // Log using the CountAPI API that a request to the Spinitron API has been made
    fetch("https://api.countapi.xyz/hit/kscu.org/spinitronRequests")
        .then(async response => {
            // let data = await response.json()
            // console.log("Spinitron API requests since API's creation on 12/2/2022: " + data.value)
        })
        .catch(error => {
            console.error('There was an error fetching the API hitcounter!', error);
        });

    // Then grab the end time of the show
    let showEnd = new Date(store.get("showData")["end_time"])


    if (new Date(showEnd) > Date.now()) {
        showTimer = 60000
        setTimeout(updateShow, (new Date(showEnd) - Date.now()) + 1000 + Math.floor(Math.random() * 3000))
    } else {
        showTimer = showTimer + 60000
        setTimeout(updateShow, showTimer)
    }
}

async function startShow() {
    if (store.has("showData")) {
        placeShow()
        showEnd = new Date(store.get("showData")["end_time"])
        if (new Date(showEnd) > Date.now()) {
            // console.log("Show is currently on, waiting for it to end in " + ((new Date(showEnd) - Date.now())/1000/60).toFixed(2) + " mins")
            setTimeout(updateShow, (new Date(showEnd) - Date.now()) + 1000 + Math.floor(Math.random() * 3000))
        } else {
            updateShow()
        }
    } else {
        updateShow()
    }
}

startShow()