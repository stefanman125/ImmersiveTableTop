async function fetchData(file) {
    const response = await fetch(`/static/data/TI4/${file}`)
    const data = await response.json();
    return data
};

async function displayPlayers() {
    try {
        numPlayers = players.length

        // Sort players by score, highest to lowest
        players.sort((a, b) => a.points - b.points);

        // Clear existing rows
        const tableBody = document.querySelector('#players-table tbody');
        tableBody.innerHTML = '';

        // Create three rows: one for scores, one for avatars, and one for names
        const scoreRow = document.createElement('tr');
        const avatarRow = document.createElement('tr');
        const nameRow = document.createElement('tr');

        // Limit the data to numPlayers
        const limitedData = players.slice(0, numPlayers);

        var highScore = 0
        var topPlayers = []
        limitedData.forEach(player => {
            // Score cell
            const scoreCell = document.createElement('td');
            scoreCell.textContent = player.points;
            if (player.points > highScore) {
                highScore = player.points; // Update the highest score
                topPlayers.length = 0; // Clear the previous top players
                topPlayers.push(player.avatar); // Add the new top player
            } else if (player.points === highScore) {
                topPlayers.push(player.avatar); // Add the player in case of a tie
            }
            scoreRow.appendChild(scoreCell);

            // Avatar cell
            const avatarCell = document.createElement('td');
            const avatarImg = document.createElement('img');
            avatarImg.src = player.avatar;
            avatarImg.alt = `${player.name}'s Avatar`;
            avatarImg.classList.add('avatar'); // Add CSS class for styling
            avatarCell.appendChild(avatarImg);
            avatarRow.appendChild(avatarCell);

            // Name cell
            const nameCell = document.createElement('td');
            nameCell.textContent = player.name;
            nameRow.appendChild(nameCell);
        });

        // If there are more than 4 people in a tie, dont even bother showing the silver border
        var newBorder
        if (topPlayers.length < 5 && highScore !== 0) {
            if (topPlayers.length === 1){
                newBorder = "gold-border"
            } else {
                newBorder = "silver-border"
            }

            topPlayers.forEach(targetSrc => {
                // Find an image with the matching source in avatarRow, and give it a class that will outline its borders with either gold or silver
                const imgElement = avatarRow.querySelector(`img[src="${targetSrc}"]`);
                        
                if (imgElement) {
                    imgElement.classList.add(newBorder); // Apply the new class directly to the img tag
                }
            });
        }

        // Append the three rows to the table body
        tableBody.appendChild(scoreRow);
        tableBody.appendChild(avatarRow);
        tableBody.appendChild(nameRow);
    } catch (error) {
        console.error('Error fetching player data:', error);
    }
}

async function displayObjectives() {
    try {

        // Clear existing rows
        const objectivesTable = document.querySelector("#objectives-table")
        objectivesTable.innerHTML = '';
        objectivesTable.style.display = "flex";
        objectivesTable.style.flexDirection = "column";

        // Reverse the list of objectives shown so that the newer ones are at the top, just some flavor I thought of
        objectives = objectives.slice().reverse();

        // Constants for scaling
        const baseSize = 6; // Base size in vw
        const minSize = 2.0;  // Minimum size in vw
        const maxPlayersPerRow = players.length; // Threshold for maximum players before scaling heavily
        const maxRows = 10; // Threshold for maximum rows before scaling
        const playerWeight = 0.2; // Weight for player-based scaling
        const rowWeight = 0.8; // Weight for row-based scaling

        // Loop through each objective
        objectives.forEach(objective => {
            const row = document.createElement('div')
            row.classList.add("objectives-table-row");
            row.style.border = objectivesTableRowBorder; // Border needs to be changed using a global var in the ti.html script because changing multiple elements dynamically using JS doesn't work for some reason???*

            const playerCell = document.createElement('div'); // First column (empty)
            playerCell.style.display = "flex";
            playerCell.style.flexFlow = "row wrap";
            playerCell.style.width = "30%";
            playerCell.style.alignItems = "center";
            playerCell.style.justifyContent = "center";
            playerCell.style.gap = "0.5vw";

            // Need to loop here again to see how many players have the objective
            let numPlayers = 0;
            players.forEach(player => {
                if (player.objectives.includes(objective)) {
                    numPlayers++;
                }
            });

            // Calculate image size
            const rowFactor = Math.min(objectives.length / maxRows, 1); // Scale down if rows exceed maxRows
            const playerFactor = Math.min(numPlayers / maxPlayersPerRow, 1); // Scale down if players exceed maxPlayersPerRow

            let avatarSize = baseSize * (1 - (rowWeight * rowFactor + playerWeight * playerFactor));
            avatarSize = Math.max(avatarSize, minSize); // Ensure size is above minimum

            players.forEach(player => {
                // If the current objective in the for loop is in the players list of objectives, add their avatar to the cell
                if (player.objectives.includes(objective)){
                    const imgElement = document.createElement('img');
                    imgElement.src = player.avatar;
                    imgElement.classList.add("objectives-table-avatar")
                    imgElement.style.width = `${avatarSize}vw`;
                    imgElement.style.height = `${avatarSize}vw`;
                    imgElement.style.borderRadius = '50%';
                    playerCell.appendChild(imgElement);
                }
            });

            const objectiveCell = document.createElement('td'); // Second column (objective)
            objectiveCell.style.display = "flex";
            objectiveCell.style.alignItems = "center";
            //objectiveCell.style.justifyContent = "center";
            objectiveCell.style.width = "70%";
            objectiveCell.style.heigh = "100%";

            objectiveCell.textContent = objective;

            row.appendChild(playerCell);
            row.appendChild(objectiveCell);

            objectivesTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error displaying objectives:', error);
    }
}

async function displayAgendas() {
    try {

        // Clear existing rows
        const agendasTableBody = document.querySelector('#agendas-table tbody');
        agendasTableBody.innerHTML = '';

        // Reverse the list of objectives shown so that the newer ones are at the top, just some flavor I thought of
        //agendas = objectives.slice().reverse();

        // Loop through each agenda
        agendas.forEach(agenda => {
            const row = document.createElement('tr');
            const electCell = document.createElement('td'); // First column (empty)

            // If the elect is a player icon
            if (agenda.elect.includes('png')) {
                const imgElement = document.createElement('img');
                imgElement.src = agenda.elect;
                imgElement.classList.add("objectives-table-avatar")
                imgElement.style.width = '40%';
                imgElement.style.height = `auto`;
                imgElement.style.borderRadius = '50%';
                electCell.appendChild(imgElement);
            } else { // Else just put the elect text, which will probably be a secret objective or planet of some kind
                electCell.textContent = agenda.elect;
            }

            const agendaCell = document.createElement('td'); 
            agendaCell.style.textAlign = "left";
            agendaCell.style.width = "60%";

            agendaCell.innerHTML = `<h3>${agenda.name}</h3>${agenda.effect}`;

            row.appendChild(electCell);
            row.appendChild(agendaCell);

            agendasTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error displaying agendas:', error);
    }
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
        
        // How long the objectives frame stays depends on how many objectives there are (in milliseconds)
        const objectivesDelay = 10000 + (objectives.length * 5000);

        // How long the agendas frame stays depends on how many agendas there are (in milliseconds)
        const agendasDelay = 5000 + (agendas.length * 10000);

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
        await delay(agendasDelay);

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
        await delay(objectivesDelay);
    }
}

async function checkAgendas() {
    const intervalId = setInterval(async () => {
        try {
            // Check if at least one agenda exists
            if (agendas[0].name && !isTablesAnimationRunning) {
                //console.log("Agenda found");
                isTablesAnimationRunning = true;
                displayAgendas();
                tablesAnimation();
            } else {
                //console.log("Agenda found, but animation is currently running");
                displayAgendas();
            }
        } catch (error) {
            // No Agendas exist, return all tables back to their starting positions
            //console.log("No Agendas currently active")
            isTablesAnimationRunning = false;
        }
    }, 5000);  
}

async function updateLeaderboard() {
    // Fetch up to date objectives, players file, and agendas
    objectives = await fetchData('objectives.json');
    players = await fetchData('players.json');
    agendas = await fetchData('agendas.json')

    displayPlayers();
    displayObjectives();
    checkAgendas();
}

let isTablesAnimationRunning = false;
let objectives = [];
let players = [];
let agendas = [];

updateLeaderboard();
setInterval(updateLeaderboard, 5000);