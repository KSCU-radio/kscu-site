let show_details, show_tracks;

function resizeFunction() {
    if (window.innerWidth < 1077) {
        // Check if #training has class lower-class
        if (!document.getElementById('training').classList.contains("lower-class")) {
            // Move to-move to move-lower
            const target = document.getElementById('to-move');
            // Change position to static so that it can be appended to move-lower
            // target.style.position = "static";
            document.getElementById('move-lower').appendChild(target)
            document.getElementById('training').classList.add("lower-class")
            document.getElementById('top-recent-and-next-2').classList.add("lower-class")
            // document.getElementById('training').style.position = "static";
            // document.getElementById('top-recent-and-next-2').style.position = "static";
        }
    } else {
        if (document.getElementById('training').classList.contains("lower-class")) {
            // Move to-move to move-upper
            const target = document.getElementById('to-move');
            // Change position to relative so that it can be appended to move-upper
            // target.style.position = "relative";
            document.getElementById('move-upper').appendChild(target)
            document.getElementById('training').classList.remove("lower-class")
            document.getElementById('top-recent-and-next-2').classList.remove("lower-class")

            // document.getElementById('training').style.position = "absolute";
            // document.getElementById('top-recent-and-next-2').style.position = "absolute";
        }
    }
}

// On resize, check to see if the window is large enough to show the details section
window.addEventListener("resize", function() {
    resizeFunction();
});

resizeFunction();


// First add add support for toggling the button to show and hide show details
const infoButton = document.querySelector("#info");
const infoSVG = document.querySelector("#info-img");
const infoButton2 = document.querySelector("#info-2");
const infoSVG2 = document.querySelector("#info-img-2");

function toggleButton(show) {
    if (show) {
        const show_details_body = document.querySelector("#show-details-body");
        collapseSection(show_details_body);
        // document.querySelector("#show-details-body").style.display = "none";
        infoSVG.setAttribute("src", "/info.svg");
        infoSVG2.setAttribute("src", "/info.svg");
        if (window.location.pathname == '/') {
            document.querySelector("#tutorial-info-svg").setAttribute("src", "/info.svg");
        }
        store('show_details', false)
        return false
    } else {
        const show_details_body = document.querySelector("#show-details-body");
        expandSection(show_details_body);
        // document.querySelector("#show-details-body").style.display = "block";
        infoSVG.setAttribute("src", "/info-filled.svg")
        infoSVG2.setAttribute("src", "/info-filled.svg")
        if (window.location.pathname == '/') {
            document.querySelector("#tutorial-info-svg").setAttribute("src", "/info-filled.svg");
        }
        store('show_details', true)
        return true
    }
}


// This is the important part!
function collapseSection(element) {
    // get the height of the element's inner content, regardless of its actual size
    console.log("Scroll height:" + element.scrollHeight)
    var sectionHeight = element.scrollHeight;
    console.log("in")

    // temporarily disable all css transitions
    var elementTransition = element.style.transition;
    element.style.transition = '';

    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we 
    // aren't transitioning out of 'auto'
    requestAnimationFrame(function () {
        element.style.height = sectionHeight + 'px';
        element.style.transition = elementTransition;

        // on the next frame (as soon as the previous style change has taken effect),
        // have the element transition to height: 0
        requestAnimationFrame(function () {
            element.style.height = 0 + 'px';
        });
    });

    element.style.height = 0 + 'px';


    // mark the section as "currently collapsed"
    // element.setAttribute('data-collapsed', 'true');
}

function expandSection(element) {
    // get the height of the element's inner content, regardless of its actual size
    var sectionHeight = element.scrollHeight;
    console.log("Scroll height:" + sectionHeight)
    console.log("out")

    // have the element transition to the height of its inner content
    element.style.height = sectionHeight + 'px';
    // element.setAttribute('style', 'min-height: ' + sectionHeight + 'px !important');

    // when the next css transition finishes (which should be the one we just triggered)
    element.addEventListener('transitionend', function (e) {
        // remove this event listener so it only gets triggered once
        element.removeEventListener('transitionend', arguments.callee);

        // remove "height" from the element's inline styles, so it can return to its initial value
        element.style.height = null;
    });

    // mark the section as "currently not collapsed"
    // element.setAttribute('data-collapsed', 'false');
}


try {
    show_tracks = store.get("show_tracks");
    if (show_tracks === null) {
        show_tracks = false
    }
    show_details = store.get("show_details");
    if (show_details === null) {
        if(show_tracks == true) {
            show_details = true
            store('show_details', true)
        } else {
            show_details = false
        }
    }
} catch {
    console.log("no show details")
    show_details = true
    show_tracks = false
}

if (window.location.pathname == '/') {
    console.log("in home page:" + show_details)
    console.log(show_details)
    if (!show_details) {
        document.getElementById("show-details-body").style.height = "0px";
        infoSVG.setAttribute("src", "/info.svg");
        infoSVG2.setAttribute("src", "/info.svg");
        document.querySelector("#tutorial-info-svg").setAttribute("src", "/info.svg")
    }
    if (show_tracks) {
        document.getElementById("training").style.display = "none";
        document.getElementById("top-recent-and-next-2").style.display = "block";
    }

    // Add support for toggling detailed show info using tutorial-show-details button
    const tutorial_show_details = document.getElementById('tutorial-show-details');
    tutorial_show_details.addEventListener('click', () => {
        show_details = toggleButton(show_details);
    });

    // Add support for toggling the button to show and hide show tracks
    const complete_tutorial_button = document.getElementById('complete-tutorial');
    // Start fade out animation and once complete, set display to none
    complete_tutorial_button.addEventListener('click', () => {
        document.getElementById('training').style.animation = 'fade-out 0.4s';
        setTimeout(() => {
            document.getElementById('training').style.display = 'none';
        }, 400);
        document.getElementById("top-recent-and-next-2").style.display = "block";
        document.getElementById("top-recent-and-next-2").style.animation = "fade-in 0.4s";
        store('show_tracks', true)
    });

    const close_tracks = document.getElementById('close-tracks');
    close_tracks.addEventListener('click', () => {
        document.getElementById('top-recent-and-next-2').style.animation = 'fade-out 0.4s';
        setTimeout(() => {
            document.getElementById('top-recent-and-next-2').style.display = 'none';
        }, 400);
        document.getElementById("training").style.display = "block";
        document.getElementById("training").style.animation = "fade-in 0.4s";
        store('show_tracks', false)
    });
} else {
    show_details = false;
    document.getElementById("show-details-body").style.height = "0px";
    infoSVG.setAttribute("src", "/info.svg");
    infoSVG2.setAttribute("src", "/info.svg");
}


infoButton.addEventListener("click", () => {
    show_details = toggleButton(show_details);
});

infoButton2.addEventListener("click", () => {
    show_details = toggleButton(show_details);
});
