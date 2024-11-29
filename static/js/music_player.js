// Function to shuffle an array (Fisher-Yates Shuffle)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function setupAudioVisualizer(audioElementId, canvasElementId) {
    var audio = document.getElementById(audioElementId);
    var canvas = document.getElementById(canvasElementId);
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = audioContext.createAnalyser();
    var ctx = canvas.getContext('2d');
    var source = audioContext.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    var minBarHeight = 3;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        var barWidth = (canvas.width / bufferLength) * 1.5;
        var barHeight;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 3;
            barHeight = Math.max(barHeight, minBarHeight); // Set minimum bar height
            ctx.fillStyle = visualizerBarColor; // Use the hard-coded color
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
        requestAnimationFrame(draw);
    }

    draw(); // Start the visualizer loop
}

function getFileName(url) {
    const decodedUrl = decodeURIComponent(url);
    const fileNameWithExtension = decodedUrl.substring(decodedUrl.lastIndexOf('/') + 1);
    const lastDotIndex = fileNameWithExtension.lastIndexOf('.');
    return lastDotIndex !== -1 ? fileNameWithExtension.substring(0, lastDotIndex) : fileNameWithExtension;
}

async function fetchMusicData() {
    try {
        const response = await fetch(musicFileUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json(); // Return the entire data object
    } catch (error) {
        console.error('Error fetching music file:', error);
    }
}

async function postCurrentlyPlaying(songId, currentTime, maxTime) {
    try {
        const response = await fetch(musicUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currentlyPlaying: {
                    songId: songId,
                    currentTime: currentTime,
                    maxTime: maxTime
                }
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} ${response.body}`);
        }
        //console.log(`Successfully posted current time: ${currentTime}`);
    } catch (error) {
        console.error('Error posting current time:', error);
    }
}

async function fadeOut(audio, duration = 1000) {
    const step = 0.05;
    const interval = duration / (audio.volume / step);

    while (audio.volume > 0) {
        audio.volume = Math.max(audio.volume - step, 0);
        await new Promise(resolve => setTimeout(resolve, interval));
    }
    audio.pause(); // Pause the audio once volume reaches zero
}

window.onload = function () {
    var audio = document.getElementById('visualizer-sound');
    setupAudioVisualizer('visualizer-sound', 'visualizer');
    audio.volume = 0.3;

    // Variables to keep track of the currently playing song
    let currentSongUrl = '';
    let currentSongId = ''; // Keep track of the current song ID

    // Function to check the currently playing song
    async function checkCurrentSong() {
        try {
            const musicData = await fetchMusicData();
            const currentlyPlayingId = musicData.override; // Fetch the override song ID from the music json file
            const newSongData = musicData.available[currentlyPlayingId]; // Get the song details by ID

            if (newSongData && newSongData.song !== currentSongUrl) {
                await fadeOut(audio);
                currentSongUrl = newSongData.song; // Update the current song URL
                currentSongId = currentlyPlayingId; // Update the current song ID
                audio.src = currentSongUrl; // Set the new song URL
                audio.volume = 0.3;
                const visualizer_text = document.getElementById('visualizer-text');
                // If song name is too long
                newSongName = getFileName(currentSongUrl) 
                if (newSongName.length > 44) {
                    newSongName = newSongName.slice(0, 44) + "...";
                }
                visualizer_text.textContent = newSongName; // Update the visualizer text
                console.log("Now playing:", getFileName(currentSongUrl)); // Log the currently playing song
                await audio.play(); // Play the new song
                await postCurrentlyPlaying(currentSongId); // POST the current song ID
                await postOverride(); // Reset the music override value
            }
        } catch (error) {
            console.error(`Error checking current song because: ${error}`)
        }
    }

    // Function to clear the music override after its detected
    async function postOverride() {
    try {
        const response = await fetch(musicUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                override: ""
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        //console.log('Successfully posted override with empty string');
    } catch (error) {
        console.error('Error posting override:', error);
    }
}

    // Function to play a random song based on gameState
    async function playRandomGameStateSong() {
        const musicData = await fetchMusicData();
        const availableSongs = musicData.available;

        // Filter song IDs that contain the gameState in their file name
        const filteredSongIds = Object.keys(availableSongs).filter(songId =>
            availableSongs[songId].song.includes(gameState)
        );

        if (filteredSongIds.length > 0) {
            // Select a random song ID from the filtered results
            const randomSongId = shuffle(filteredSongIds)[0];
            currentSongId = randomSongId
            const randomSongData = availableSongs[randomSongId]; // Get the song data using the ID

            audio.src = randomSongData.song; // Set the new random song URL
            const visualizer_text = document.getElementById('visualizer-text');
            // If song name is too long
            newSongName = getFileName(randomSongData.song) 
            if (newSongName.length > 44) {
                newSongName = newSongName.slice(0, 44) + "...";
            }
            visualizer_text.textContent = newSongName; // Update the visualizer text
            console.log("Now playing random:", getFileName(randomSongData.song)); // Log the randomly playing song
            await audio.play(); // Play the random song
            currentTime = Math.round(audio.currentTime);
            maxTime = Math.round(audio.maxTime);
            currentSongUrl = randomSongData.song;
            await postCurrentlyPlaying(randomSongId, currentTime, maxTime); // Use the song ID from the filtered IDs
        } else {
            console.log("No available songs match the game state.");
        }
    }

    // Function to send current audio time every second
    setInterval(() => {
        const currentTime = Math.round(audio.currentTime);
        const maxTime = Math.round(audio.duration) || 0;
        if (currentSongId && !isNaN(currentTime)) {
            postCurrentlyPlaying(currentSongId, currentTime, maxTime);
        }
    }, 1000); // Send every second

    // Continuously check the music.json file 
    setInterval(checkCurrentSong, 3000);

    // Check the song initially
    playRandomGameStateSong();

    // Add an event listener to handle track end
    audio.addEventListener('ended', playRandomGameStateSong);
};