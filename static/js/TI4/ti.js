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

    // Change gamestate text and position (since a different text length changes its position)
    document.getElementById("gamestate-text").textContent = "PEACE ESTABLISHED";
    document.getElementById("gamestate-text").style.color = "rgba(0, 255, 0, 1)";
    document.getElementById("gamestate-text").style.right = "5%";

    // Change Background
    document.getElementById("background-video-source").src = backgroundSrcPeace;
    document.getElementById("background-video").load();

    // Change Visualizer and text
    visualizerBarColor = "rgba(0, 0, 255, 0.6)";
    document.getElementById("visualizer-text").style.color = "rgba(0, 0, 220, 1)";

    // Change news feed color and text
    document.getElementById("news-bar").style.backgroundColor = "rgba(0, 0, 255, 0.3)";
    newsHeadlines.textContent = peaceHeadlines;

    // Change leaderboard colors
    document.getElementById("objectives-table").style.backgroundColor = "rgba(0, 0, 255, 0.3)";
    document.getElementById("objectives-table").style.border = "2px solid rgba(0, 0, 255, 0.5)";
    objectivesTableRowBorder = "2px solid rgba(0, 0, 255, 0.4)"; // Border needs to be changed using a global var in the ti.html script because changing multiple elements dynamically using JS doesn't work for some reason???*

    document.getElementById("players-table").style.border = "2px solid rgba(0, 0, 255, 0.5)";
    document.getElementById("players-table").style.backgroundColor = "rgba(0, 0, 255, 0.3)";

    document.getElementById("agendas-table").style.backgroundColor = "rgba(0, 0, 255, 0.3)";
    document.getElementById("agendas-table").style.border = "2px solid rgba(0, 0, 255, 0.5)";

    // Change videos to peace videos
    currentVideos = peaceVideos;
    shuffledVideoPlaylist = shuffle(currentVideos); 
    playNextVideo();

    // Music change is handled in the admin panel, since it requires creds to call the music override
}

function changeToWar() {
    // Change "No signal" gif to another one
    document.getElementById("no-signal-gif").src = warNoSignalUrl;

    // Change gamestate text and its position (since the text length is different, its position changes)
    document.getElementById("gamestate-text").textContent = "PEACE BROKEN";
    document.getElementById("gamestate-text").style.color = "rgba(255, 0, 0, 1)";
    document.getElementById("gamestate-text").style.right = "11%";

    // Change Background
    document.getElementById("background-video-source").src = backgroundSrcWar;
    document.getElementById("background-video").load();

    // Change Visualizer and text
    visualizerBarColor = "rgba(255, 0, 0, 1)";
    document.getElementById("visualizer-text").style.color = "rgba(255, 0, 0, 1)";

    // Change news feed color and text
    document.getElementById("news-bar").style.backgroundColor = "rgba(255, 0, 0, 0.7)";
    newsHeadlines.textContent = warHeadlines;

    // Change leaderboard colors
    document.getElementById("objectives-table").style.backgroundColor = "rgba(255, 0, 0, 0.8)";
    document.getElementById("objectives-table").style.border = "2px solid rgba(255, 0, 0, 1)";
    objectivesTableRowBorder = "2px solid rgba(255, 0, 0, 1)"; // Border needs to be changed using a global var in the ti.html script because changing multiple elements dynamically using JS doesn't work for some reason???*

    document.getElementById("players-table").style.backgroundColor = "rgba(255, 0, 0, 0.7)";
    document.getElementById("players-table").style.border = "2px solid rgba(255, 0, 0, 1)";

    document.getElementById("agendas-table").style.backgroundColor = "rgba(255, 0, 0, 0.7)";
    document.getElementById("agendas-table").style.border = "2px solid rgba(255, 0, 0, 1)";

    // Change videos to war videos
    currentVideos = warVideos;
    shuffledVideoPlaylist = shuffle(currentVideos); 
    playNextVideo();

    // Music change is handled in the admin panel, since it requires creds to call the music override
}

function enterAgendaPhase() {
    agendaPhaseOverlay = document.getElementById("agendaPhaseOverlay");
    agendaPhaseOverlay.style.display = "block";
}

function exitAgendaPhase() {
    agendaPhaseOverlay = document.getElementById("agendaPhaseOverlay");
    agendaPhaseOverlay.style.display = "none";
}

async function checkGameState() {
    const intervalId = setInterval(async () => {
        //console.log("Checking");
        //const gamedata = await loadJsonFile(gamedataFileUrl);
        
        // ONLY change gamestate if its different from the current game state
        if (gamedata.gameState !== currentGamestate) {
            if (gamedata && gamedata.gameState === "War") {
                changeToWar();
                currentGamestate = gamedata.gameState;
                gameState = currentGamestate; // Global var in the HTML page
            } else if (gamedata && gamedata.gameState === "Peace") { // Just in case that for whatever reason, the game goes back to being peaceful.
                changeToPeace();
                currentGamestate = gamedata.gameState;
                gameState = currentGamestate;
            }
        } 

        // Check if agenda phase is active
        if (gamedata.agendaPhase === true) {
            enterAgendaPhase();
        } else if (gamedata.agendaPhase === false) {
            exitAgendaPhase();
        }
    }, 5000); 
}


let currentGamestate = "Peace";
checkGameState();