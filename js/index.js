{
    const API_URL = 'http://localhost:3024/';

    let dataMusic = [];
    let playlist = [];

    const favoriteList = localStorage.getItem('favorite')
        ? JSON.parse(localStorage.getItem('favorite'))
        : [];

    const audio = new Audio();
    const headerLogo = document.querySelector('.header__logo');
    const favoriteBtn = document.querySelector('.header__favorite-btn');

    const catalogContainer = document.querySelector('.catalog__container');
    const tracksCard = document.getElementsByClassName('track');

    const player = document.querySelector('.player');
    const trackTitle = document.querySelector('.track-info__title');
    const trackArtist = document.querySelector('.track-info__artist');
    const pauseBtn = document.querySelector('.player__controller-pause');
    const stopBtn = document.querySelector('.player__controller-stop');
    const prevBtn = document.querySelector('.player__controller-prev');
    const nextBtn = document.querySelector('.player__controller-next');
    const likeBtn = document.querySelector('.player__controller-like');
    const muteBtn = document.querySelector('.player__controller-mute');
    const playerProgressInput = document.querySelector('.player__progress-input');
    const playerTimePassed = document.querySelector('.player__time-passed');
    const playerTimeTotal = document.querySelector('.player__time-total');
    const playerVolumeInput = document.querySelector('.player__volume-input');

    const search = document.querySelector('.search');

    const pausePlayer = () => {
        const trackActive = document.querySelector('.track_active');

        if (audio.paused) {
            audio.play();
            pauseBtn.classList.remove('player__icon_play');
            trackActive.classList.remove('track_pause');
        } else {
            audio.pause();
            pauseBtn.classList.add('player__icon_play');
            trackActive.classList.add('track_pause');
        }
    }

    const playMusic = (e) => {
        e.preventDefault();
        const trackActive = e.currentTarget;
        if (trackActive.classList.contains('track_active')) {
            pausePlayer();
            return;
        }
        //получаем id 
        let i = 0;
        const id = trackActive.dataset.idTrack;

        const index = favoriteList.indexOf(id);
        if (index !== -1) {
            likeBtn.classList.add('player__icon_like_active');
        } else {
            likeBtn.classList.remove('player__icon_like_active');
        }

        const track = playlist.find((item, index) => {
            i = index;
            return id === item.id;
        });

        audio.src = `${API_URL}${track.mp3}`;
        trackTitle.textContent = track.track;
        trackArtist.textContent = track.artist;

        audio.play();

        pauseBtn.classList.remove('player__icon_play');
        player.classList.add('player_active');
        player.dataset.idTrack = id;

        const prevTrack = i === 0 ? playlist.length - 1 : i - 1;
        const nextTrack = i + 1 === playlist.length ? 0 : i + 1;
        prevBtn.dataset.idTrack = playlist[prevTrack].id;
        nextBtn.dataset.idTrack = playlist[nextTrack].id;
        likeBtn.dataset.idTrack = id;

        for (let i = 0; i < tracksCard.length; i++) {
            if (id === tracksCard[i].dataset.idTrack) {
                tracksCard[i].classList.add('track_active');
            } else {
                tracksCard[i].classList.remove('track_active');
            }
        }
    };

    const addHandlerTrack = () => {
        for (let i = 0; i < tracksCard.length; i++) {
            tracksCard[i].addEventListener('click', playMusic);
        }
    };

    const createCard = (data) => {
        const card = document.createElement('a');
        card.href = '#';
        card.classList.add('catalog__item', 'track');
        if (player.dataset.idTrack === data.id) {
            card.classList.add('track_active');
            if (audio.paused) {
                card.classList.add('track_pause');
            }
        }
        //создание data-idTrack = data.id
        card.dataset.idTrack = data.id;
        card.innerHTML = `
            <div class="track__img-wrap">
                <img
                    class="track__poster"
                    src="${API_URL}${data.poster}"
                    alt="${data.artist}-${data.track}"
                    width="180"
                    height="180"
                />
            </div>
            <div class="track__info track-info">
                <p class="track-info__title">${data.track}</p>
                <p class="track-info__artist">${data.artist}</p>
            </div>
        `;

        return card;
    };

    const renderCatalog = (dataList) => {
        playlist = [...dataList];
        if (!playlist.length) {
            catalogContainer.innerHTML = `
             <div>По данному запросу ничего не найдено</div>
            `;
            return
        }
        catalogContainer.textContent = '';

        const listCards = dataList.map(createCard);
        catalogContainer.append(...listCards);

        addHandlerTrack();

        const catalogAddBtn = createCatalogBtn();
        checkCount(catalogAddBtn);

    };

    //ф-я для проверки кол-ва карточек для отображения
    const checkCount = (catalogAddBtn, i = 1) => {
        if (catalogContainer.clientHeight > tracksCard[0].clientHeight * 3) {
            tracksCard[tracksCard.length - i].style.display = 'none';
            return checkCount(catalogAddBtn, i + 1);
        }

        if (i !== 1) {
            catalogContainer.append(catalogAddBtn);
        }
    };

    //ф-я для обновления данных в момент когда произошло изменение текущей позиции воспроизведения на новое значение
    const updateTime = () => {
        //получение текущего времени в мс
        const currentTime = audio.currentTime;
        //получение общего времени в мс
        const duration = audio.duration;
        //получение текущего времени, playerProgressInput.max - max знач-е указано в input 
        const progress = (currentTime / duration) * playerProgressInput.max;
        //знач-ю input присвоить текущее время в %
        playerProgressInput.value = progress ? progress : 0;

        //вывод тек времени (сколько минут прошло)
        const minutesPassed = Math.floor(currentTime / 60) || '0';
        const secondsPassed = Math.floor(currentTime % 60) || '00';

        //вывод общего времени 
        const minuteDuration = Math.floor(duration / 60) || '0';
        const secondsDuration = Math.floor(duration % 60) || '00';

        playerTimePassed.textContent = `${minutesPassed}:${secondsPassed < 10 ? '0' + secondsPassed : secondsPassed}`;
        playerTimeTotal.textContent = `${minuteDuration}:${secondsDuration < 10 ? '0' + secondsDuration : secondsDuration}`;
    }

    const createCatalogBtn = () => {
        const catalogAddBtn = document.createElement('button');
        catalogAddBtn.classList.add('catalog__btn-add');
        catalogAddBtn.innerHTML = `
            <span>Увидеть все</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>
            </svg>
        `;
        // при клике на "увидеть все" появляются оставшиеся карточки
        catalogAddBtn.addEventListener('click', () => {
            [...tracksCard].forEach((trackCard) => {
                trackCard.style.display = '';
                catalogAddBtn.remove();
            });
        });

        return catalogAddBtn;
    }

    const addEventListener = () => {

        prevBtn.addEventListener('click', playMusic);
        nextBtn.addEventListener('click', playMusic);

        //аудио доходит до конца и вкл следующую песню
        audio.addEventListener('ended', () => {
            //создается свой Event по клику, как будто бы мы нажали на кнопку next
            nextBtn.dispatchEvent(new Event('click', { bubbles: true }));
        })

        //timeupdate-событие в момент, когда произошло изменение текущей позиции воспроизведения на новое значение
        audio.addEventListener('timeupdate', updateTime);

        //событие при перемещении бегунка
        playerProgressInput.addEventListener('change', () => {
            //тек значение бегунка 
            const progress = playerProgressInput.value;
            //получение тек времени в мс, playerProgressInput.max - max знач-е указано в input
            audio.currentTime = (progress / playerProgressInput.max) * audio.duration;
        });

        //при клике на кнопку сердечко  в хедер, сформируется фаворитный список песен, на к-ых стоит лайк 
        favoriteBtn.addEventListener('click', () => {
            //в data попадут лишь те данные, id которых хранится в localStorage
            const data = dataMusic.filter((item) => favoriteList.includes(item.id));
            renderCatalog(data);

        })

        headerLogo.addEventListener('click', () => {
            renderCatalog(dataMusic);

        })

        likeBtn.addEventListener('click', () => {
            const index = favoriteList.indexOf(likeBtn.dataset.idTrack);
            if (index === -1) {
                favoriteList.push(likeBtn.dataset.idTrack);
                likeBtn.classList.add('player__icon_like_active');
            } else {
                favoriteList.splice(index, 1);
                likeBtn.classList.remove('player__icon_like_active');
            }

            localStorage.setItem('favorite', JSON.stringify(favoriteList));
        })

        //изменение звука, передвигая бегунок со звуком
        playerVolumeInput.addEventListener('input', () => {
            const value = playerVolumeInput.value;
            audio.volume = value / 100;
        })

        //при клике убирается звук, меняется иконка, бегунок меняется и наоборот 
        muteBtn.addEventListener('click', () => {
            if (audio.volume) {
                localStorage.setItem('volume', audio.volume);
                audio.volume = 0;
                muteBtn.classList.add('player__icon_mute-off');
                playerVolumeInput.value = 0;
            } else {
                audio.volume = localStorage.getItem('volume');
                muteBtn.classList.remove('player__icon_mute-off');
                playerVolumeInput.value = audio.volume * 100;
            }
        });

        pauseBtn.addEventListener('click', pausePlayer);

        stopBtn.addEventListener('click', () => {
            audio.src = '';
            player.classList.remove('player_active');
            document.querySelector('.track_active').classList.remove('track_active');
        });

        search.addEventListener('submit', async (e) => {
            e.preventDefault();
            // запрос на сервер 
            fetch(`${API_URL}api/music?search=${search.search.value}`)
                .then((data) => data.json())
                .then(renderCatalog)
        })
    }

    const init = () => {

        audio.volume = localStorage.getItem('volume') || 1;
        playerVolumeInput.value = audio.volume * 100;

        // запрос на сервер 
        fetch(`${API_URL}api/music`)
            .then((data) => data.json())
            .then(renderCatalog)
            .finally(addEventListener);
    };

    init();
}