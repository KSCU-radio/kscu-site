
var playPauseBtn = document.getElementById('play-pause');
// Add second play button for mobile
var playPauseBtnMobile = document.getElementById('play-pause-mobile');


var sound = new Howl({
    src: 'https://kscu.streamguys1.com/live',
    format: ['aac', 'mp3'],
    autoplay: false,
    pool: 0,
    html5: true
});

playPauseBtn.addEventListener('click', () =>{
    if (sound.state() === 'loading') {

        return
    }
    if (sound.playing()) {
        sound.pause();
        document.getElementById('play').style.display = 'block';
        document.getElementById('pause').style.display = 'none';
        document.getElementById('loader').style.display = 'none';
        // playPauseBtn.innerHTML = 'Play';
    } else {
        if (sound.state() === 'loaded') {
            sound.play();
            document.getElementById('play').style.display = 'none';
            document.getElementById('loader').style.display = 'none';
            document.getElementById('pause').style.display = 'block';
            return
        }

        sound.load();
        if (sound.state() === 'loading') {
            document.getElementById('play').style.display = 'none';
            document.getElementById('pause').style.display = 'none';
            document.getElementById('loader').style.display = 'block';
        }
            // Wait until sound is loaded
        sound.once('load', function(){
            sound.play()
            document.getElementById('loader').style.display = 'none';
            document.getElementById('pause').style.display = 'block';
        });
        // If sound is loaded, play it

        // document.getElementById('play').style.display = 'none';
        // document.getElementById('pause').style.display = 'block';
        // playPauseBtn.innerHTML = 'Pause';
    }
});

// Add second play button event listener for mobile
playPauseBtnMobile.addEventListener('click', () => {
    if (sound.playing()) {
        sound.pause();
        document.getElementById('play-mobile').style.display = 'block';
        document.getElementById('pause-mobile').style.display = 'none';
        // playPauseBtn.innerHTML = 'Play';
    } else {
        if (sound.state() === 'loaded') {
            sound.play();
            document.getElementById('play-mobile').style.display = 'none';
            document.getElementById('pause-mobile').style.display = 'block';
            return
        }

        sound.load();
        if (sound.state() === 'loading') {
            document.getElementById('play-mobile').style.display = 'none';
            document.getElementById('loader-mobile').style.display = 'block';
        }
        // Wait until sound is loaded
        sound.once('load', function () {
            sound.play()
            document.getElementById('loader-mobile').style.display = 'none';
            document.getElementById('pause-mobile').style.display = 'block';
        });
        // If sound is loaded, play it

        // document.getElementById('play').style.display = 'none';
        // document.getElementById('pause').style.display = 'block';
        // playPauseBtn.innerHTML = 'Pause';
    }
});

function showValue(newValue) {
    document.getElementById('volume').innerHTML=newValue;
    sound.volume(newValue/100);
}
