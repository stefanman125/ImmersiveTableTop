const gamesContainer = document.getElementById("games-container");
const sessionsContainer = document.getElementById("sessions-container");
const sessionContainer = document.getElementById("session-container");

// Games tab button
document.getElementById('gamesButton').addEventListener('click', function() {
    gamesContainer.style.display = 'flex';
    sessionsContainer.style.display = 'none';
    sessionContainer.style.display = 'none';
});

// Sessions tab button
document.getElementById('sessionsButton').addEventListener('click', function() {
    gamesContainer.style.display = 'none';
    sessionsContainer.style.display = 'block';
    sessionContainer.style.display = 'none';
});

// Clicking an individual session row
function viewSession(session) {
    // Hide other containers
    gamesContainer.style.display = 'none';
    sessionsContainer.style.display = 'none';
    sessionContainer.style.display = 'flex';

    // Clear Current HTML if clicked before
    sessionContainer.innerHTML = '';

    // Session Container Styling
    sessionContainer.style.flexDirection = "column";
    sessionContainer.style.width = "90%";
    sessionContainer.style.position = "relative";
    sessionContainer.style.left = "50%";
    sessionContainer.style.translate = "-50%";
    sessionContainer.style.marginTop = "1%";
    sessionContainer.style.marginBottom = "1%";
    sessionContainer.style.borderRadius = "25px";
    sessionContainer.style.backgroundColor = "rgba(255, 255, 255, 1)";

    // Get the faction name from the avatar value
    winnerFaction = session.avatar.split('/');
    winnerFaction = winnerFaction[winnerFaction.length - 1];

    // Winner Banner Container
    bannerContainer = document.createElement('div');
    bannerContainer.style.backgroundColor = "rgba(0, 200, 0, 1)";
    bannerContainer.style.height = "10vh";
    bannerContainer.style.borderRadius = "25px 25px 0px 0px";

    bannerText = document.createElement('p');
    bannerText.textContent = `WINNER ${session.winner} (${winnerFaction})`
    bannerText.style.fontFamily = "BebasNeue";
    bannerText.style.fontSize = "4vw";
    bannerText.style.textAlign = "center";
    bannerText.style.position = "absolute";
    bannerText.style.translate = "-50% -50%";
    bannerText.style.left = "50%";
    bannerText.style.top = "-5%";
    bannerText.style.color = "rgba(255, 255, 0, 1)";
    bannerContainer.appendChild(bannerText);

    sessionContainer.appendChild(bannerContainer);

    // Winner Image Container
    winnerImageContainer = document.createElement('div');
    winnerImageContainer.style.position = "relative";

    gameImage = document.createElement('img');
    gameImage.src = `${UiFilesPath}winner-banner-${winnerFaction}`
    gameImage.onerror = () => gameImage.src = `${UiFilesPath}winner-banner-other.png`; // If there isn't a faction specific winner banner for the selected faction
    gameImage.style.height = "auto";
    gameImage.style.width = "100%";
    gameImage.style.zIndex = "1";
    winnerImageContainer.appendChild(gameImage);

    winnerImage = document.createElement('img');
    winnerImage.src = session.avatar;
    winnerImage.style.height = "100%";
    winnerImage.style.width = "auto";
    winnerImage.style.zIndex = "2";
    winnerImage.style.position = "absolute";
    winnerImage.style.left = "50%";
    winnerImage.style.translate = "-50%";
    winnerImage.style.webkitMaskImage = "linear-gradient(to right, transparent, black 5%, black 95%, transparent)";
    winnerImageContainer.appendChild(winnerImage);

    sessionContainer.appendChild(winnerImageContainer);

    // Game Stats Container
    gameStatsContainer = document.createElement('div');
    gameStatsContainer.style.display = "flex";
    gameStatsContainer.style.flexDirection = "column";

    gameStatsTitle = document.createElement('p');
    gameStatsTitle.textContent = "Game Statistics";
    gameStatsTitle.style.fontFamily = "Oswald";
    gameStatsTitle.style.fontSize = "4vw";
    gameStatsTitle.style.marginTop = "0%";
    gameStatsTitle.style.marginBottom = "0%";
    gameStatsTitle.style.marginLeft = "2%";
    gameStatsContainer.appendChild(gameStatsTitle);

    datePlayed = document.createElement('p');
    datePlayed.textContent = `Date Played: ${changeDateFormat(session.date)}`;
    datePlayed.style.fontFamily = "Oswald";
    datePlayed.style.fontSize = "2vw";
    datePlayed.style.marginTop = "0%";
    datePlayed.style.marginBottom = "0%";
    datePlayed.style.marginLeft = "2%";
    gameStatsContainer.appendChild(datePlayed);

    timePlayed = document.createElement('p');
    timePlayed.textContent = `Time Played: ${session.playtime}`
    timePlayed.style.fontFamily = "Oswald";
    timePlayed.style.fontSize = "2vw";
    timePlayed.style.marginTop = "0%";
    timePlayed.style.marginBottom = "0%";
    timePlayed.style.marginLeft = "2%";
    gameStatsContainer.appendChild(timePlayed)

    gameState = document.createElement('p');
    gameState.textContent = `Gamestate when the game ended: ${session.gameState}`
    gameState.style.fontFamily = "Oswald";
    gameState.style.fontSize = "2vw";
    gameState.style.marginTop = "0%";
    gameState.style.marginBottom = "0%";
    gameState.style.marginLeft = "2%";
    gameStatsContainer.appendChild(gameState);

    sessionContainer.appendChild(gameStatsContainer);

    // Line Separator
    separator = document.createElement('hr');
    separator.style.border = "1% solid rgba(210, 210, 210, 1)";
    separator.style.width = "100%";
    
    sessionContainer.appendChild(separator);

    // Players
    playersContainer = document.createElement('div');
    playersContainer.style.display = "flex";
    playersContainer.style.flexDirection = "row";
    playersContainer.style.justifyContent = "space-around";
    //playersContainer.style.gap = "5%";

    playersTitle = document.createElement('p');    
    playersTitle.textContent = "Players";
    playersTitle.style.fontFamily = "Oswald";
    playersTitle.style.fontSize = "4vw";
    playersTitle.style.marginTop = "0%";
    playersTitle.style.marginBottom = "0%";
    playersTitle.style.marginLeft = "2%";
    sessionContainer.appendChild(playersTitle);

    session.players.forEach(player => {
        playerContainer = document.createElement('div');        

        playerImage = document.createElement('img');
        playerImage.src = player.avatar;
        playerImage.style.width = "5vw";
        playerImage.style.height = "auto";
        playerImage.style.borderRadius = "50%";
        playerContainer.appendChild(playerImage);

        playerName = document.createElement('p');
        playerName.textContent = player.name;
        playerName.style.fontSize = "2vw";
        playerName.style.fontFamily = "Oswald";
        playerName.style.textAlign = "center";
        playerContainer.appendChild(playerName);

        playersContainer.appendChild(playerContainer);
    });

    sessionContainer.appendChild(playersContainer);
}

// When the page loads, load only the games tab by hiding the sessions and invidual session tabs
sessionsContainer.style.display = "none";
sessionContainer.style.display = "none";