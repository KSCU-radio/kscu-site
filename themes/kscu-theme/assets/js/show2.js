
// TODO: Make all date outputs in PST.

const formatDayOfWeek = (date) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
}

const formatAMPM = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes.toString().padStart(2, '0');
    let strTime = hours + ':' + minutes
    return strTime;
}

async function fetchShow() {
    console.log("Fetching show...")
    try {
        let request = `http://api-relay.eba-kmnypfm3.us-west-1.elasticbeanstalk.com/shows/get`
        let response = await fetch(request);
        if (response.status != 200) {
            throw new Error("Error: " + response.status)
        }

        let data = await response.json();

        try {
            store.remove("show_data")
            store.remove("showData")
            store('show_data', data)
        }
        catch (error) {
            store('show_data', data)
            console.log("Error: " + error)
        }
    }
    catch (error) {
        console.log("Error: " + error)
        // wait a random time between 0.2-0.6 seconds and try again
        setTimeout(fetchSpins, Math.floor(Math.random() * 400) + 200)
    }
}


async function placeShow() {
    let data;
    // try to fetch show data
    try {
        data = store.get("show_data");
        // Check if current show is old
        
        const currentShow = data["show-0"];
        const currentShowEndTime = new Date(currentShow.end);
        const now = new Date();
        console.log("Current show end time: " + currentShowEndTime)
        console.log("Now: " + now)
        if (now > currentShowEndTime) {
            // If so, fetch new show data
            await fetchShow()
            data = store.get("show_data");
        }
    }
    catch (error) {
        await fetchShow()
        data = store.get("show_data");
    }
    var currentShow2 = data["show-0"].title;
    const showTitle = `<b style="margin-right: 0.25rem;">${currentShow2}</b> <div id="dj_name_inner_div">with ${data["dj-0"].name}</div>`;
    document.getElementById("show_title").innerHTML = showTitle;
    document.getElementById("dj_name_inner_div").style.whiteSpace = "nowrap";

    // if (window.location.pathname === "/") {
    //     const { title, start, end, category } = data["show-1"];
    //     const dj_name = data["dj-1"].name;
    //     document.getElementById("next-show-and-dj").innerHTML = `<b>${title}</b> with ${dj_name}`;
    //     document.getElementById("next-time").innerHTML = `${formatAMPM(new Date(start))} - ${formatAMPM(new Date(end))}`;
    //     document.getElementById("next-genre").innerHTML = category;

    //     const categorySvg = {
    //         Automation: "Automation",
    //         Blues: "Blues",
    //         Country: "Country",
    //         Electronic: "Electronic",
    //         "Hip-Hop": "Hip-Hop",
    //         Indie: "Indie",
    //         Jazz: "Jazz",
    //         Pop: "Pop",
    //         Punk: "Punk",
    //         Rock: "Rock",
    //         Soul: "Soul",
    //         Sports: "Sports",
    //         Talk: "Talk",
    //     }[category] || `Other${new Date(start).getHours() % 12 || 12}`;
    //     document.getElementById("next-genre-svg").src = `genres/${categorySvg}.svg`;
    // }
}

function placeDesc(elem, child, description) {
    // console.log(description)
    // First, remove one set of <p> tags only from the start and end of the description if they exist
    if (description.startsWith('<p>') && description.endsWith('</p>')) {
        description = description.slice(3, -4);
    }

    if (!description || /^\s*$/.test(description)) {
        return
    } else {
        if (!/^".+"$/.test(description) && !/^“.+”$/.test(description)) {
            description = `“${description}”`;
        }
    }
    child.innerHTML = description;
    elem.style.display = "block";
}

function placeImage(elem, imageUrl, category, start) {
    function placeSVG() {
        const categorySvg = {
            Automation: "Automation",
            Blues: "Blues",
            Country: "Country",
            Electronic: "Electronic",
            "Hip-Hop": "Hip-Hop",
            Indie: "Indie",
            Jazz: "Jazz",
            Pop: "Pop",
            Punk: "Punk",
            Rock: "Rock",
            Soul: "Soul",
            Sports: "Sports",
            Talk: "Talk",
        }[category] || `Other${new Date(start).getHours() % 12 || 12}`;
        elem.style.width = "75%";
        elem.style.width = "75%";
        
        elem.src = `/genres/${categorySvg}.svg`;
    }
    var img = new Image();

    const regex = /spinitron\.com\/images\/Show/;
    
    if (!regex.test(imageUrl)) {
        placeSVG();
        return;
    }

    img.src = imageUrl;

    img.onload = function() {
        // Image is valid
        elem.src = imageUrl;
    }

    img.onerror = function() {
        placeSVG();
    }
}

async function placeShowDetails() {
    let data;
    try {
        data = store.get("show_data");
    } catch (error) {
        await fetchShow()
        data = store.get("show_data");
    }

    // First, check to see if show is currently playing or in the future and change the headers of the details section
    const currentShow = data["show-0"];
    const currentShowStart = new Date(currentShow.start);
    const now = new Date();
    if (now < currentShowStart) {
        // Hide red dot and change header
        document.getElementById("live-now-circle").style.display = "none";
        document.getElementById("live-play").innerHTML = "NEXT UP"

        // Now set details headers
        document.getElementById("left-header-box").innerHTML = "NEXT UP ON KSCU"
        document.getElementById("right-header-box").innerHTML = "AND AFTER THAT"
    } else {
        document.getElementById("live-now-circle").style.display = "block";
        document.getElementById("live-play").innerHTML = "LIVE"

        // Now set details headers
        document.getElementById("left-header-box").innerHTML = "LIVE NOW"
        document.getElementById("right-header-box").innerHTML = "NEXT UP ON KSCU"
    }

    // Now set details
    var { title, start, end, category, description} = data["show-0"];

    document.getElementById("left-show").innerHTML = `${title}`;
    document.getElementById("left-dj").innerHTML = `with <i>${data["dj-0"].name}</i>`;
    document.getElementById("left-time").innerHTML = `${formatDayOfWeek(new Date(start))} ${formatAMPM(new Date(start))} - ${formatAMPM(new Date(end))}`;
    document.getElementById("left-genre").innerHTML = category;
    placeDesc(document.getElementById("left-description-div"), document.getElementById("left-description"), description);
    placeImage(document.getElementById("left-image"), data["show-0"].image, category, start);

    document.getElementById("right-show").innerHTML = `${data["show-1"].title}`;
    document.getElementById("right-dj").innerHTML = `with <i>${data["dj-1"].name}</i>`;
    document.getElementById("right-time").innerHTML = `${formatDayOfWeek(new Date(data["show-1"].start))} ${formatAMPM(new Date(data["show-1"].start))} - ${formatAMPM(new Date(data["show-1"].end))}`;
    document.getElementById("right-genre").innerHTML = data["show-1"].category;
    placeDesc(document.getElementById("right-description-div"), document.getElementById("right-description"), data["show-1"].description);
    placeImage(document.getElementById("right-image"), data["show-1"].image, data["show-1"].category, data["show-1"].start);

}

async function updateShow() {
    // First fetch new data
    await fetchShow()

    // Then place the new data
    placeShow()
    placeShowDetails();
}


// Always place show on page load
await placeShow()
await placeShowDetails();

// Create cron job
const cron = cronSchedule.parseCronExpression('2 0,15,30,45 * * * *')
const timer = cronSchedule.TimerBasedCronScheduler.setInterval(cron, updateShow, 0);