// Get the video element (not the source element)
const rightFrameVideo = document.getElementById('right-frame-video');
var shuffledVideoPlaylist = shuffle(videos); // Shuffle the playlist
var currentVideoTrackIndex = 0;

// Function to shuffle an array (Fisher-Yates Shuffle)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to play the next video
function playVideo() {
    if (currentVideoTrackIndex < shuffledVideoPlaylist.length) {
        // Make video re-appear after being hidden
        rightFrameVideo.style.display = 'block';

        // Update the video source
        rightFrameVideo.src = shuffledVideoPlaylist[currentVideoTrackIndex];
        console.log("Now Playing Video:", shuffledVideoPlaylist[currentVideoTrackIndex]);

        // Load and play the new video
        rightFrameVideo.load();
        rightFrameVideo.play();

        currentVideoTrackIndex++;
    } else {
        // Reset and shuffle again if all tracks have been played
        console.log("Video playlist re-shuffled")
        currentVideoTrackIndex = 0;
        shuffledVideoPlaylist = shuffle(videos); // Corrected: use videos instead of playlist
        playNextVideo();
    }
}

function playNextVideo() {
    // Hide video after its finished playing
    rightFrameVideo.style.display = 'none';

    // Generate random delay between videos (max - min + 1)) + min
    var randomDelay = Math.floor(Math.random() * (11000 - 2000 + 1)) + 2000;
    setTimeout(playVideo, randomDelay);
}

// Add an event listener to play the next video when the current video ends
rightFrameVideo.addEventListener('ended', playNextVideo);

// Start playing the first track
playVideo();
