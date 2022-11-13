
var playPauseBtn = document.getElementById('play-pause');

var sound = new Howl({
    src: 'http://kscu.streamguys1.com:80/live',
    format: ['aac', 'mp3'],
    autoplay: false,
    pool: 0,
    // preload: false,
    // html5: true
    // html5: true
});

playPauseBtn.addEventListener('click', () =>{
    if (sound.playing()) {
        sound.pause();
        document.getElementById('play').style.display = 'block';
        document.getElementById('pause').style.display = 'none';
        // playPauseBtn.innerHTML = 'Play';
    } else {
        if (sound.state() === 'loaded') {
            sound.play();
            document.getElementById('play').style.display = 'none';
            document.getElementById('pause').style.display = 'block';
            return
        }

        sound.load();
        if (sound.state() === 'loading') {
            document.getElementById('play').style.display = 'none';
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