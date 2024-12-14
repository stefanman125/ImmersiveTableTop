let objectives = []; // Current objectives displayed in the table
let agendas = []; // Current agendas displayed in the table

// Tier 1 Objectives list
let objectivesDataT1 = [
    "Control 4 planets that each have the same planet trait.",
    "Own 2 unit upgrade technologies.",
    "Own 2 technologies in each of 2 colors.",
    "Spend 8 resources.",
    "Control 6 planets in non-home systems.",
    "Control 3 planets that have technology specialties.",
    "Have 1 or more ships in 2 systems that are adjacent to Mecatol Rex's System.",
    "Spend a total of 3 tokens from your tactic and/or strategy pools.",
    "Spend 5 trade goods.",
    "Spend 8 influence.",
    "Spend 3 influence, 3 resources, and 3 trade goods.",
    "Have 4 or more structures.",
    "Control 2 planets that have attachments.",
    "Have your flagship or a war sun on the game board.",
    "Have units in 3 systems that do not contain planets.",
    "Have structures on 3 planets outside of your home system.",
    "Have units in 2 systems that contain legendary planets, Mecatol Rex, or anomalies.",
    "Have units in 3 systems on the edge of the game board other than your home system.",
    "Control more planets than each of 2 of your neighbors.",
    "Have 5 or more non-fighter ships in 1 system."
]

// Tier 2 Objectives list
let objectivesDataT2 = [
    "Spend 10 trade goods.",
    "Control 1 planet that is in another player's home system.",
    "Control 5 planets that have technology specialties.",
    "Spend 16 resources.",
    "Spend a total of 6 tokens from your tactic and/or strategy pools.",
    "Spend 16 influence.",
    "Own 2 technologies in each of 4 colors.",
    "Own 3 unit upgrade technologies.",
    "Control 11 planets in non-home systems.",
    "Control 6 planets that each have the same planet trait.",
    "Have your flagship or a war sun in another player's home system or the Mecatol Rex system.",
    "Have units in 4 systems that contain legendary planets, Mecatol Rex, or anomalies.",
    "Have 8 or more non-fighter ships in 1 system.",
    "Have 7 or more structures.",
    "Have units in 5 systems on the edge of the game board other than your home system.",
    "Spend 6 influence, 6 resources, and 6 trade goods.",
    "Have units in 5 systems that do not contain planets.",
    "Have structures on 5 planets outside of your home system.",
    "Control 3 planets that have attachments.",
    "Control 2 planets that are each in or adjacent to a different, other player's home system."
]

// Secret Objectives list
let objectivesDataSO = [
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
]

agendasData = [
    {"name":"Anti-Intellectual Revolution", "type":"Law", "elect":"-", "description":"FOR : After a player researches a technology, they must destroy 1 of their non-fighter ships.\nAGAINST : At the start of the next strategy phase, each player chooses and exhausts 1 planet for each technology they own."},
    {"name":"Classified Document Leaks", "type":"Law", "elect":"Scored Secret Objective", "description":"When this agenda is revealed, if there are no scored secret objectives, discard this card and reveal another agenda from the top of the deck. The elected secret objective becomes a public objective; place it near the other public objectives in the common play area."},
    {"name":"Committee Formation", "type":"Law", "elect":"Player", "description":"The elected player gains this card. Before players vote on an agenda that requires a player to be elected, the owner of this card may discard this card to choose a player to be elected. Players do not vote on that agenda."},
    {"name":"Conventions of War", "type":"Law", "elect":"-", "description":"FOR : Players cannot use BOMBARDMENT against units that are on cultural planets.\nAGAINST : Each player that voted \"Against\" discards all of their action cards."},
    //{"name":"Core Mining", "type":"Law", "elect":"Planet", "description": "Attach this card to the elected planet's card. Then, destroy 1 infantry on the planet.\nThe resource value of this planet is increased by 2."},
    //{"name":"Demilitarized Zone", "type":"Law", "elect":"Cultural Planet", "description": "Attach this card to the elected planet's card. Then, destroy all units on that planet.\nPlayer's units cannot land, be produced, or be placed on this planet."},
    {"name":"Enforced Travel Ban", "type":"Law", "elect":"Cultural Planet", "description": "FOR : Alpha and beta wormholes have no effect during movement.\nAGAINST : Destroy each PDS in or adjacent to a system that contains a wormhole."},
    {"name":"Executive Sanctions", "type":"Law", "elect":"-", "description": "FOR : Each player can have a maximum of 3 action cards in their hand.\nAGAINST : Each player discards 1 random action card from their hand."},
    {"name":"Fleet Regulations", "type":"Law", "elect":"-", "description": "FOR : Each player cannot have more than 4 tokens in their fleet pool.\nAGAINST : Each player places 1 command token from their reinforcements in their fleet pool."},
    //{"name":"Holy Planet of Ixth", "type":"Law", "elect":"Cultural Planet", "description": "Attach this card to the elected planet's card. The planet's owner gains 1 victory point. Units on this planet cannot use PRODUCTION. When a player gains control of this planet, they gain 1 victory point. When a player loses control of this planet, they lose 1 victory point."},
    {"name":"Homeland Defense Act", "type":"Law", "elect":"", "description": "FOR : Each player can have any number of PDS units on planets they control.\nAGAINST : Each player destroys 1 of their PDS unit."},
    {"name":"Imperial Arbiter", "type":"Law", "elect":"Player", "description": "The elected player gains this card.\nAt the end of the strategy phase, the owner of this card may discard this card to swap 1 of their strategy cards with 1 of another player's strategy cards."},
    {"name":"Minister of Commerce", "type":"Law", "elect":"Player", "description": "The elected player gains this card.\nAfter the owner of this card replenishes commodities, they gain 1 trade good for each player that is their neighbor."},
    {"name":"Minister of Exploration", "type":"Law", "elect":"Player", "description": "The elected player gains this card.\nWhen the owner of this card gains control of a planet, they gain 1 trade good."},
    {"name":"Minister of Industry", "type":"Law", "elect":"Player", "description": "The elected player gains this card.\nWhen the owner of this card places a space dock in a system, their units in that system may use their PRODUCTION abilities."},
    {"name":"Minister of Peace", "type":"Law", "elect":"Player", "description": "The elected player gains this card.\nAfter a player activates a system that contains 1 or more of a different player's units, the owner of this card may discard this card; immediately end the active player's turn."},
    {"name":"Minister of Policy", "type":"Law", "elect":"Player", "description": "The elected player gains this card. At the end of the status phase, the owner of this card draws 1 action card."},
    {"name":"Minister of Sciences", "type":"Law", "elect":"Player", "description": "The elected player gains this card.\nWhen the owner of this card resolves the primary or secondary ability of the \"Technology\" strategy card, they do not need to spend resources to research technology."},
    {"name":"Minister of War", "type":"Law", "elect":"Player", "description": "The elected player gains this card.\nThe owner of this card may discard this card after performing an action to remove 1 of their command counters from the game board and return it to their reinforcements; then they may perform 1 additional action."},
    {"name":"Prophecy of Ixth", "type":"Law", "elect":"Player", "description": "The elected player gains this card.\nThe owner of this card applies +1 to the result of their fighter's combat rolls. When the owner of this card uses PRODUCTION, they discard this card unless they produce 2 or more fighters."},
    {"name":"Publicize Weapon Schematics", "type":"Law", "elect":"-", "description": "FOR : If any player owns a war sun technology, all players may ignore all prerequisites on war sun technologies. All war suns lose SUSTAIN DAMAGE.\nAGAINST : Each player that owns a war sun technology discards all of their action cards."},
    {"name":"Regulated Conscription", "type":"Law", "elect":"-", "description": "FOR : When a player produces units, they produce only 1 fighter and infantry for its cost instead of 2.\nAGAINST : No effect."},
    //{"name":"Representative Government (TI4)", "type":"Law", "elect":"-", "description": "FOR : Players cannot exhaust planets to cast votes during the agenda phase. Each player may cast 1 vote on each agenda instead.\nAGAINST : At the start of the next strategy phase, each player that voted \"Against\" exhausts all of their cultural planets."},
    //{"name":"Research Team: Biotic", "type":"Law", "elect":"Industrial Planet", "description": "Attach this card to the elected planet's card.\nWhen the owner of this planet researches technology, they may exhaust this card to ignore 1 green prerequisite."},
    //{"name":"Research Team: Cybernetic ", "type":"Law", "elect":"Industrial Planet", "description": "Attach this card to the elected planet's card.\nWhen the owner of this planet researches technology, they may exhaust this card to ignore 1 yellow prerequisite."},
    //{"name":"Research Team: Propulsion", "type":"Law", "elect":"Industrial Planet", "description": "Attach this card to the elected planet's card.\nWhen the owner of this planet researches technology, they may exhaust this card to ignore 1 blue prerequisite."},
    //{"name":"Research Team: Warfare", "type":"Law", "elect":"Hazardous Planet", "description": "Attach this card to the elected planet's card.\nWhen the owner of this planet researches technology, they may exhaust this card to ignore 1 red prerequisite."},
    //{"name":"Senate Sanctuary", "type":"Law", "elect":"Planet", "description": "Attach this card to the elected planet's card.\nThe influence value of this planet is increased by 2."},
    //{"name":"Shard of the Throne", "type":"Law", "elect":"Player", "description": "The elected player gains this card and 1 victory point.\nA player gains this card and 1 victory point when they win a combat against the owner of this card. Then, the previous owner of this card loses 1 victory point."},
    {"name":"Shared Research", "type":"Law", "elect":"-", "description": "FOR : Each player's units can move through nebulae.\nAGAINST : Each player places a command token from their reinforcements in their home system, if able."},
    //{"name":"Terraforming Initiative", "type":"Law", "elect":"Hazardous Planet", "description": "Attach this card to the elected planet's card.\nThe resource and influence values of this planet are increased by 1."},
    //{"name":"The Crown of Emphidia", "type":"Law", "elect":"Player", "description": "The elected player gains this card and 1 victory point.\nA player gains this card and 1 victory point after they gain control of a planet in the home system of this card's owner. Then, the previous owner of this card loses 1 victory point."},
    //{"name":"The Crown of Thalnos", "type":"Law", "elect":"Player", "description": "The elected player gains this card.\nDuring each combat round, the owner of this card may reroll any number of dice; they must destroy each of their units that did not produce a hit with its reroll."},
    {"name":"Wormhole Reconstruction", "type":"Law", "elect":"-", "description": "FOR : All systems that contain either an alpha or beta wormhole are adjacent to each other.\nAGAINST : Each player places a command token from their reinforcements in each system that contains a wormhole and 1 or more of their ships."},
    {"name":"Articles of War", "type":"Law", "elect":"", "description": "FOR : All mechs lose their printed abilities except for SUSTAIN DAMAGE. AGAINST : Each player that voted \"For\" gains 3 trade goods."},
    {"name":"Checks and Balances", "type":"Law", "elect":"", "description": "FOR : When a player chooses a strategy card during the strategy phase, they give that strategy card to another player that does not have 1 (or a player that does not have 2 in a three- or four-player game), if able.\nAGAINST : Each player readies only 3 of their planets at the end of this agenda phase."},
    {"name":"Nexus Sovereignty", "type":"Law", "elect":"", "description": "FOR : Alpha and beta wormholes in the wormhole nexus have no effect during movement.\nAGAINST : Place a gamma wormhole token in the Mecatol Rex system."},
    {"name":"Political Censure", "type":"Law", "elect":"Player", "description": "The elected player gains this card and 1 victory point.\nThe elected player cannot play action cards.\nIf the owner of this card loses this card, they lose 1 victory point."},
    {"name":"Representative Government", "type":"Law", "elect":"", "description": "FOR : Players cannot exhaust planets to cast votes during the agenda phase; each player may cast 1 vote on each agenda instead. Players cannot cast additional votes.\nAGAINST : At the start of the next strategy phase, each player that voted \"Against\" exhausts all of their cultural planets."},
    {"name":"Search Warrant", "type":"Law", "elect":"Player", "description": "The elected player gains this card and draws 2 secret objectives.\nThe owner of this card plays with their secret objectives revealed."},
    {"name":"Archived Secret", "type":"Directive", "elect":"Player", "description": "Elected player draws 1 secret objective."},
    {"name":"Arms Reduction", "type":"Directive", "elect":"-", "description": "FOR : Each player destroys all but 2 of their dreadnaughts and all but 4 of their cruisers.\nAGAINST : At the start of the next strategy phase, each player exhausts each of their planets that have a technology specialty."},
    {"name":"Colonial Redistribution", "type":"Directive", "elect":"Non-Home Planet Other Than Mecatol Rex", "description": "Destroy each unit on the elected planet. Then, the player who controls that planet chooses 1 player with the fewest victory points; that player may place 1 infantry from their reinforcements on the elected planet."},
    {"name":"Compensated Disarmament", "type":"Directive", "elect":"Planet", "description": "Destroy each ground force on the elected planet; for each unit that was destroyed, the player who controls that planet gains 1 trade good."},
    {"name":"Economic Equality", "type":"Directive", "elect":"-", "description": "FOR : Each player returns all of their trade goods to the supply. Then, each player gains 5 trade goods.\nAGAINST : Each player returns all of their trade goods to the supply."},
    {"name":"Incentive Program", "type":"Directive", "elect":"-", "description": "FOR : Draw and reveal 1 stage I public objective from the deck and place it near the public objectives.\nAGAINST : Draw and reveal 1 stage II public objective from the deck and place it near the public objectives."},
    {"name":"Ixthian Artifact", "type":"Directive", "elect":"-", "description": "FOR : The speaker rolls 1 die. If the result is 6-10, each player may research 2 technologies. If the result is 1-5, destroy all units in Mecatol Rex's system, and each player with units in systems adjacent to Mecatol Rex's system destroys 3 of their units in each of those systems.\nAGAINST : No effect."},
    {"name":"Judicial Abolishment", "type":"Directive", "elect":"Law", "description": "When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck.\nDiscard the elected law from play."},
    {"name":"Miscount Disclosed", "type":"Directive", "elect":"Law", "description": "When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck.\nVote on the elected law as if it were just revealed from the top of the deck."},
    {"name":"Mutiny", "type":"Directive", "elect":"-", "description": "FOR : Each player who voted \"For\" gains 1 victory point.\nAGAINST : Each player who voted \"For\" loses 1 victory point."},
    {"name":"New Constitution", "type":"Directive", "elect":"-", "description": "When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck.\nFOR : Discard all laws in play. At the start of the next strategy phase, each player exhausts each planet in their home system.\nAGAINST : No effect."},
    {"name":"Public Execution", "type":"Directive", "elect":"Player", "description": "The elected player discards all of their action cards. If they have the speaker token, they give it to the player on their left. The elected player cannot vote on any agendas during this agenda phase."},
    {"name":"Seed of an Empire", "type":"Directive", "elect":"-", "description": "FOR : The player with most victory points gains 1 victory point.\nAGAINST : The player with the fewest victory points gains 1 victory point."},
    {"name":"Swords to Plowshares", "type":"Directive", "elect":"-", "description": "FOR : Each player destroys half of their infantry on each planet they control, rounded up. Then, each player gains trade goods equal to the number of their infantry that were destroyed.\nAGAINST : Each player places 1 infantry from their reinforcements on each planet they control."},
    {"name":"Unconventional Measures", "type":"Directive", "elect":"-", "description": "FOR : Each player that voted \"For\" draws 2 action cards.\nAGAINST : Each player that voted \"For\" discards all of their action cards."},
    {"name":"Wormhole Research", "type":"Directive", "elect":"-", "description": "FOR : Each player who has 1 or more ships in a system that contains a wormhole may research 1 technology. Then, destroy all ships in systems that contain an alpha or beta wormhole.\nAGAINST : Each player that voted \"Against\" removes 1 command token from their command sheet and returns it to their reinforcements."},
    {"name":"Armed Forces Standardization", "type":"Directive", "elect":"Player", "description": "The elected player places command tokens from their reinforcements so that they have 3 tokens in their tactic pool, 3 tokens in their fleet pool and 2 tokens in their strategy pool. They return any excess tokens to their reinforcements."},
    {"name":"Clandestine Operations", "type":"Directive", "elect":"", "description": "FOR : Each player removes 2 command tokens from their command sheet and returns those tokens to their reinforcements.\nAGAINST : Each player removes 1 command token from their fleet pool and returns that token to their reinforcements."},
    {"name":"Covert Legislation", "type":"Directive", "elect":"", "description": "When this agenda is revealed, the speaker draws the next card in the agenda deck but does not reveal it to the other players. Instead, the speaker reads the eligible outcomes aloud (for, against, elect player, etc.); the other players vote for these outcomes as if they were outcomes of this agenda, without knowing their effects."},
    {"name":"Galactic Crisis Pact", "type":"Directive", "elect":"Strategy Card", "description": "Each player may perform the secondary ability of the elected strategy card without spending a command token; command tokens placed by the ability are placed from a player's reinforcements instead."},
    {"name":"Minister of Antiques", "type":"Directive", "elect":"Player", "description": "The elected player gains 1 relic."},
    {"name":"Rearmament Agreement", "type":"Directive", "elect":"", "description": "FOR : Each player places 1 mech from their reinforcements on a planet they control in their home system.\nAGAINST : Each player replaces each of their mechs with 1 infantry from their reinforcements."},
    {"name":"Research Grant Reallocation", "type":"Directive", "elect":"Player", "description": "The elected player gains any 1 technology of their choice. Then, for each prerequisite on that technology, they remove 1 token from their fleet pool and return it to their reinforcements."},
]

// Load objectives from JSON file
async function loadDataFromFile(type, fileUrl) {
    try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (type === "Objective") {
            objectives = data;
        } else if (type === "Agenda") {
            agendas = data;
        }
    } catch (error) {
        console.error('Error loading objectives:', error);
    }
}

// Create the table structure and insert objectives
function createTable(type) {
    let tableContainer;
    if (type === "Objective") {
        tableContainer = document.getElementById('tableContainerObjectives');
    } else if (type === "Agenda") {
        tableContainer = document.getElementById('tableContainerAgendas');
    }
    tableContainer.innerHTML = ''; // Clear previous content

    const table = document.createElement('table');
    table.id = `table${type}`
    table.setAttribute('border', '1');
    table.style.width = '100%';

    // Create table header
    const headerRow = document.createElement('tr');
    let headers;
    if (type === "Objective") {
        headers = ['Objective', 'Action'];
    } else if (type === "Agenda") {
        headers = ['Agenda', 'Elect', 'Action'];
    }
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    // Create rows for each objective using document fragment for efficiency
    const fragment = document.createDocumentFragment();

    if (type === "Objective") {
        objectives.forEach((objective, objIndex) => {
            const row = createObjectiveRow(objective, objIndex); // Pass the whole objective object
            fragment.appendChild(row);
        });
    } else if (type === "Agenda") {
        agendas.currentAgendas.forEach((agenda, agendaIndex) => {
            const row = createAgendaRow(agenda, agendaIndex); // Pass the whole agenda name
            fragment.appendChild(row);
        });
    }

    // Add fragment (rows) to table
    table.appendChild(fragment);
    tableContainer.appendChild(table);
}

// Create an individual row for each objective
function createObjectiveRow(objective, objIndex) {
    const row = document.createElement('tr');

    // Objective cell
    const objectiveCell = document.createElement('td');
    objectiveCell.textContent = objective;
    row.appendChild(objectiveCell);

    // Action cell (Remove button)
    const actionCell = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => confirmRemoveItem("Objective", objIndex); // Attach handler with confirmation
    actionCell.appendChild(removeBtn);
    row.appendChild(actionCell);

    return row;
}

// Create an individual row for each row
function createAgendaRow(agenda, agendaIndex) {
    const row = document.createElement('tr');

    // Agenda effect cell
    const agendaEffectCell = document.createElement('td');
    agendaEffectCell.textContent = agenda.effect; 
    row.appendChild(agendaEffectCell);

    // Agenda Elect cell
    const agendaElectCell = document.createElement('td');
    agendaElectCell.textContent = agenda.elect;
    row.appendChild(agendaElectCell);

    // Action cell (Remove button)
    const actionCell = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => confirmRemoveItem("Agenda", agendaIndex); // Attach handler with confirmation
    actionCell.appendChild(removeBtn);
    row.appendChild(actionCell);

    return row;
}

// Confirm and remove objective by index if user confirms
function confirmRemoveItem(mode, objIndex) {
    const confirmation = confirm(`Are you sure you want to remove this ${mode}?`);
    if (confirmation) {
        removeItem(mode, objIndex); // Proceed with removal if confirmed
    }
}

// Remove objective by index and update table
function removeItem(mode, itemIndex) {
    if (mode === "Objective") {
        const objective = objectives[itemIndex];
        objectives.splice(itemIndex, 1); // Remove objective
        updateTableRow("tableObjective", itemIndex); // Efficiently update the table
        logAction(`${mode} "${objective}" was removed by`) // Log the action for non-repudation
    } else if (mode === "Agenda") {
        const agenda = agendas[itemIndex];
        agendas.splice(itemIndex, 1); // Remove Agenda
        updateTableRow("tableAgenda", itemIndex);
        logAction(`${mode} "${agenda}" was removed by`)
    }
    saveDataToJson(mode); // Save updated data to JSON
}

// Efficiently update the table (remove a row)
function updateTableRow(tableId, rowIndex) {
    const table = document.getElementById(tableId);
    table.deleteRow(rowIndex + 1); // +1 to account for the header row
}

// Save objectives to the server (POST request)
async function saveDataToJson(type) {
    let url;
    let payload;
    if (type === "Objective") {
        url = "/ti/admin/objectives";
        payload = objectives;
    } else if (type === "Agenda") {
        url = "/ti/admin/agendas";
        payload = { "currentDisputedAgenda": agendas.currentDisputedAgenda, "currentAgendas": agendas.currentAgendas };
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload) // Send updated data
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result.message); // Log success message
    } catch (error) {
        console.error(`Error saving ${mode}s:`, error);
    }
}

// Add the new objective to the objectives table and json file
function addNewObjective(newObjectiveName) {
    if (objectives.includes(newObjectiveName)) {
        alert("Objective is already added.")
    } else {
        objectives.push(newObjectiveName);
        createTable("Objective"); // Refresh the table
        saveDataToJson("Objective"); // Save updated data to JSON file
        logAction(`Objective "${newObjectiveName}" was added by`) // Log the action for non-repudation
    }
}

// Add the new agenda to the agendas table and json file
function addNewAgenda(newAgenda) {
    // Remove "For" or "Against" from the name to search if the agenda has already been added, either its "For" or "Against" version
    let newAgendaNameStripped = newAgenda.name.replace(/ \((For|Against)\)$/, "");

    if (agendas.currentAgendas.some(agenda => agenda.name.includes(newAgendaNameStripped))) {
        alert("Agenda is already added.")
    } else {
        // Checking what the elect of the agenda is. Could be a player, scored secret objective, hazardous planet, etc. 
        if (newAgenda.elect === "Player") {
            const avatarOptions = [
            "arborec", "argent", "cabal", "creuss", "empyrean", "hacan", 
            "jolnar", "l1", "letnev", "mahact", "mentak", "muaat", 
            "naalu", "nekro", "nomad", "rokha", "saar", "sardakk", 
            "sol", "titans", "winnu", "xxcha", "yin", "yssaril"
            ]
            newElect = prompt(`Enter the faction that was elected for this Agenda from the following:\n${avatarOptions.join("\n")}`)
            // If the player did not select a faction within the list
            if (!avatarOptions.includes(newElect)) {
                alert("Entered faction is not in the list of factions.")
                return;
            } else {
                newAgenda.elect = `${UiFilesPath}${newElect}.png`;
            }
        } else if (newAgenda.elect === "Scored Secret Objective") { 
            newAgenda.elect = prompt("Enter the Secret Objective elected:")
        } else if (newAgenda.elect === "Hazardous Planet") { 
            newAgenda.elect = prompt("Enter the name of the elected Hazardous Planet elected:")
        } else if (newAgenda.elect === "Cultural Planet") {
            newAgenda.elect = prompt("Enter the name of the elected Cultural Planet elected:")
        } else if (newAgenda.elect === "Industrial Planet") {
            newAgenda.elect = prompt("Enter the name of the elected Industrial Planet elected:")
        } else if (newAgenda.elect === "Non-Home Planet Other Than Mecatol Rex") {
            newAgenda.elect = prompt("Enter the name of the Non-Home Planet Other Than Mecatol Rex elected:")
        } else if (newAgenda.elect === "Planet") {
            newAgenda.elect = prompt("Enter the name of the Planet elected:")
        } else if (newAgenda.elect === "Law") {
            newAgenda.elect = prompt("Enter the name of the Law elected:")
        } else if (newAgenda.elect === "Strategy Card") {
            newAgenda.elect = prompt("Enter the name of the Strategy Card elected:")
        } 

        agendas.currentAgendas.push(newAgenda);
        createTable("Agenda"); // Refresh the table
        saveDataToJson("Agenda"); // Save updated data to JSON file
        logAction(`Agenda "${newAgenda.name}" was added by`) // Log the action for non-repudation
    }
}

function addNewObjectiveModal() {

    // Create the modal background
    const modalOverlay = document.createElement("div");
    modalOverlay.style.position = "fixed";
    modalOverlay.style.top = "0";
    modalOverlay.style.left = "0";
    modalOverlay.style.width = "100%";
    modalOverlay.style.height = "100%";
    modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modalOverlay.style.display = "flex";
    modalOverlay.style.justifyContent = "center";
    modalOverlay.style.alignItems = "center";
    modalOverlay.style.zIndex = "1000";
  
    // Create the modal content
    const modalContent = document.createElement("div");
    modalContent.style.width = "40%";
    modalContent.style.maxHeight = "80%"; // Set max height for the modal
    modalContent.style.backgroundColor = "rgba(40, 44, 52, 1)";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "8px";
    modalContent.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    modalContent.style.position = "relative";
    modalContent.style.overflowY = "auto"; // Make modal content scrollable
    modalContent.style.animation = "slide-down 0.3s ease-out";

    // Close modal when clicking outside of the modal content
    modalOverlay.addEventListener("click", (event) => {
      if (event.target === modalOverlay) {
        document.body.removeChild(modalOverlay)
      }
    });

    // Create the modal content
    // Title
    const modalTitleT1 = document.createElement("h2");
    modalTitleT1.innerText = "Choose an Objective";
    modalContent.appendChild(modalTitleT1);

    // Tier 1 Separator
    const modalText = document.createElement("h3");
    modalText.innerText = "Tier 1";
    modalContent.appendChild(modalText);

    objectivesDataT1 = objectivesDataT1.sort();

    // Create the table element
    const tableT1 = document.createElement("table");
    tableT1.style.width = "100%";
    tableT1.style.borderCollapse = "collapse";

    // Loop through data and create rows
    objectivesDataT1.forEach((objective) => {
      const rowT1 = document.createElement("tr");

      // Objective cell
      const objectiveCellT1 = document.createElement("td");
      objectiveCellT1.innerText = objective;
      objectiveCellT1.style.padding = "8px";
      objectiveCellT1.style.border = "1px solid #ddd";
      rowT1.appendChild(objectiveCellT1);

      // Button cell
      const addBtnCellT1 = document.createElement("td");
      addBtnCellT1.style.padding = "8px";
      addBtnCellT1.style.border = "1px solid #ddd";
      addBtnCellT1.style.textAlign = "center";

      const buttonT1 = document.createElement("button");
      buttonT1.innerText = "Add";
      buttonT1.style.padding = "5px 10px";
      buttonT1.style.cursor = "pointer";
      buttonT1.onclick = () => {
            addNewObjective(objective + " (I)");
            document.body.removeChild(modalOverlay)
      };

      addBtnCellT1.appendChild(buttonT1);
      rowT1.appendChild(addBtnCellT1);

      tableT1.appendChild(rowT1);
    });

    // Append the table to the document body or a specific element
    modalContent.appendChild(tableT1);

    // Tier 2 Separator
    const modalTextT2 = document.createElement("h3");
    modalTextT2.innerText = "Tier 2";
    modalContent.appendChild(modalTextT2);

    objectivesDataT2 = objectivesDataT2.sort();

        // Create the table element
    const tableT2 = document.createElement("table");
    tableT2.style.width = "100%";
    tableT2.style.borderCollapse = "collapse";

    // Loop through data and create rows
    objectivesDataT2.forEach((objective) => {
      const rowT2 = document.createElement("tr");

      // Objective cell
      const objectiveCellT2 = document.createElement("td");
      objectiveCellT2.innerText = objective;
      objectiveCellT2.style.padding = "8px";
      objectiveCellT2.style.border = "1px solid #ddd";
      rowT2.appendChild(objectiveCellT2);

      // Button cell
      const addBtnCellT2 = document.createElement("td");
      addBtnCellT2.style.padding = "8px";
      addBtnCellT2.style.border = "1px solid #ddd";
      addBtnCellT2.style.textAlign = "center";

      const buttonT2 = document.createElement("button");
      buttonT2.innerText = "Add";
      buttonT2.style.padding = "5px 10px";
      buttonT2.style.cursor = "pointer";
      buttonT2.onclick = () => {
            addNewObjective(objective + " (II)");
            document.body.removeChild(modalOverlay)
      };

      addBtnCellT2.appendChild(buttonT2);
      rowT2.appendChild(addBtnCellT2);

      tableT2.appendChild(rowT2);
    });

    // Append the T2 table to the document body or a specific element
    modalContent.appendChild(tableT2);

    // Secret Objectives Separator
    const modalTextSO = document.createElement("h3");
    modalTextSO.innerText = "Secret Objectives";
    modalContent.appendChild(modalTextSO);

    objectivesDataSO = objectivesDataSO.sort();

    // Create the table element
    const tableSO = document.createElement("table");
    tableSO.style.width = "100%";
    tableSO.style.borderCollapse = "collapse";

    // Loop through data and create rows
    objectivesDataSO.forEach((objective) => {
      const rowSO = document.createElement("tr");

      // Objective cell
      const objectiveCellSO = document.createElement("td");
      objectiveCellSO.innerText = objective;
      objectiveCellSO.style.padding = "8px";
      objectiveCellSO.style.border = "1px solid #ddd";
      rowSO.appendChild(objectiveCellSO);

      // Button cell
      const addBtnCellSO = document.createElement("td");
      addBtnCellSO.style.padding = "8px";
      addBtnCellSO.style.border = "1px solid #ddd";
      addBtnCellSO.style.textAlign = "center";

      const buttonSO = document.createElement("button");
      buttonSO.innerText = "Add";
      buttonSO.style.padding = "5px 10px";
      buttonSO.style.cursor = "pointer";
      buttonSO.onclick = () => {
            addNewObjective(objective + " (Secret Objective)");
            document.body.removeChild(modalOverlay)
      };

      addBtnCellSO.appendChild(buttonSO);
      rowSO.appendChild(addBtnCellSO);

      tableSO.appendChild(rowSO);
    });

    // Append the SO table to the document body or a specific element
    modalContent.appendChild(tableSO);

    // Create the close button
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "&times;";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.fontSize = "24px";
    closeButton.style.fontWeight = "bold";
    closeButton.style.cursor = "pointer";
    closeButton.style.color = "rgba(255, 255, 255, 1)";
    closeButton.addEventListener("click", () => document.body.removeChild(modalOverlay));
  
    // Add close button hover effect
    closeButton.addEventListener("mouseenter", () => closeButton.style.color = "#ff6b6b");
    closeButton.addEventListener("mouseleave", () => closeButton.style.color = "#333");

    // Append elements to modal content
    modalContent.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);

    // Append the modal to the body
    document.body.appendChild(modalOverlay);

    // Add animation with JavaScript keyframes
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes slide-down {
        from {
          transform: translateY(-20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    
}

function addNewAgendaModal() {

    // Create the modal background
    const modalOverlay = document.createElement("div");
    modalOverlay.style.position = "fixed";
    modalOverlay.style.top = "0";
    modalOverlay.style.left = "0";
    modalOverlay.style.width = "100%";
    modalOverlay.style.height = "100%";
    modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modalOverlay.style.display = "flex";
    modalOverlay.style.justifyContent = "center";
    modalOverlay.style.alignItems = "center";
    modalOverlay.style.zIndex = "1000";
  
    // Create the modal content
    const modalContent = document.createElement("div");
    modalContent.style.width = "80%";
    modalContent.style.maxHeight = "80%"; // Set max height for the modal
    modalContent.style.backgroundColor = "rgba(40, 44, 52, 1)";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "8px";
    modalContent.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    modalContent.style.position = "relative";
    modalContent.style.overflowY = "auto"; // Make modal content scrollable
    modalContent.style.animation = "slide-down 0.3s ease-out";

    // Close modal when clicking outside of the modal content
    modalOverlay.addEventListener("click", (event) => {
      if (event.target === modalOverlay) {
        document.body.removeChild(modalOverlay)
      }
    });

    // Create the modal content
    // Title
    const modalTitleLaw = document.createElement("h2");
    modalTitleLaw.innerText = "Choose an Agenda";
    modalContent.appendChild(modalTitleLaw);

    // Laws Separator
    const modalText = document.createElement("h3");
    modalText.innerText = "Laws";
    modalContent.appendChild(modalText);

    // Laws list
    let laws = [
        { "name":"Anti-Intellectual Revolution (For)", "elect":"", "effect":"After a player researches a technology, they must destroy 1 of their non-fighter ships." },
        { "name":"Anti-Intellectual Revolution (Against)", "elect":"", "effect":"At the start of the next strategy phase, each player chooses and exhausts 1 planet for each technology they own." },
        { "name": "Articles of War (For)", "elect": "", "effect": "All mechs lose their printed abilities except for SUSTAIN DAMAGE." },
        { "name": "Articles of War (Against)", "elect": "", "effect": "Each player that voted \"For\" gains 3 trade goods." },
        { "name": "Checks and Balances (For)", "elect": "", "effect": "When a player chooses a strategy card during the strategy phase, they give that strategy card to another player that does not have 1 (or a player that does not have 2 in a three- or four-player game), if able." },
        { "name": "Checks and Balances (Against)", "elect": "", "effect": "Each player readies only 3 of their planets at the end of this agenda phase." },
        { "name":"Classified Document Leaks", "elect":"Scored Secret Objective", "effect":"When this agenda is revealed, if there are no scored secret objectives, discard this card and reveal another agenda from the top of the deck.\nThe elected secret objective becomes a public objective; place it near the other public objectives in the common play area." },
        { "name":"Committee Formation", "elect":"Player", "effect":"The elected player gains this card. Before players vote on an agenda that requires a player to be elected, the owner of this card may discard this card to choose a player to be elected. Players do not vote on that agenda." },
        { "name":"Conventions of War (For)", "elect":"", "effect":"Players cannot use BOMBARDMENT against units that are on cultural planets." },
        { "name":"Conventions of War (Against)", "elect":"", "effect":"Each player that voted \"Against\" discards all of their action cards." },
        //{ "name":"Core Mining", "elect":"Hazardous Planet", "effect":"Attach this card to the elected planet's card. Then, destroy 1 infantry on the planet. The resource value of this planet is increased by 2." },
        //{ "name":"Demilitarized Zone", "elect":"Planet", "effect":"Attach this card to the elected planet's card. Then, destroy all units on that planet. Player's units cannot land, be produced, or be placed on this planet." },
        { "name":"Enforced Travel Ban (For)", "elect":"", "effect":"Alpha and beta wormholes have no effect during movement." },
        { "name":"Enforced Travel Ban (Against)", "elect":"", "effect":"Destroy each PDS in or adjacent to a system that contains a wormhole." },
        { "name":"Executive Sanctions (For)", "elect":"", "effect":"Each player can have a maximum of 3 action cards in their hand." },
        { "name":"Executive Sanctions (Against)", "elect":"", "effect":"Each player discards 1 random action card from their hand." },
        { "name":"Fleet Regulations (For)", "elect":"", "effect":"Each player cannot have more than 4 tokens in their fleet pool." },
        { "name":"Fleet Regulations (Against)", "elect":"", "effect":"Each player places 1 command token from their reinforcements in their fleet pool." },
        //{ "name":"Holy Planet of Ixth", "elect":"Planet", "effect":"Attach this card to the elected planet's card. The planet's owner gains 1 victory point. Units on this planet cannot use PRODUCTION. When a player gains control of this planet, they gain 1 victory point. When a player loses control of this planet, they lose 1 victory point." },
        { "name":"Homeland Defense Act (For)", "elect":"", "effect":"Each player can have any number of PDS units on planets they control." },
        { "name":"Homeland Defense Act (Against)", "elect":"", "effect":"Each player destroys 1 of their PDS unit." },
        { "name":"Imperial Arbiter", "elect":"Player", "effect":"The elected player gains this card. At the end of the strategy phase, the owner of this card may discard this card to swap 1 of their strategy cards with 1 of another player's strategy cards." },
        { "name":"Minister of Commerce", "elect":"Player", "effect":"The elected player gains this card. After the owner of this card replenishes commodities, they gain 1 trade good for each player that is their neighbor." },
        { "name":"Minister of Exploration", "elect":"Player", "effect":"The elected player gains this card. When the owner of this card gains control of a planet, they gain 1 trade good." },
        { "name":"Minister of Industry", "elect":"Player", "effect":"The elected player gains this card. When the owner of this card places a space dock in a system, their units in that system may use their PRODUCTION abilities." },
        { "name":"Minister of Peace", "elect":"Player", "effect":"The elected player gains this card. After a player activates a system that contains 1 or more of a different player's units, the owner of this card may discard this card; immediately end the active player's turn." },
        { "name":"Minister of Policy", "elect":"Player", "effect":"The elected player gains this card. At the end of the status phase, the owner of this card draws 1 action card." },
        { "name":"Minister of Sciences", "elect":"Player", "effect":"The elected player gains this card. When the owner of this card resolves the primary or secondary ability of the \"Technology\" strategy card, they do not need to spend resources to research technology." },
        { "name":"Minister of War", "elect":"Player", "effect":"The elected player gains this card. The owner of this card may discard this card after performing an action to remove 1 of their command counters from the game board and return it to their reinforcements; then they may perform 1 additional action." },
        { "name":"Nexus Sovereignty (For)", "elect": "", "effect": "Alpha and beta wormholes in the wormhole nexus have no effect during movement." },
        { "name":"Nexus Sovereignty (Against)", "elect": "", "effect": "Place a gamma wormhole token in the Mecatol Rex system." },
        { "name": "Political Censure", "elect": "Player", "effect": "The elected player gains this card and 1 victory point.\nThe elected player cannot play action cards.\nIf the owner of this card loses this card, they lose 1 victory point." },
        { "name":"Prophecy of Ixth", "elect":"Player", "effect":"The elected player gains this card. The owner of this card applies +1 to the result of their fighter's combat rolls. When the owner of this card uses PRODUCTION, they discard this card unless they produce 2 or more fighters." },
        { "name":"Publicize Weapon Schematics (For)", "elect":"", "effect":"If any player owns a war sun technology, all players may ignore all prerequisites on war sun technologies. All war suns lose SUSTAIN DAMAGE." },
        { "name":"Publicize Weapon Schematics (Against)", "elect":"", "effect":"Each player that owns a war sun technology discards all of their action cards." },
        { "name":"Regulated Conscription (For)", "elect":"", "effect":"When a player produces units, they produce only 1 fighter and infantry for its cost instead of 2." },
        { "name":"Regulated Conscription (Against)", "elect":"", "effect":"No effect." },
        //{ "name":"Representative Government (For)", "elect":"", "effect":"Players cannot exhaust planets to cast votes during the agenda phase. Each player may cast 1 vote on each agenda instead." },
        //{ "name":"Representative Government (Against)", "elect":"", "effect":"At the start of the next strategy phase, each player that voted \"Against\" exhausts all of their cultural planets." },
        { "name": "Representative Government (For)", "elect": "", "effect": "Players cannot exhaust planets to cast votes during the agenda phase; each player may cast 1 vote on each agenda instead. Players cannot cast additional votes." },
        { "name": "Representative Government (Against)", "elect": "", "effect": "At the start of the next strategy phase, each player that voted \"Against\" exhausts all of their cultural planets." },
        //{ "name":"Research Team: Biotic", "elect":"Industrial Planet", "effect":"Attach this card to the elected planet's card. When the owner of this planet researches technology, they may exhaust this card to ignore 1 green prerequisite." },
        //{ "name":"Research Team: Cybernetic ", "elect":"Industrial Planet", "effect":"Attach this card to the elected planet's card. When the owner of this planet researches technology, they may exhaust this card to ignore 1 yellow prerequisite." },
        //{ "name":"Research Team: Propulsion", "elect":"Industrial Planet", "effect":"Attach this card to the elected planet's card. When the owner of this planet researches technology, they may exhaust this card to ignore 1 blue prerequisite." },
        //{ "name":"Research Team: Warfare", "elect":"Hazardous Planet ", "effect":"Attach this card to the elected planet's card. When the owner of this planet researches technology, they may exhaust this card to ignore 1 red prerequisite." },
        //{ "name":"Senate Sanctuary", "elect":"Planet", "effect":"Attach this card to the elected planet's card. The influence value of this planet is increased by 2." },
        //{ "name":"Shard of the Throne", "elect":"Planet", "effect":"The elected player gains this card and 1 victory point. A player gains this card and 1 victory point when they win a combat against the owner of this card. Then, the previous owner of this card loses 1 victory point." },
        { "name":"Search Warrant", "elect":"Player", "effect": "The elected player gains this card and draws 2 secret objectives.\nThe owner of this card plays with their secret objectives revealed."},
        { "name":"Shared Research (For)", "elect":"", "effect":"Each player's units can move through nebulae." },
        { "name":"Shared Research (Against)", "elect":"", "effect":"Each player places a command token from their reinforcements in their home system, if able." },
        //{ "name":"Terraforming Initiative", "elect":"Hazardous Planet", "effect":"Attach this card to the elected planet's card. The resource and influence values of this planet are increased by 1." },
        //{ "name":"The Crown of Emphidia", "elect":"Player", "effect":"The elected player gains this card and 1 victory point. A player gains this card and 1 victory point after they gain control of a planet in the home system of this card's owner. Then, the previous owner of this card loses 1 victory point." },
        //{ "name":"The Crown of Thalnos", "elect":"Player", "effect":"The elected player gains this card. During each combat round, the owner of this card may reroll any number of dice; they must destroy each of their units that did not produce a hit with its reroll." },
        { "name":"Wormhole Reconstruction (For)", "elect":"", "effect":"All systems that contain either an alpha or beta wormhole are adjacent to each other." },
        { "name":"Wormhole Reconstruction (Against)", "elect":"", "effect":"Each player places a command token from their reinforcements in each system that contains a wormhole and 1 or more of their ships." },
    ]

    // Create the table element
    const tableLaws = document.createElement("table");
    tableLaws.style.width = "100%";
    tableLaws.style.borderCollapse = "collapse";

    // Loop through data and create rows
    laws.forEach((law) => {
      const rowLaw = document.createElement("tr");

      // Law name cell
      const cellLawName = document.createElement("td");
      cellLawName.innerText = law.name;
      cellLawName.style.padding = "8px";
      cellLawName.style.border = "1px solid #ddd";
      rowLaw.appendChild(cellLawName);

      // Law elect cell
      const cellLawElect = document.createElement("td");
      cellLawElect.innerText = law.elect;
      cellLawElect.style.padding = "8px";
      cellLawElect.style.border = "1px solid #ddd";
      rowLaw.appendChild(cellLawElect);

      // Law effect cell
      const cellLawEffect = document.createElement("td");
      cellLawEffect.innerText = law.effect;
      cellLawEffect.style.padding = "8px";
      cellLawEffect.style.border = "1px solid #ddd";
      rowLaw.appendChild(cellLawEffect);

      // Button cell
      const addBtnCellLaw = document.createElement("td");
      addBtnCellLaw.style.padding = "8px";
      addBtnCellLaw.style.border = "1px solid #ddd";
      addBtnCellLaw.style.textAlign = "center";

      const buttonLaw = document.createElement("button");
      buttonLaw.innerText = "Add";
      buttonLaw.style.padding = "5px 10px";
      buttonLaw.style.cursor = "pointer";
      buttonLaw.onclick = () => {
            addNewAgenda(law);
            document.body.removeChild(modalOverlay)
      };

      addBtnCellLaw.appendChild(buttonLaw);
      rowLaw.appendChild(addBtnCellLaw);

      tableLaws.appendChild(rowLaw);
    });

    // Append the table to the document body or a specific element
    modalContent.appendChild(tableLaws);

    // Directives Separator
    const modalTextDir = document.createElement("h3");
    modalTextDir.innerText = "Directives";
    modalContent.appendChild(modalTextDir);

    // Directives list
    let directives = [
        { "name":"Archived Secret", "elect":"Player", "effect":"Elected player draws 1 secret objective." },
        { "name":"Arms Reduction (For)", "elect":"", "effect":"Each player destroys all but 2 of their dreadnaughts and all but 4 of their cruisers." },
        { "name":"Arms Reduction (Against)", "elect":"", "effect":"At the start of the next strategy phase, each player exhausts each of their planets that have a technology specialty." },
        { "name":"Colonial Redistribution", "elect":"Non-Home Planet Other Than Mecatol Rex", "effect":"Destroy each unit on the elected planet. Then, the player who controls that planet chooses 1 player with the fewest victory points; that player may place 1 infantry from their reinforcements on the elected planet." },
        { "name":"Compensated Disarmament", "elect":"Planet", "effect":"Destroy each ground force on the elected planet; for each unit that was destroyed, the player who controls that planet gains 1 trade good." },
        { "name":"Economic Equality (For)", "elect":"", "effect":"Each player returns all of their trade goods to the supply. Then, each player gains 5 trade goods." },
        { "name":"Economic Equality (Against)", "elect":"", "effect":"Each player returns all of their trade goods to the supply." },
        { "name":"Incentive Program (For)", "elect":"", "effect":"Draw and reveal 1 stage I public objective from the deck and place it near the public objectives." },
        { "name":"Incentive Program (Against)", "elect":"", "effect":"Draw and reveal 1 stage II public objective from the deck and place it near the public objectives." },
        { "name":"Ixthian Artifact (For)", "elect":"", "effect":"The speaker rolls 1 die. If the result is 6-10, each player may research 2 technologies. If the result is 1-5, destroy all units in Mecatol Rex's system, and each player with units in systems adjacent to Mecatol Rex's system destroys 3 of their units in each of those systems." },
        { "name":"Ixthian Artifact (Against)", "elect":"", "effect":"No effect." },
        { "name":"Judicial Abolishment", "elect":"Law", "effect":"When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck. Discard the elected law from play." },
        { "name":"Miscount Disclosed", "elect":"Law", "effect":"When this agenda is revealed, if there are no laws in play, discard this card and reveal another agenda from the top of the deck. Vote on the elected law as if it were just revealed from the top of the deck." },
        { "name":"Mutiny (For)", "elect":"", "effect":"Each player who voted \"For\" gains 1 victory point." },
        { "name":"Mutiny (Against)", "elect":"", "effect":"Each player who voted \"For\" loses 1 victory point." },
        { "name":"New Constitution (For)", "elect":"", "effect":"Discard all laws in play. At the start of the next strategy phase, each player exhausts each planet in their home system." },
        { "name":"New Constitution (Against)", "elect":"", "effect":"No effect." },
        { "name":"Public Execution", "elect":"Player", "effect":"The elected player discards all of their action cards. If they have the speaker token, they give it to the player on their left. The elected player cannot vote on any agendas during this agenda phase." },
        { "name":"Seed of an Empire (For)", "elect":"", "effect":"The player with most victory points gains 1 victory point." },
        { "name":"Seed of an Empire (Against)", "elect":"", "effect":"The player with the fewest victory points gains 1 victory point." },
        { "name":"Swords to Plowshares (For)", "elect":"", "effect":"Each player destroys half of their infantry on each planet they control, rounded up. Then, each player gains trade goods equal to the number of their infantry that were destroyed." },
        { "name":"Swords to Plowshares (Against)", "elect":"", "effect":"Each player places 1 infantry from their reinforcements on each planet they control." },
        { "name":"Unconventional Measures (For)", "elect":"", "effect":"Each player that voted \"For\" draws 2 action cards." },
        { "name":"Unconventional Measures (Against)", "elect":"", "effect":"Each player that voted \"For\" discards all of their action cards." },
        { "name":"Wormhole Research (For)", "elect":"", "effect":"Each player who has 1 or more ships in a system that contains a wormhole may research 1 technology. Then, destroy all ships in systems that contain an alpha or beta wormhole." },
        { "name":"Wormhole Research (Against)", "elect":"", "effect":"Each player that voted \"Against\" removes 1 command token from their command sheet and returns it to their reinforcements." },
        { "name":"Armed Forces Standardization", "elect":"Player", "effect":"The elected player places command tokens from their reinforcements so that they have 3 tokens in their tactic pool, 3 tokens in their fleet pool and 2 tokens in their strategy pool. They return any excess tokens to their reinforcements." },
    ]

    // Create the table element
    const tableDir = document.createElement("table");
    tableDir.style.width = "100%";
    tableDir.style.borderCollapse = "collapse";

    // Loop through data and create rows
    directives.forEach((directive) => {
      const rowDir = document.createElement("tr");

      // Directive name Cell 
      const cellDirName = document.createElement("td");
      cellDirName.innerText = directive.name;
      cellDirName.style.padding = "8px";
      cellDirName.style.border = "1px solid #ddd";
      rowDir.appendChild(cellDirName);

      // Directive elect Cell 
      const cellDirElect = document.createElement("td");
      cellDirElect.innerText = directive.elect;
      cellDirElect.style.padding = "8px";
      cellDirElect.style.border = "1px solid #ddd";
      rowDir.appendChild(cellDirElect);

      // Directive effect Cell 
      const cellDirEffect = document.createElement("td");
      cellDirEffect.innerText = directive.effect;
      cellDirEffect.style.padding = "8px";
      cellDirEffect.style.border = "1px solid #ddd";
      rowDir.appendChild(cellDirEffect);

      // Button cell
      const addBtnCellDir = document.createElement("td");
      addBtnCellDir.style.padding = "8px";
      addBtnCellDir.style.border = "1px solid #ddd";
      addBtnCellDir.style.textAlign = "center";

      const buttonDir = document.createElement("button");
      buttonDir.innerText = "Add";
      buttonDir.style.padding = "5px 10px";
      buttonDir.style.cursor = "pointer";
      buttonDir.onclick = () => {
            addNewAgenda(directive);
            document.body.removeChild(modalOverlay)
      };

      addBtnCellDir.appendChild(buttonDir);
      rowDir.appendChild(addBtnCellDir);

      tableDir.appendChild(rowDir);
    });

    // Append the T2 table to the document body or a specific element
    modalContent.appendChild(tableDir);

    // Create the close button
    const closeButton = document.createElement("span");
    closeButton.innerHTML = "&times;";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.fontSize = "24px";
    closeButton.style.fontWeight = "bold";
    closeButton.style.cursor = "pointer";
    closeButton.style.color = "rgba(255, 255, 255, 1)";
    closeButton.addEventListener("click", () => document.body.removeChild(modalOverlay));
  
    // Add close button hover effect
    closeButton.addEventListener("mouseenter", () => closeButton.style.color = "#ff6b6b");
    closeButton.addEventListener("mouseleave", () => closeButton.style.color = "#333");

    // Append elements to modal content
    modalContent.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);

    // Append the modal to the body
    document.body.appendChild(modalOverlay);

    // Add animation with JavaScript keyframes
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes slide-down {
        from {
          transform: translateY(-20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    
}

function addRandomObjective(type) {
    let availableObjectives;
    if (type === "T1") {
        // Filter the available T1 objectives to exclude objectives already in play
        availableObjectives = objectivesDataT1.filter(item => !objectives.includes(`${item} (I)`));
        const randomIndex = Math.floor(Math.random() * availableObjectives.length);
        addNewObjective(`${availableObjectives[randomIndex]} (I)`);
        console.log(`Added random T1 objective: ${availableObjectives[randomIndex]}`);
    } else if (type === "T2") {
        // Filter the available T2 objectives to exclude objectives already in play
        availableObjectives = objectivesDataT2.filter(item => !objectives.includes(`${item} (II)`));
        const randomIndex = Math.floor(Math.random() * availableObjectives.length);
        addNewObjective(`${availableObjectives[randomIndex]} (II)`);
        console.log(`Added random T2 objective: ${availableObjectives[randomIndex]}`);
    }
}

function agendaPhaseOptions() {

    // Create the modal background
    const modalOverlay = document.createElement("div");
    modalOverlay.style.position = "fixed";
    modalOverlay.style.top = "0";
    modalOverlay.style.left = "0";
    modalOverlay.style.width = "100%";
    modalOverlay.style.height = "100%";
    modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    modalOverlay.style.display = "flex";
    modalOverlay.style.justifyContent = "center";
    modalOverlay.style.alignItems = "center";
    modalOverlay.style.zIndex = "1000";
  
    // Create the modal content
    const modalContent = document.createElement("div");
    modalContent.style.width = "40%";
    modalContent.style.maxHeight = "80%"; // Set max height for the modal
    modalContent.style.backgroundColor = "rgba(40, 44, 52, 1)";
    modalContent.style.padding = "20px";
    modalContent.style.borderRadius = "8px";
    modalContent.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    modalContent.style.position = "relative";
    modalContent.style.overflowY = "auto"; // Make modal content scrollable
    modalContent.style.animation = "slide-down 0.3s ease-out";

    // Close modal when clicking outside of the modal content
    modalOverlay.addEventListener("click", (event) => {
      if (event.target === modalOverlay) {
        document.body.removeChild(modalOverlay)
      }
    });

    // Create the modal content
    // Title
    const modalTitleT1 = document.createElement("h2");
    modalTitleT1.textContent = "Agenda Phase Options";
    modalContent.appendChild(modalTitleT1);

    // Current Disputed Agenda Title
    const disputedAgendaTitle = document.createElement("h3");
    disputedAgendaTitle.textContent = "Current Disputed Agenda";
    modalContent.appendChild(disputedAgendaTitle);

    // Current Disputed Agenda text box
    const disputedAgenda = document.createElement("p");
    if (agendas.currentDisputedAgenda === "") {
        disputedAgenda.textContent = "No currently disputed agenda.";
    } else {
        disputedAgenda.textContent = `${agendas.currentDisputedAgenda.name}: ${agendas.currentDisputedAgenda.description}`;
        disputedAgenda.style.width = "100%";
    }
    modalContent.appendChild(disputedAgenda);

    // Generate Random New Disputed Agenda Button
    const changeDisputedAgendaButton = document.createElement("button");
    changeDisputedAgendaButton.textContent = "Change Disputed Agenda";
    changeDisputedAgendaButton.style.width = "100%";
    changeDisputedAgendaButton.onclick = () => {
        randomAgenda = agendasData[Math.floor(Math.random() * agendasData.length)];
        changeDisputedAgenda(randomAgenda);
        disputedAgenda.textContent = `${agendas.currentDisputedAgenda.name}: ${agendas.currentDisputedAgenda.description}`;
    };
    modalContent.appendChild(changeDisputedAgendaButton);

    // Clear Disputed Agendas Button
    const clearDisputedAgendasButton = document.createElement("button");
    clearDisputedAgendasButton.textContent = "Clear Disputed Agendas";
    clearDisputedAgendasButton.style.width = "100%";
    clearDisputedAgendasButton.onclick = () => {
        changeDisputedAgenda("");
        disputedAgenda.textContent = "No currently disputed agenda.";
    }
    modalContent.appendChild(clearDisputedAgendasButton);

    // Pass FOR Agenda Button
    const passForAgendaButton = document.createElement("button");
    passForAgendaButton.textContent = "Pass \"For\" Agenda";
    passForAgendaButton.style.width = "100%";
    passForAgendaButton.onclick = () => {
        alert("Not yet implemented. Add the Agenda manually.");
    }
    modalContent.appendChild(passForAgendaButton);

    // Pass AGAINST Agenda Button
    const passAgainstAgendaButton = document.createElement("button");
    passAgainstAgendaButton.textContent = "Pass \"Against\" Agenda";
    passAgainstAgendaButton.style.width = "100%";
    passAgainstAgendaButton.onclick = () => {
        alert("Not yet implemented. Add the Agenda manually.");
    }
    modalContent.appendChild(passAgainstAgendaButton);

    // Add modal to document body
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
};

// Changes the current disputed agenda with the given value
function changeDisputedAgenda(newAgenda) {
    agendas.currentDisputedAgenda = newAgenda;
    saveDataToJson("Agenda");
};

// Load objectives and create table
loadDataFromFile("Objective", objectivesFileUrl).then(() => {
    createTable("Objective"); // Populate the table with loaded objectives
});

// Load agendas and create table
loadDataFromFile("Agenda", agendasFileUrl).then(() => {
    createTable("Agenda"); // Populate the table with loaded agendas
})

// Add event listener for "Add Objective" button
document.getElementById('addObjectiveBtn').addEventListener('click', addNewObjectiveModal);

// Add event listeners for the "Add Random Objective" buttons
document.getElementById('addRandomT1ObjectiveBtn').addEventListener('click', () => {
    addRandomObjective("T1")
});
document.getElementById('addRandomT2ObjectiveBtn').addEventListener('click', () => {
    addRandomObjective("T2")
});

// Add event listener for the "Draw Random Agenda" button
document.getElementById('agendaPhaseOptionsBtn').addEventListener('click', agendaPhaseOptions);

// Add event listener for "Add Agenda" button
document.getElementById('addAgendaBtn').addEventListener('click', addNewAgendaModal);

// Add event listener for "Back to Menu" button
document.getElementById('backToMenuBtn').addEventListener('click', function() {
    window.location.href = '/ti/admin';
});
