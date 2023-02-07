var playPauseBtn = document.getElementById('play-pause');
// Add second play button for mobile
var playPauseBtnMobile = document.getElementById('play-pause-mobile');

// Add event listener to play/pause button
playPauseBtn.addEventListener('click', playPauseOnClick);
playPauseBtnMobile.addEventListener('click', playPauseOnClick);
var pageTitle = document.title;

// Play/pause listeners
function playUpdate() {
    
    document.getElementById('loader').style.display = 'none';
    document.getElementById('pause').style.display = 'block';
    document.getElementById('play').style.display = 'none';
    document.getElementById('play-mobile').style.display = 'none';
    document.getElementById('pause-mobile').style.display = 'block';
    document.getElementById('loader-mobile').style.display = 'none';
    data = store.get("recentTracks")
    document.title = data[0]["artist"] + ' - ' + data[0]["song"]
    if ('mediaSession' in navigator) {
        console.log("test")
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
        navigator.mediaSession.setActionHandler('play', function() { sound.play(); });
        navigator.mediaSession.setActionHandler('pause', function() { sound.pause(); });
        navigator.mediaSession.setActionHandler('stop', function() { sound.pause(); });
    }
}


function pauseUpdate() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('pause').style.display = 'none';
    document.getElementById('play').style.display = 'block';
    document.getElementById('play-mobile').style.display = 'block';
    document.getElementById('pause-mobile').style.display = 'none';
    document.getElementById('loader-mobile').style.display = 'none';
    document.title = pageTitle
}

var sound = new Howl({
    src: `https://kscu.streamguys1.com/live?kscu-site=${new Date().getTime()}`,
    xlr: {
        method: 'GET',
        headers: {
            'Range': 'bytes=0-',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-store',
        },
        withCredentials: true,
    },
    format: ['aac', 'mp3'],
    autoplay: false,
    html5: true,
    preload: true,
    onplay: playUpdate,
    onpause: pauseUpdate,
});

function playPauseOnClick() {
    if (sound.state() === 'loading') {
        sound.once('load', function () {
            sound.play()
        });
        return
    }
    if (sound.playing()) {
        sound.pause();
    } else {
        if (sound.state() === 'loaded') {
            sound.play();
            return
        }

        sound.load();
        if (sound.state() === 'loading') {
            document.getElementById('play').style.display = 'none';
            document.getElementById('pause').style.display = 'none';
            document.getElementById('loader').style.display = 'block';
            document.getElementById('play-mobile').style.display = 'none';
            document.getElementById('pause-mobile').style.display = 'none';
            document.getElementById('loader-mobile').style.display = 'block';
        }
        // Wait until sound is loaded
        sound.once('load', function () {
            sound.play()
        });
    }

}

function showValue(newValue) {
    document.getElementById('volume').innerHTML=newValue;
    sound.volume(newValue/100);
}
