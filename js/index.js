

const audio = new Audio();
const tracksCard = document.querySelectorAll('.track');
//const tracksCard = document.getElementsByClassName('track');
const player = document.querySelector('.player');
const pauseBtn = document.querySelector('.player__controller-pause');
const stopBtn = document.querySelector('.player__controller-stop');

const playMusic = (e) => {
    const trackActive = e.currentTarget;
    audio.src = trackActive.dataset.track;
    audio.play();
    pauseBtn.classList.remove('player__icon_play');
    player.classList.add('player_active');

    tracksCard.forEach(track => {
        track.classList.remove('track_active');
    });

    trackActive.classList.add('track_active');

};

tracksCard.forEach(track => {
    track.addEventListener('click', playMusic);
});

/* for (let i = 0; i < tracksCard.length; i++) {
    tracksCard[i].addEventListener('click', playMusic);
} */


pauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        pauseBtn.classList.remove('player__icon_play');
    } else {
        audio.pause();
        pauseBtn.classList.add('player__icon_play');
    }
});

stopBtn.addEventListener('click', () => {
    audio.pause();
    player.classList.remove('player_active');
})