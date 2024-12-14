let gamedata;

// Function to fetch file and set gamedata
async function initializeGameData() {
    // Wait for fetchFile to resolve and set gamedata
    gamedata = await fetchFile(gamedataFileUrl);
    const gamestateText = document.getElementById("currentGamestateText");
    const agendaPhaseText = document.getElementById("agendaPhaseText");

    // Set gamestate
    if (gamedata.gameState === "Peace") {
        newGamestate = "War";
        gamestateText.textContent = "Current gamestate: Peace";
    } else if (gamedata.gameState === "War") {
        newGamestate = "Peace";
        gamestateText.textContent = "Current gamestate: War";
    }

    // Set agenda phase state
    if (gamedata.agendaPhase === true) {
        newAgendaPhase = false;
        agendaPhaseText.textContent = "Agenda Phase: True"
    } else if (gamedata.agendaPhase === false) {
        newAgendaPhase = true;
        agendaPhaseText.textContent = "Agenda Phase: False"
    }
}

// Fetch file and initialize game data on page load
initializeGameData();

async function fetchFile(url) {
    // Add a cache-busting query parameter
    const cacheBuster = `cb=${new Date().getTime()}`;
    const urlWithCacheBuster = url.includes('?') ? `${url}&${cacheBuster}` : `${url}?${cacheBuster}`;
    
    try {
        const response = await fetch(urlWithCacheBuster);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading file:', error);
    }
}

async function postJson(url, json) {
    try {
        const response = await fetch(url, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json) 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result.message); // Log success message
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

async function changeGamestate() {
    const areyousure = confirm(`This will change the gamestate to ${newGamestate}.\n\nAre you sure you would like to change the gamestate?`);
    if (areyousure) {
        postJson('/ti/admin/gamedata', { gameState: newGamestate, agendaPhase: gamedata.agendaPhase });
        alert(`Gamestate changed to ${newGamestate}`);
        initializeGameData();
        if (newGamestate === "War") {
            const musicJson = await fetchFile(musicFileUrl);
            let warTransitionSongId; 
            for (const id in musicJson.available) {
                if (musicJson.available[id].song.includes("Mile High Club")) {
                    warTransitionSongId = id;
                    break;
                } // Put any song name here
            }
            console.log(warTransitionSongId);
            postJson('/ti/admin/music', { override: warTransitionSongId }) 
        }
    } else {
        alert("Gamestate unchanged.");
    }
}

async function changeAgendaPhase() {
    const areyousure = confirm(`This will change the Agenda Phase to ${newAgendaPhase}.\n\nAre you sure you would like to change the Agenda Phase?`);
    if (areyousure) {
        postJson('/ti/admin/gamedata', { gameState: gamedata.gameState, agendaPhase: newAgendaPhase });
        alert(`Agenda Phase changed to ${newAgendaPhase}`);
        initializeGameData();
    } else {
        alert("Agenda Phase unchanged.");
    }

}

// Add event listener for "Change Gamestate" button
document.getElementById('changeGamestateBtn').addEventListener('click', changeGamestate);

// Add event listener for "Change Agenda Phase State" button
document.getElementById('changeAgendaPhaseBtn').addEventListener('click', changeAgendaPhase);

// Add event listener for "Back to Menu" button
document.getElementById('backToMenuBtn').addEventListener('click', function() {
    window.location.href = "/ti/admin";
});
