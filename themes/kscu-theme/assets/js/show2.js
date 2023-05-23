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

// This function takes in a list of DJs and returns a string of their names, concatnated to be grammatically correct.
// It should add commas and "&" where appropriate.
const formatDJs = (djs) => {
    const len = Object.keys(djs).length;
    let djString = "";
    for (let i = 0; i < len; i++) {
        if (i === len - 1) {
            djString += djs[i].name;
        }
        else if (i === len - 2) {
            djString += djs[i].name + " & ";
        }
        else {
            djString += djs[i].name + ", ";
        }
    }
    return djString;
}


function underlineLinksInParagraph(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const links = doc.getElementsByTagName("a");
    for (let j = 0; j < links.length; j++) {
        // Add class "link-style"
        links[j].classList.add("link-style");
    }
    return doc.documentElement.innerHTML;
}

function replaceBreaksAndParagraphsWithSpaces(text) {
    console.log(text);

    let toReturn = text.replace(/<br\s*\/?>|<br\s*>\s*<\/br\s*>/gi, ' ').trim();
    toReturn = toReturn.replace(/<p>|<\/p>/gi, ' ').trim();
    return toReturn;
}

async function fetchShow() {
   // console.log("Fetching show...")
    try {
        let request = `https://kscuapi.org/shows/get`
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
        //    console.log("Error: " + error)
        }
    }
    catch (error) {
        // console.log("Error: " + error)
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
       // console.log("Current show end time: " + currentShowEndTime)
        // console.log("Now: " + now)
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

    const currentShow2 = data["show-0"].title;
    const showTitle = `<b style="margin-right: 0.25rem; white-space: nowrap;">${currentShow2}</b> <div id="dj_name_inner_div">with ${formatDJs(data["v2"]["dj-0"])}</div>`;
    document.getElementById("show_title").innerHTML = DOMPurify.sanitize(showTitle, { ALLOWED_TAGS: ['b', 'i', 'div'], ALLOWED_ATTR: ['style', 'id'] });
    document.getElementById("dj_name_inner_div").style.whiteSpace = "nowrap";
}

function placeDesc(parentElement, descriptionElement, descriptionText) {
    if (!descriptionText || descriptionText.trim() === "") {
        return;
    }

    descriptionText = replaceBreaksAndParagraphsWithSpaces(descriptionText);

    // Add quotes around the description if they don't already exist
    if (!/^".+"$/.test(descriptionText) && !/^“.+”$/.test(descriptionText)) {
        descriptionText = `“${descriptionText}”`;
    }

    // DOMPurify configuration object
    var config = {
        ALLOWED_TAGS: ['strong', 'em', 'ol', 'ul', 'li', 'br', 'a', 'p'],
        ALLOWED_ATTR: ['href', 'target'], // You can add more allowed attributes if needed
        ALLOW_STYLES: [],
        FORBID_ATTR: ['style']
    };

    // Sanitize the description
    descriptionText = DOMPurify.sanitize(descriptionText, config);

    descriptionText = underlineLinksInParagraph(descriptionText);

    descriptionElement.innerHTML = descriptionText;
    parentElement.style.display = "block";
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
            Disco: "Disco",
            Psychedelic: "Psychedelic",
            Folk: "Folk",
            "R&B": "R&B",
            Reggae: "Reggae",
            Metal: "Metal",
            "Special Event": "SpecialEvent",
        }[category] || `Other`;

        elem.style.minHeight = "75%";
        elem.style.minWidth = "75%";
        elem.style.maxWidth = "75%";
        elem.style.maxHeight = "75%";

        elem.src = `/genres/${categorySvg}.svg`;
    }
    var img = new Image();

    const regex = /spinitron\.com\/images\/Show/;

    if (!regex.test(imageUrl)) {
        placeSVG();
        return;
    }

    img.src = imageUrl;

    img.onload = function () {
        // Image is valid

        elem.style.minHeight = "100%";
        elem.style.minWidth = "100%";
        elem.style.maxWidth = "100%";
        elem.style.maxHeight = "100%";

        elem.src = imageUrl;
    }

    img.onerror = function () {
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
    var { title, start, end, category, description } = data["show-0"];

    document.getElementById("left-show").innerHTML = DOMPurify.sanitize(`${title}`, {ALLOWED_TAGS: []});
    
    document.getElementById("left-dj").innerHTML = DOMPurify.sanitize(`with <i>${formatDJs(data["v2"]["dj-0"])}</i>`, { ALLOWED_TAGS: ['i'] });
    document.getElementById("left-time").innerHTML = DOMPurify.sanitize(`${formatDayOfWeek(new Date(start))} ${formatAMPM(new Date(start))} - ${formatAMPM(new Date(end))}`, { ALLOWED_TAGS: [] });
    document.getElementById("left-genre").innerHTML = DOMPurify.sanitize(category, { ALLOWED_TAGS: [] });
    placeDesc(document.getElementById("left-description-div"), document.getElementById("left-description"), description);
    placeImage(document.getElementById("left-image"), data["show-0"].image, category, start);

    document.getElementById("right-show").innerHTML = DOMPurify.sanitize(`${data["show-1"].title}`, { ALLOWED_TAGS: [] });

    document.getElementById("right-dj").innerHTML = DOMPurify.sanitize(`with <i>${formatDJs(data["v2"]["dj-1"])}</i>`, { ALLOWED_TAGS: ['i'] });
    document.getElementById("right-time").innerHTML = DOMPurify.sanitize(`${formatDayOfWeek(new Date(data["show-1"].start))} ${formatAMPM(new Date(data["show-1"].start))} - ${formatAMPM(new Date(data["show-1"].end))}`, { ALLOWED_TAGS: [] });
    document.getElementById("right-genre").innerHTML = DOMPurify.sanitize(data["show-1"].category, { ALLOWED_TAGS: [] });
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
const cron = cronSchedule.parseCronExpression('5 0,15,30,45 * * * *')
const timer = cronSchedule.TimerBasedCronScheduler.setInterval(cron, updateShow, 0);