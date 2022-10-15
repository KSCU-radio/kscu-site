
const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2, '0');
    let strTime = hours + ':' + minutes + '' + ampm;
    return strTime;
}

async function fetchShow() {
    try {
        request = `/.netlify/functions/show`
        console.log("Request: " + request)
        let response = await fetch(request);
        let data = await response.json();
        console.log("Recieved data...");
        store('showData', data)
        return { statusCode: 500, body: "Next Show: " + title }
    }
    catch (error) { return { statusCode: 500, body: error.toString() } }
} async function getShow() {
    function placeData(data) { // if show is upcoming 
        if (new Date(data['start_time']) > Date.now()) {
            // if show is in the future
            // document.getElementById('isLive').innerHTML = "Up Next on KSCU:"
            document.getElementById('title').innerHTML = data['title'] + '-' + data['DJ_name'] + " at " + formatAMPM(new Date(data['start_time']))

        } else {
            // if show is live
            // document.getElementById('isLive').innerHTML = "Live Now:  ";
            // console.log("Starting animation.")
            // document.getElementById('live-now-circle').style.animationPlayState = "running";
            // document.getElementById('live-now-circle').style.display = "inline-block";
            document.getElementById('title').innerHTML = data['title'] + '-' + data['DJ_name'] + " at " + formatAMPM(new Date(data['start_time']))
        }
    }

    if (store.has("showData")) {
        data = store.get("showData")
        end_time = new Date(data['end_time'])
        if (end_time > new Date()) {
            // Show is currently on
            if ((data['title']) != document.getElementById("title").innerHTML) {
                console.log("Old show is still on air, placing data...")
                placeData(data)
            } else {
                console.log("Show in DOM does not match current show, fetching new show...")
                x = await fetchShow()
                placeData(store.get("showData"))
            }
        } else {
            console.log("Show is over, fetching new show...")
            x = await fetchShow()
            placeData(store.get("showData"))
        }
    } else {
        console.log("No show data found, fetching...")
        x = await fetchShow()
        placeData(store.get("showData"))
    }
    // Repeat after 5 minutes
    setTimeout(getShow, 300000)
}

getShow()
