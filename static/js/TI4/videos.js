// Get the video element (not the source element)
const rightFrameVideo = document.getElementById('right-frame-video');
const rightFrameFilter = document.getElementById('right-frame-filter');
const rightFrameFilterVideoInfo = document.getElementById('right-frame-filter-video-info');
var shuffledVideoPlaylist = shuffle(currentVideos); // Shuffle the playlist
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
        rightFrameFilter.style.display = 'block';

        // Update the video source
        rightFrameVideo.src = shuffledVideoPlaylist[currentVideoTrackIndex];

        // Update the body cam text source if in war mode (checks if the no-signal gif is the war one, instead of the peace one)
        let filename = getFileNameWithoutExtension(shuffledVideoPlaylist[currentVideoTrackIndex]);

        // If the filename is too long, decrease the font size of the info text
        if (filename.length > 40) {
            newScale = (1.5 - Math.floor((filename.length - 40) / 10) * 0.1);
            document.getElementById("right-frame-filter-video-info").style.fontSize = `${newScale}vw`;
        } else {
            document.getElementById("right-frame-filter-video-info").style.fontSize = "1.5vw";
        };

        // Final video info text
        rightFrameFilterVideoInfo.innerHTML = "STARDATE" + " " + getRandomNumber(2222, 99999) + "-" + getRandomNumber(1, 99) + " -0500<br>" + filename + " " + getRandomId();

        console.log("Now Playing Video:", shuffledVideoPlaylist[currentVideoTrackIndex]);

        // Load and play the new video
        rightFrameVideo.load();
        rightFrameVideo.play();

        currentVideoTrackIndex++;
    } else {
        // Reset and shuffle again if all tracks have been played
        console.log("Video playlist re-shuffled")
        currentVideoTrackIndex = 0;
        shuffledVideoPlaylist = shuffle(currentVideos); // Corrected: use videos instead of playlist
        playNextVideo();
    }
}

// Used for flavor text on the right video info text object
function getRandomId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    
    for (let i = 0; i < 9; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    
    return randomString;
}

// Used for flavor text on the right video info text object
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playNextVideo() {
    // Hide video after its finished playing
    rightFrameVideo.style.display = 'none';
    rightFrameFilter.style.display = 'none';

    // Generate random delay between videos (max - min + 1)) + min
    var randomDelay = Math.floor(Math.random() * (11000 - 2000 + 1)) + 2000;
    setTimeout(playVideo, randomDelay);
}

function getFileNameWithoutExtension(filePath) {
    const decodedFilePath = decodeURIComponent(filePath);
    const fileNameWithExtension = decodedFilePath.split('/').pop(); // Get the last part of the path
    const fileName = fileNameWithExtension.split('.').slice(0, -1).join('.'); // Remove the extension
    return fileName;
}

// Add an event listener to play the next video when the current video ends
rightFrameVideo.addEventListener('ended', playNextVideo);

// Start playing the first track
playVideo();
