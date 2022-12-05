var playPauseBtn = document.getElementById('play-pause');
// Add second play button for mobile
var playPauseBtnMobile = document.getElementById('play-pause-mobile');

// Add event listener to play/pause button
playPauseBtn.addEventListener('click', playPauseOnClick);
playPauseBtnMobile.addEventListener('click', playPauseOnClick);

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
}


function pauseUpdate() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('pause').style.display = 'none';
    document.getElementById('play').style.display = 'block';
    document.getElementById('play-mobile').style.display = 'block';
    document.getElementById('pause-mobile').style.display = 'none';
    document.getElementById('loader-mobile').style.display = 'none';
    document.title = 'KSCU 103.3 FM'
}

var sound = new Howl({
    src: 'https://kscu.streamguys1.com/live',
    format: ['aac', 'mp3'],
    autoplay: false,
    pool: 0,
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
