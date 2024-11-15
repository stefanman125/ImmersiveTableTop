
async function loadJsonFile(url) {
    try {
        // Add a cache-busting query parameter to the URL
        const cacheBusterUrl = `${url}?t=${new Date().getTime()}`;
        const response = await fetch(cacheBusterUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data; // Return the parsed data directly
    } catch (error) {
        console.error('Error loading JSON file:', error);
    }
}

function changeToPeace() {
    // Change "No signal" gif to another one
    document.getElementById("no-signal-gif").src = peaceNoSignalUrl;

    // Change gamestate text
    document.getElementById("gamestate-text").textContent = "PEACE ESTABLISHED";
    document.getElementById("gamestate-text").style.color = "rgba(0, 255, 0, 1)";

    // Change Background
    document.getElementById("background-video-source").src = backgroundSrcPeace;
    document.getElementById("background-video").load();

    // Change Title
    document.getElementById("title-text").style.color = "rgba(0, 0, 255, 1)";

    // Change Visualizer and text
    visualizerBarColor = "rgba(0, 0, 255, 0.6)";
    document.getElementById("visualizer-text").style.color = "rgba(0, 0, 220, 1)";

    // Change news feed color and text
    document.getElementById("news-bar").style.backgroundColor = "rgba(0, 0, 255, 0.3)";
    newsHeadlines.textContent = peaceHeadlines;

    // Change leaderboard colors
    document.getElementById("objectives-table").style.backgroundColor = "rgba(0, 0, 255, 0.3)";
    document.getElementById("players-table").style.backgroundColor = "rgba(0, 0, 255, 0.3)";

    // Change videos to peace videos
    currentVideos = peaceVideos;
    shuffledVideoPlaylist = shuffle(currentVideos); 
    playNextVideo();

    // Music change is handled in the admin panel, since it requires creds to call the music override
}

function changeToWar() {
    // Change "No signal" gif to another one
    document.getElementById("no-signal-gif").src = warNoSignalUrl;

    // Change gamestate text
    document.getElementById("gamestate-text").textContent = "PEACE BROKEN";
    document.getElementById("gamestate-text").style.color = "rgba(255, 0, 0, 1)";

    // Change Background
    document.getElementById("background-video-source").src = backgroundSrcWar;
    document.getElementById("background-video").load();

    // Change Title
    document.getElementById("title-text").style.color = "rgba(255, 0, 0, 1)";

    // Change Visualizer and text
    visualizerBarColor = "rgba(255, 0, 0, 1)";
    document.getElementById("visualizer-text").style.color = "rgba(255, 0, 0, 1)";

    // Change news feed color and text
    document.getElementById("news-bar").style.backgroundColor = "rgba(255, 0, 0, 0.7)";
    newsHeadlines.textContent = warHeadlines;

    // Change leaderboard colors
    document.getElementById("objectives-table").style.backgroundColor = "rgba(255, 0, 0, 0.7)";
    document.getElementById("players-table").style.backgroundColor = "rgba(255, 0, 0, 0.7)";

    // Change videos to war videos
    currentVideos = warVideos;
    shuffledVideoPlaylist = shuffle(currentVideos); 
    playNextVideo();

    // Music change is handled in the admin panel, since it requires creds to call the music override
}

async function checkGameState() {
    const intervalId = setInterval(async () => {
        const gamedata = await loadJsonFile(gamedataFileUrl);
        
        // Check if gamedata exists and gameState is set to "War"
        if (gamedata.gameState === currentGamestate) {
            return;
        } else if (gamedata && gamedata.gameState === "War") {
            changeToWar();
            currentGamestate = gamedata.gameState;
            gameState = currentGamestate; // Global var in the HTML page
        } else if (gamedata && gamedata.gameState === "Peace") { // Just in case that for whatever reason, the game goes back to being peaceful.
            changeToPeace();
            currentGamestate = gamedata.gameState;
            gameState = currentGamestate;
        }
    }, 5000); 
}

function slideLeft(element){
    element.animation = 'slideLeft 5s ease-in-out';
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function tablesAnimation() {
    while (isTablesAnimationRunning) {
        const leftFrameObjectives = document.getElementById("left-frame-objectives");
        const leftFrameAgendas = document.getElementById('left-frame-agendas');

        // Slide objectives table away
        leftFrameObjectives.style.animation = 'slideLeft 5s ease-in-out';

        // Wait for animation to finish
        await delay(4000); 
        
        // Set permanent position out of frame
        leftFrameObjectives.style.left = "-110%"; 

        // Slide the agendas table in
        leftFrameAgendas.style.animation = 'slideRight 5s ease-in-out';

        // Wait for animation to finish
        await delay(4000); 

        // Set permanent position in frame
        leftFrameAgendas.style.left = "0%";

        // Let the Agenda table stay for a while
        await delay(10000);

        // Slide the agendas table away
        leftFrameAgendas.style.animation = 'slideLeft 5s ease-in-out';

        // Wait for animation to finish
        await delay(4000); 

        // Set permanent position out of frame
        leftFrameAgendas.style.left = "-110%";

        // Slide the objectives table back in
        leftFrameObjectives.style.animation = 'slideRight 5s ease-in-out';

        // Wait for the animation to finish
        await delay(4000);

        // Set permanent position in frame
        leftFrameObjectives.style.left = "0%"; // Set permanent position

        // Let the Objectives table stay for a while
        await delay(10000);
    }
}

async function checkAgendas() {
    const intervalId = setInterval(async () => {
        const agendas = await loadJsonFile(agendasFileUrl);

        try {
            // Check if at least one agenda exists
            if (agendas[0].name && !isTablesAnimationRunning) {
                //console.log("Agenda found");
                isTablesAnimationRunning = true;
                tablesAnimation();
            } else {
                //console.log("Agenda found, but animation is currently running");
            }
        } catch (error) {
            // No Agendas exist, return all tables back to their starting positions
            //console.log("No Agendas currently active")
            isTablesAnimationRunning = false;
        }
    }, 5000);  
}

let isTablesAnimationRunning = false;
let currentGamestate = "Peace";
checkGameState();
checkAgendas();