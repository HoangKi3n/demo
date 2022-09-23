const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [

        {
            "id": 1,
            "name": "Reality",
            "singer": "Lost Frequencies",
            "img": "./assets/img/img1.jpg",
            "music": "./assets/music/assets_music_song1.mp3"
        },
        {
            "id": 2,
            "name": "You Don't Know Me",
            "singer": "Brodie Barclay",
            "img": "./assets/img/img2.jpg",
            "music": "./assets/music/assets_music_song2.mp3"
        },
        {
            "id": 3,
            "name": "Endless Love",
            "singer": "Diana Ross",
            "img": "./assets/img/img3.jpg",
            "music": "./assets/music/assets_music_song3.mp3"
        },
        {
            "id": 4,
            "name": "Illusionary Daytime",
            "singer": "Shirfine",
            "img": "./assets/img/img4.jpg",
            "music": "./assets/music/assets_music_song4.mp3"
        },
        {
            "id": 5,
            "name": "Cause I love you",
            "singer": "Noo Phuoc Thinh",
            "img": "./assets/img/img5.jpg",
            "music": "./assets/music/assets_music_song5.mp3"
        },
        {
            "id": 6,
            "name": "Lệ Tình",
            "singer": "Instrumental",
            "img": "./assets/img/img6.jpg",
            "music": "./assets/music/assets_music_song6.mp3"
        },
        {
            "id": 7,
            "name": "1 3 5",
            "singer": "Alan Walker",
            "img": "./assets/img/img7.jpg",
            "music": "./assets/music/assets_music_song7.mp3"
        },
        {
            "id": 8,
            "name": "Legendary",
            "singer": "Amadeus",
            "img": "./assets/img/img8.jpg",
            "music": "./assets/music/assets_music_song8.mp3"
        },
        {
            "id": 9,
            "name": "Horizon",
            "singer": "Janji",
            "img": "./assets/img/img9.jpg",
            "music": "./assets/music/assets_music_song9.mp3"
        },
        {
            "id": 10,
            "name": "Ignite",
            "singer": "Alan Walker",
            "img": "./assets/img/img10.jpg",
            "music": "./assets/music/assets_music_song10.mp3"
        },
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                             
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.img}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth
            // Xử lý cd quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //Thời gian quay
            iterations: Infinity //Số lần lặp
        })
        cdThumbAnimate.pause();
        // Xử lý phóng to thu nhỏ CD
        document.onscroll = function() {
                const scrollTop = window.scrollY || document.documentElement.scrollTop
                const newCdWidth = cdWidth - scrollTop;


                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
                cd.style.opacity = newCdWidth / cdWidth;


            }
            // Xử lý khi click play
        playBtn.onclick = function() {

                if (_this.isPlaying) {
                    audio.pause();
                } else {
                    audio.play();
                }
            }
            // Khi song đc play
        audio.onplay = function() {
                _this.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }
            // Khi song bị pause
        audio.onpause = function() {
                _this.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            }
            // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value = progressPercent;
                }
            }
            // Xử lý khi tua
        progress.onchange = function(e) {
                const seekTime = audio.duration / 100 * e.target.value;
                audio.currentTime = seekTime;

            }
            // Khi next song
        nextBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong();
                } else {

                    _this.nextSong();
                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }
            // Khi prev song
        prevBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong();
                } else {

                    _this.prevSong();
                }
                audio.play();
                _this.render();
                _this.scrollToActiveSong();


            }
            // Xử lý bật / tắt random
        randomBtn.onclick = function(e) {
                _this.isRandom = !_this.isRandom;
                randomBtn.classList.toggle('active', _this.isRandom);

            }
            // Xử lý lặp lại một song
        repeatBtn.onclick = function() {
                _this.isRepeat = !_this.isRepeat;
                repeatBtn.classList.toggle('active', _this.repeatBtn);
            }
            // Xử lý next song khi audio ended
        audio.onended = function() {
                if (_this.isRepeat) {
                    audio.play();
                } else {

                    nextBtn.click();
                }
            }
            // lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                // Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadcurrentSong()
                    _this.render()
                    audio.play();
                }
            }
        }
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest'
            })
        }, 200)
    },

    loadcurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.music

    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadcurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadcurrentSong();
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)

        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadcurrentSong();
    },
    start: function() {
        // Định nghĩa các thuộc tính cho Object
        this.defineProperties();
        //Lắng nghe / xử lý các sự kiện
        this.handleEvents();
        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadcurrentSong();
        // Render playlist
        this.render()
    }
}
app.start();