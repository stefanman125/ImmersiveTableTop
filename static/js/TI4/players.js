async function loadJsonFile(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading JSON file:', error);
    }
}

let players = []; // Array to hold player data
let objectivesList = []; // Array to hold the list of objectives

function createTable(dataArray) {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = ''; // Clear existing table

    const table = document.createElement('table');
    table.setAttribute('border', '1');

    const headerRow = document.createElement('tr');
    const headers = ['Name', 'Faction', 'Score', 'Objectives', 'Actions']; // Added Actions header
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    dataArray.forEach((player, index) => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = player.name || 'New Player'; // Default name
        row.appendChild(nameCell);

        const factionCell = document.createElement('td');
        factionCell.textContent = player.avatar.split('/').pop().split('.')[0];
        row.appendChild(factionCell)

        const pointsCell = document.createElement('td');
        pointsCell.textContent = player.points || 0; // Default points
        row.appendChild(pointsCell);

        const playerObjectivesArray = player.objectives;
        const objectivesCell = document.createElement('td');
        objectivesCell.innerHTML = (playerObjectivesArray || []).join('<br>'); // Objectives delimited by new lines
        row.appendChild(objectivesCell);

        const actionsCell = document.createElement('td'); // Create actions cell

        // Remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removePlayer(index); // Bind the removePlayer function
        actionsCell.appendChild(removeButton);

        // Change Name button
        const changeNameButton = document.createElement('button');
        changeNameButton.textContent = 'Change Name';
        changeNameButton.onclick = () => changePlayerName(index); // Bind the changePlayerName function
        actionsCell.appendChild(changeNameButton);

        // Change points button
        const changepointsButton = document.createElement('button');
        changepointsButton.textContent = 'Change Score';
        changepointsButton.onclick = () => changePlayerPoints(index); // Bind the changePlayerPoints function
        actionsCell.appendChild(changepointsButton);

        // Add Objective button
        const changeObjectivesButton = document.createElement('button');
        changeObjectivesButton.textContent = 'Change Objectives';
        changeObjectivesButton.onclick = () => changeObjectives(index); // Bind the changeObjectives function
        actionsCell.appendChild(changeObjectivesButton);

        // Agenda Phase Options
        const agendaPhaseButton = document.createElement('button');
        agendaPhaseButton.textContent = 'Agenda Phase Options';
        agendaPhaseButton.onclick = () => changeAgendaPhaseOptions(index); // Bind to changeAgendaPhaseOptions function
        actionsCell.appendChild(agendaPhaseButton);

        // Add Secret Objective button
        const addSecretObjectiveButton = document.createElement('button');
        addSecretObjectiveButton.textContent = 'Add Secret Objective';
        addSecretObjectiveButton.onclick = () => addSecretObjective(index); // Bind the addSecretObjective function
        actionsCell.appendChild(addSecretObjectiveButton);

        row.appendChild(actionsCell);

        table.appendChild(row);
    });

    tableContainer.appendChild(table);
}

function addNewPlayer() {
    // List of all factions
    const avatarOptions = [
    "arborec", "argent", "cabal", "creuss", "empyrean", "hacan", 
    "jolnar", "l1", "letnev", "mahact", "mentak", "muaat", 
    "naalu", "nekro", "nomad", "rokha", "saar", "sardakk", 
    "sol", "titans", "winnu", "xxcha", "yin", "yssaril"
    ]
    let avatar;

    // Prompt the user until they select a valid avatar
    avatar = prompt(`Enter the players faction:\n${avatarOptions.join("\n")}`);
    if (!avatarOptions.includes(avatar)) {
        alert("Invalid choice. Select one of the listed factions.");
    } else if (players.some(player => player.avatar.includes(avatar))) {
        alert("The selected faction is already in play. Please choose another faction.") 
    } else if (avatar !== null) {

        // Create the new player object with the chosen avatar
        const newPlayer = {
            name: `Player ${players.length + 1}`, // Default name
            points: 0, // Default points
            objectives: [], // No objectives
            avatar: `${avatarFilesUrl}${avatar}.png`, // Chosen avatar
            for: 0, // Agenda Phase FOR votes
            against: 0, // Agenda Phase AGAINST votes
            rider: "None", // Agenda Phase Rider
            speaker: false, // Agenda Phase Speaker token
            abstain: false, // Agenda phase abstain 
            elect: "None", // Agenda Phase Elect
        };

        players.push(newPlayer); // Add the new player to the array
        createTable(players); // Refresh the table with the new player
        saveDataToJson(); // Save updated data back to JSON file
        logAction(`New player "${newPlayer.name}" playing "${avatar}" was added by`)
    }
}

function removePlayer(index) {
    const confirmRemove = confirm('Are you sure you want to remove this player?');
    if (confirmRemove) {
        logAction(`Player "${players[index].name}" was removed by`)
        players.splice(index, 1); // Remove the player from the array
        createTable(players); // Refresh the table
        saveDataToJson(); // Save updated data back to JSON file
    }
}

function changePlayerName(index) {
    const newName = prompt('Enter the new name for the player:', players[index].name);
    if (newName) {
        logAction(`Player "${players[index].name}" was renamed to "${newName}" by`)
        players[index].name = newName; // Update the player's name
        createTable(players); // Refresh the table
        saveDataToJson(); // Save updated data back to JSON file
    }
}

function changePlayerPoints(index) {
    const newPoints = prompt('Enter the new score for the player:', players[index].points);
    if (newPoints !== null) {
        const parsedPoints = parseInt(newPoints, 10); // Parse the input to an integer
        if (!isNaN(parsedPoints)) {
            logAction(`Player "${players[index].name}" score changed from '${players[index].points}' to '${parsedPoints}' by`)
            players[index].points = parsedPoints; // Update the player's points
            createTable(players); // Refresh the table
            saveDataToJson(); // Save updated data back to JSON file
        } else {
            alert('Please enter a valid number.'); // Validation message
        }
    }
}

function changeObjectives(index) {
    if (objectivesList.length === 0) {
        alert('No objectives available to add.');
        return;
    }

    // Get the modal elements
    const modal = document.getElementById('objective-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.getElementById('close-modal');
    
    // Clear any existing content in the modal body
    modalBody.innerHTML = '';

    // Create a container for the two columns
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'space-between';

    // Left column for available objectives
    const availableColumn = document.createElement('div');
    availableColumn.style.width = '48%'; // Adjust width as needed
    availableColumn.innerHTML = '<h3>Available Objectives</h3>'; // Column title

    // Get the player's existing objectives
    const playerObjectives = players[index].objectives;

    // Filter the objectives list to exclude already owned objectives
    const availableObjectives = objectivesList.filter(objective => 
        !playerObjectives.includes(objective)
    );

    // Create a list of filtered objectives with a select button for each
    availableObjectives.forEach((objective, i) => {
        const objectiveItem = document.createElement('div');
        objectiveItem.classList.add('objective-item');
        
        // Create the objective text
        const objectiveText = document.createElement('span');
        objectiveText.textContent = objective;
        objectiveItem.appendChild(objectiveText);
        
        // Create the select button
        const selectButton = document.createElement('button');
        selectButton.textContent = 'Select';
        selectButton.setAttribute('data-index', i);
        objectiveItem.appendChild(selectButton);
        
        // Append this item to the available column
        availableColumn.appendChild(objectiveItem);

        // Add event listener to handle selection
        selectButton.addEventListener('click', function () {
            const selectedIndex = parseInt(this.getAttribute('data-index'), 10);
            if (selectedIndex >= 0 && selectedIndex < availableObjectives.length) {
                players[index].objectives.push(availableObjectives[selectedIndex]); // Add the selected objective to the player
                createTable(players); // Refresh the table
                saveDataToJson(); // Save updated data back to JSON file
                logAction(`Player "${players[index].name}" received a new objective: "${availableObjectives[selectedIndex]}" by`)
            }
            modal.style.display = 'none'; // Close the modal after selection
            document.body.style.overflow = ''; // Re-enable scrolling
        });
    });

    // Right column for existing objectives
    const existingColumn = document.createElement('div');
    existingColumn.style.width = '48%'; // Adjust width as needed
    existingColumn.innerHTML = '<h3>Existing Objectives</h3>'; // Column title

    // Display existing objectives of the player with remove buttons
    playerObjectives.forEach((objective, i) => {
        const existingObjectiveItem = document.createElement('div');
        existingObjectiveItem.classList.add('objective-item');

        // Create the existing objective text
        const existingObjectiveText = document.createElement('span');
        existingObjectiveText.textContent = objective;
        existingObjectiveItem.appendChild(existingObjectiveText);
        
        // Create the remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => {
            logAction(`The objective "${playerObjectives[i]}" was removed from the player "${players[index].name}" by`)
            players[index].objectives.splice(i, 1); // Remove the objective from the player's objectives
            createTable(players); // Refresh the table
            saveDataToJson(); // Save updated data back to JSON file
            modal.style.display = 'none'; // Close the modal after removal
        };
        existingObjectiveItem.appendChild(removeButton);

        // Append this item to the existing column
        existingColumn.appendChild(existingObjectiveItem);
    });

    // Append both columns to the container
    container.appendChild(availableColumn);
    container.appendChild(existingColumn);
    modalBody.appendChild(container);

    // Display the modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Disable scrolling when modal is open

    // Handle modal close button
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    });

    // Close the modal if user clicks outside of it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    };
}

async function changeAgendaPhaseOptions(index) {
    // Get the modal elements
    const modal = document.getElementById('objective-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.getElementById('close-modal');
    
    // Clear any existing content in the modal body
    modalBody.innerHTML = '';

    // Create title showing which players stats are being changed
    const title = document.createElement("h1");
    title.textContent = `${players[index].name}'s Agenda Phase Options`;
    modalBody.appendChild(title);

    // Create the table and body
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    // Create the rows for all the agenda phase options

    // FOR row
    const forTr = document.createElement("tr");
    const forHeaderTd = document.createElement("td");
    forHeaderTd.textContent = "FOR";
    forTr.appendChild(forHeaderTd);
    const forValueTd = document.createElement("td");
    const forValue = document.createElement("input");
    forValue.type = "number";
    forValue.addEventListener("change", (e) => {
        if (players[index].abstain === false) {
            players[index].for = parseInt(e.target.value, 10);
        }
    });
    forValue.value = players[index].for;
    forValueTd.appendChild(forValue);
    forTr.appendChild(forValueTd);
    tbody.appendChild(forTr);

    // AGAINST row
    const againstTr = document.createElement("tr");
    const againstHeaderTd = document.createElement("td");
    againstHeaderTd.textContent = "AGAINST";
    againstTr.appendChild(againstHeaderTd);
    const againstValueTd = document.createElement("td");
    const againstValue = document.createElement("input");
    againstValue.type = "number";
    againstValue.addEventListener("change", (e) => {
        if (players[index].abstain === false) {
            players[index].against = parseInt(e.target.value, 10);
        };
    });
    againstValue.value = players[index].against;
    againstValueTd.appendChild(againstValue);
    againstTr.appendChild(againstValueTd);
    tbody.appendChild(againstTr);

    // RIDER row
    const riders = [
        "None",
        "Place 1 space dock from your reinforcements on a planet you control.",
        "choose 1 system that contains a planet you control. Each other player places a command token from their reinforcements in that system.",
        "gain 1 victory point.",
        "gain 3 command tokens.",
        "draw 3 action cards and gain the speaker token.",
        "research 1 technology.",
        "gain 5 trade goods.",
        "place 1 dreadnought from your reinforcements in a system that contains 1 or more of your ships."
    ]
    const riderTr = document.createElement("tr");
    const riderHeaderTd = document.createElement("td");
    riderHeaderTd.textContent = "RIDER";
    riderTr.appendChild(riderHeaderTd);
    const riderValueTd = document.createElement("td");
    const riderValue = document.createElement("select");
    riders.forEach(rider => {
        const optionElement = document.createElement("option");
        optionElement.textContent = rider;
        optionElement.value = rider;
        riderValue.appendChild(optionElement);
    });
    riderValue.addEventListener("change", (e) => {
        if (players[index].abstain === false) {
            players[index].rider = e.target.value;
        }
    });
    riderValue.value = players[index].rider;
    riderValueTd.appendChild(riderValue);
    riderTr.appendChild(riderValueTd);
    tbody.appendChild(riderTr);

    // SPEAKER row
    const speakerTr = document.createElement("tr");
    const speakerHeaderTd = document.createElement("td");
    speakerHeaderTd.textContent = "speaker";
    speakerTr.appendChild(speakerHeaderTd);
    const speakerValueTd = document.createElement("td");
    const speakerValue = document.createElement("input");
    speakerValue.type = "checkbox";
    speakerValue.addEventListener("change", (e) => {
        players[index].speaker = e.target.checked;
        // If the player is speaker, everyone else stops being speaker
        if (e.target.checked === true) {
            players.forEach(player => {
                if (player.name !== players[index].name)
                player.speaker = false;
            })
        }
    });
    speakerValue.checked = players[index].speaker;
    speakerValueTd.appendChild(speakerValue);
    speakerTr.appendChild(speakerValueTd);
    tbody.appendChild(speakerTr);

    // Abstain row
    const abstainTr = document.createElement("tr");
    const abstainHeaderTd = document.createElement("td");
    abstainHeaderTd.textContent = "abstaining";
    abstainTr.appendChild(abstainHeaderTd);
    const abstainValueTd = document.createElement("td");
    const abstainValue = document.createElement("input");
    abstainValue.type = "checkbox";
    abstainValue.addEventListener("change", (e) => {
        players[index].abstain = e.target.checked;
        // If the player is abstaining, all their other values are back to zero
        if (e.target.checked === true) {
            players[index].for = 0;
            players[index].against = 0;
            players[index].rider = "None";
            players[index].elect = "None";
        }
    });
    abstainValue.checked = players[index].abstain;
    abstainValueTd.appendChild(abstainValue);
    abstainTr.appendChild(abstainValueTd);
    tbody.appendChild(abstainTr); 
    
    // Elect Data
    const electPlayer = [];
    players.forEach(player => {
        electPlayer.push(player.name);
    })
    const electScoredSecretObjective = [
        "Destroy another player's war sun or flagship.",
        "Destroy the last of a player's ground forces on a planet during the bombardment step.",
        "Win a combat against a player who has the most victory points.",
        "Destroy the last of a player's non-fighter ships in the active system during the space cannon offense step.",
        "Win a space combat in a system that contains your flagship. You cannot score this objective if your flagship is destroyed in the combat.",
        "Lose control of a planet in a home system.",
        "Win a combat against a player whose promissory note you had in your play area at the start of your tactical action.",
        "Win a combat in an anomaly.",
        "Win a combat in another player's home system.",
        "Have 3 or more non-fighter ships in the active system at the end of a space combat.",
        "Destroy the last of a player's fighters in the active system during the anti-fighter barrage step.",
        "Be the last player to pass during a game round.",
        "Own 2 faction technologies. (Valefar Assimilator technologies do not count toward this objective.)",
        "Have 1 or more ships in a system that contains an alpha wormhole and 1 or more ships in a system that contains a beta wormhole.",
        "Have 1 or more ships in 6 systems.",
        "Have 1 or more ships in the same system as another player's space dock.",
        "Have 4 PDS units on the game board.",
        "Control 4 cultural planets.",
        "Discard 5 Action Cards.",
        "Have 3 space docks on the game board.",
        "Have 5 dreadnoughts on the game board.",
        "Have 1 or more ships in 3 systems that are each adjacent to an anomaly.",
        "Own 4 technologies of the same color.",
        "Control 4 hazardous planets.",
        "Control 4 industrial planets.",
        "Control Mecatol Rex and have 3 or more ships in its system.",
        "Have 1 or more ships in a system that is adjacent to another player's home system.",
        "Have units in the wormhole nexus.",
        "Purge 2 of your relic fragments of any type.",
        "Control planets that have a combined influence value of at least 12.",
        "Be neighbors with all other players.",
        "Control planets that have a combined resource value of at least 12.",
        "Have 1 mech on each of 4 planets.",
        "Have 9 or more ground forces on a planet that does not contain 1 of your space docks.",
        "Have units with a combined PRODUCTION value of at least 8 in a single system.",
        "Control a legendary planet.",
        "Control a planet in a system that contains a planet controlled by another player.",
        "Have another player's promissory note in your play area.",
        "There are 3 or more laws in play.",
        "You or a planet you control are elected by an agenda.",
    ];
    const electPlanet = [
      "Abaddon (Cultural)",
      "Accoen (Industrial)",
      "Abyz (Hazardous)",
      "Alio Prima (Cultural)",
      "Ang (Industrial)",
      "Archon Vail (Hazardous)",
      "Arinam (Industrial)",
      "Arnor (Industrial)",
      "Ashtroth (Hazardous)",
      "Atlas (Hazardous)",
      "Ba'kal (Industrial)",
      "Bereg (Hazardous)",
      "Centauri (Cultural)",
      "Cealdri (Cultural)",
      "Coorneeq (Cultural)",
      "Cormund (Hazardous)",
      "Dal Bootha (Cultural)",
      "Everra (Cultural)",
      "Fria (Hazardous)",
      "Gral (Industrial)",
      "Hope's End (Hazardous)",
      "Jeol Ir (Industrial)",
      "Kraag (Hazardous)",
      "Lazar (Industrial)",
      "Lisis (Industrial)",
      "Lodar (Cultural)",
      "Loki (Cultural)",
      "Lor (Industrial)",
      "Lirta IV (Hazardous)",
      "Meer (Hazardous)",
      "Mehar Xull (Hazardous)",
      "Mellon (Cultural)",
      "New Albion (Industrial)",
      "Perimeter (Industrial)",
      "Primor (Cultural)",
      "Quann (Cultural)",
      "Qucen'n (Industrial)",
      "Rarron (Cultural)",
      "Resculon (Cultural)",
      "Rigel I (Hazardous)",
      "Rigel II (Industrial)",
      "Rigel III (Industrial)",
      "Saudor (Industrial)",
      "Sakulag (Hazardous)",
      "Sem-Lore (Cultural)",
      "Siig (Hazardous)",
      "Starpoint (Hazardous)",
      "Tar'Mann (Industrial)",
      "Tequ'ran (Hazardous)",
      "Thibah (Industrial)",
      "Torkan (Cultural)",
      "Vega Major (Cultural)",
      "Vega Minor (Cultural)",
      "Vefut II (Hazardous)",
      "Velnor (Industrial)",
      "Vorhal (Cultural)",
      "Wellon (Industrial)",
      "Xanhact (Hazardous)",
      "Xxehan (Cultural)",
      "Zohbat (Hazardous)"
    ];
    const electLaw = [];
    agendas = await loadJsonFile(agendasFileUrl);
    agendas.activeAgendas.forEach(activeAgenda => {
        electLaw.push(activeAgenda.name);
    });
    const electStrategyCard = [
        "Leadership",
        "Diplomacy",
        "Politics",
        "Construction",
        "Trade",
        "Warfare",
        "Technology",
        "Imperial"
    ];

    // Elect Player Row
    const electPlayerTr = document.createElement("tr");
    const electPlayerHeaderTd = document.createElement("td");
    electPlayerHeaderTd.textContent = "Elect Player";
    electPlayerTr.appendChild(electPlayerHeaderTd);
    const electPlayerTd = document.createElement("td");
    const electPlayerTdValue = document.createElement("select");
    electPlayer.forEach(player => {
        const electPlayerOptionElement = document.createElement("option");
        electPlayerOptionElement.textContent = player;
        electPlayerOptionElement.value = player;
        electPlayerTdValue.appendChild(electPlayerOptionElement);
    });
    electPlayerTdValue.value = players[index].elect;
    electPlayerTdValue.addEventListener("change", (e) => {
        if (players[index].abstain === false) {
            players[index].elect = e.target.value;
        };
    });
    electPlayerTd.appendChild(electPlayerTdValue);
    electPlayerTr.appendChild(electPlayerTd);
    tbody.appendChild(electPlayerTr);

    // Elect Scored Secret Objective Row
    const electScoredSecretObjectiveTr = document.createElement("tr");
    const electScoredSecretObjectiveHeaderTd = document.createElement("td");
    electScoredSecretObjectiveHeaderTd.textContent = "Elect Scored Secret Objective";
    electScoredSecretObjectiveTr.appendChild(electScoredSecretObjectiveHeaderTd);
    const electScoredSecretObjectiveTd = document.createElement("td");
    const electScoredSecretObjectiveTdValue = document.createElement("select");
    electScoredSecretObjective.forEach(objective => {
        const electScoredSecretObjectiveOptionElement = document.createElement("option");
        electScoredSecretObjectiveOptionElement.textContent = objective;
        electScoredSecretObjectiveOptionElement.value = objective;
        electScoredSecretObjectiveTdValue.appendChild(electScoredSecretObjectiveOptionElement);
    });
    electScoredSecretObjectiveTdValue.value = players[index].elect;
    electScoredSecretObjectiveTdValue.addEventListener("change", (e) => {
        if (players[index].abstain === false) {
            players[index].elect = e.target.value;
        };
    });
    electScoredSecretObjectiveTd.appendChild(electScoredSecretObjectiveTdValue);
    electScoredSecretObjectiveTr.appendChild(electScoredSecretObjectiveTd);
    tbody.appendChild(electScoredSecretObjectiveTr);

    // Elect Planet Row
    const electPlanetTr = document.createElement("tr");
    const electPlanetHeaderTd = document.createElement("td");
    electPlanetHeaderTd.textContent = "Elect Planet";
    electPlanetTr.appendChild(electPlanetHeaderTd);
    const electPlanetTd = document.createElement("td");
    const electPlanetTdValue = document.createElement("select");
    electPlanet.forEach(planet => {
        const electPlanetOptionElement = document.createElement("option");
        electPlanetOptionElement.textContent = planet;
        electPlanetOptionElement.value = planet;
        electPlanetTdValue.appendChild(electPlanetOptionElement);
    });
    electPlanetTdValue.value = players[index].elect;
    electPlanetTdValue.addEventListener("change", (e) => {
        if (players[index].abstain === false) {
            players[index].elect = e.target.value;
        };
    });
    electPlanetTd.appendChild(electPlanetTdValue);
    electPlanetTr.appendChild(electPlanetTd);
    tbody.appendChild(electPlanetTr);

    // Elect Law
    const electLawTr = document.createElement("tr");
    const electLawHeaderTd = document.createElement("td");
    electLawHeaderTd.textContent = "Elect Law";
    electLawTr.appendChild(electLawHeaderTd);
    const electLawTd = document.createElement("td");
    const electLawTdValue = document.createElement("select");
    electLaw.forEach(law => {
        const electLawOptionElement = document.createElement("option");
        electLawOptionElement.textContent = law;
        electLawOptionElement.value = law;
        electLawTdValue.appendChild(electLawOptionElement);
    });
    electLawTdValue.value = players[index].elect;
    electLawTdValue.addEventListener("change", (e) => {
        if (players[index].abstain === false) {
            players[index].elect = e.target.value;
        };
    });
    electLawTd.appendChild(electLawTdValue);
    electLawTr.appendChild(electLawTd);
    tbody.appendChild(electLawTr);

    // Elect Strategy Card
    const electStrategyCardTr = document.createElement("tr");
    const electStrategyCardHeaderTd = document.createElement("td");
    electStrategyCardHeaderTd.textContent = "Elect Strategy Card";
    electStrategyCardTr.appendChild(electStrategyCardHeaderTd);
    const electStrategyCardTd = document.createElement("td");
    const electStrategyCardTdValue = document.createElement("select");
    electStrategyCard.forEach(card => {
        const electStrategyCardOptionElement = document.createElement("option");
        electStrategyCardOptionElement.textContent = card;
        electStrategyCardOptionElement.value = card;
        electStrategyCardTdValue.appendChild(electStrategyCardOptionElement);
    });
    electStrategyCardTdValue.value = players[index].elect;
    electStrategyCardTdValue.addEventListener("change", (e) => {
        if (players[index].abstain === false) {
            players[index].elect = e.target.value;
        };
    });
    electStrategyCardTd.appendChild(electStrategyCardTdValue);
    electStrategyCardTr.appendChild(electStrategyCardTd);
    tbody.appendChild(electStrategyCardTr);

    // Append the tbody to table and table to modal body
    table.appendChild(tbody);
    modalBody.appendChild(table);

    // Display the modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Disable scrolling when modal is open

    // Handle modal close button
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
        saveDataToJson();
    });

    // Close the modal and save the changed data if user clicks outside of it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
            saveDataToJson();
        }
    };
}

function resetAgendaPhaseStats() {
    if (confirm("Are you sure you would like to reset everyones Agenda Phase Stats?")){
        players.forEach(player => {
            player.for = 0;
            player.against = 0;
            player.rider = "None";
            player.abstain = false;
            player.elect = "None";
        });
    };
    saveDataToJson();
}

function addSecretObjective(index) {
    // Prompt the user for the secret objective's name
    var objectiveName = prompt('Enter the secret objective condition:');
    
    if (objectiveName) {
        // Add the secret objective to the player's objectives list
        players[index].objectives.push(`${objectiveName} (I) (Secret)`);
    
        // Refresh the table to reflect the changes
        createTable(players);
    
        // Save the updated players array to JSON
        saveDataToJson();
    
        logAction(`Player "${players[index].name}" received a new secret objective: "${objectiveName} (I) (Secret)" by`)
    }
}

async function saveDataToJson() {
    try {
        const response = await fetch('/ti/admin/players', { // Send to /admin/players
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(players) // Send the updated players array
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

// Load player data from JSON file
loadJsonFile(playersFileUrl).then(dataArray => { // Load from /ti/admin/players
    if (dataArray) {
        players = dataArray; // Store the loaded data in the players array
        createTable(players); // Create and populate the table
    }
});

// Load available public objectives from JSON file
objectivesList = loadJsonFile(objectivesFileUrl).then(data => {
    objectivesList = data;
});

// Add event listener for "Reset Agenda Phase Stats" button
document.getElementById('resetAgendaPhaseBtn').addEventListener('click', resetAgendaPhaseStats);

// Add event listener for "Add player" button
document.getElementById('addPlayerBtn').addEventListener('click', addNewPlayer);

// Add event listener for "Back to Menu" button
document.getElementById('backToMenuBtn').addEventListener('click', function() {
    window.location.href = "/ti/admin"
});