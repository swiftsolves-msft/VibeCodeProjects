let player;
let isPlayerInitialized = false;
const toggleMusicButton = document.getElementById('toggleMusic');

// Disable button by default
toggleMusicButton.disabled = true;
toggleMusicButton.textContent = 'Loading Music...';

// Load YouTube IFrame API dynamically
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
tag.onerror = () => {
    console.error('Failed to load YouTube IFrame API');
    toggleMusicButton.textContent = 'Music Unavailable';
    toggleMusicButton.disabled = true;
};
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Player initialization
window.onYouTubeIframeAPIReady = function() {
    try {
        const randomIndex = Math.floor(Math.random() * 50);
        player = new YT.Player('player', {
            height: '0',
            width: '0',
            playerVars: {
                listType: 'playlist',
                list: 'PL7F6D4CF68C76189A',
                autoplay: 0, // Start paused
                controls: 0,
                loop: 1,
                shuffle: 1,
                index: randomIndex,
            },
            events: {
                'onReady': onPlayerReady,
                'onError': onPlayerError,
            },
        });
    } catch (error) {
        console.error('Error initializing YouTube player:', error);
        toggleMusicButton.textContent = 'Music Unavailable';
        toggleMusicButton.disabled = true;
    }
};

function onPlayerReady(event) {
    isPlayerInitialized = true;
    toggleMusicButton.disabled = false;
    toggleMusicButton.textContent = 'Play Music';
    toggleMusicButton.classList.add('bg-red-600', 'hover:bg-red-700');
}

function onPlayerError(event) {
    console.error('YouTube player error:', event.data);
    toggleMusicButton.textContent = 'Music Unavailable';
    toggleMusicButton.disabled = true;
}

// Toggle music
toggleMusicButton.addEventListener('click', function() {
    if (!isPlayerInitialized || !player || typeof player.getPlayerState !== 'function') {
        console.error('Player not initialized');
        this.textContent = 'Music Unavailable';
        this.disabled = true;
        return;
    }

    const playerState = player.getPlayerState();
    if (playerState === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        this.classList.remove('bg-green-600', 'hover:bg-green-700');
        this.classList.add('bg-red-600', 'hover:bg-red-700');
        this.textContent = 'Play Music';
    } else {
        player.playVideo();
        this.classList.remove('bg-red-600', 'hover:bg-red-700');
        this.classList.add('bg-green-600', 'hover:bg-green-700');
        this.textContent = 'Pause Music';
    }
});

// Fallback for initialization failure
setTimeout(() => {
    if (!isPlayerInitialized) {
        console.error('YouTube player failed to initialize within 10 seconds');
        toggleMusicButton.textContent = 'Music Unavailable';
        toggleMusicButton.disabled = true;
    }
}, 10000);