async function updateAgendaPhaseBody() {
    let agendaPhaseBody = document.getElementById("agendaPhaseBody");

    // Clear current HTML
    agendaPhaseBody.innerHTML = "";

    // Create current agenda being resolved box
    const newAgendaBox = document.createElement("div");
    newAgendaBox.style.position = "absolute";
    newAgendaBox.style.left = "50%";
    newAgendaBox.style.top = "20%";
    newAgendaBox.style.width = "90%";
    newAgendaBox.style.height = "30%";
    newAgendaBox.style.translate = "-50%";
    newAgendaBox.style.borderRadius = "30px";
    newAgendaBox.style.backgroundColor = "rgba(150, 150, 150, 1)";

    const newAgendaTitle = document.createElement("h2");
    newAgendaTitle.textContent = `${agendas.currentDisputedAgenda.name} (${agendas.currentDisputedAgenda.type})`;
    newAgendaTitle.style.fontSize = "2vw";
    newAgendaBox.appendChild(newAgendaTitle);

    const newAgendaDescription = document.createElement("p");
    newAgendaDescription.textContent = agendas.currentDisputedAgenda.description;
    newAgendaDescription.style.fontSize = "1.2vw";
    newAgendaBox.appendChild(newAgendaDescription);

    agendaPhaseBody.appendChild(newAgendaBox);

    // Create the players box
    const playersBox = document.createElement("div");
    playersBox.style.position = "absolute";
    playersBox.style.left = "50%";
    playersBox.style.top = "52%";
    playersBox.style.width = "90%";
    playersBox.style.height = "30%";
    playersBox.style.translate = "-50%";
    playersBox.style.borderRadius = "30px";
    playersBox.style.backgroundColor = "rgba(150, 150, 150, 1)";

    const playersTable = document.createElement("table");
    playersTable.style.position = "absolute";
    playersTable.style.width = "100%";
    playersTable.style.borderCollapse = "collapse";
    playersTable.style.fontSize = "1vw";
    playersTable.style.textAlign = "center";
    playersTable.style.tableLayout = "fixed"; 

    const playersTbody = document.createElement("tbody");

    // Create all rows
    const playersSpeakerTr = document.createElement("tr");
    const playersAbstainTr = document.createElement("tr");
    const playersScoreTr = document.createElement("tr");
    const playersAvatarTr = document.createElement("tr");
    const playersNameTr = document.createElement("tr");
    const playersForTr = document.createElement("tr");
    const playersAgainstTr = document.createElement("tr");
    const playersRiderTr = document.createElement("tr");
    const playersElectTr = document.createElement("tr");

    players.forEach(player => {
        // Create Speaker Cell
        const playersSpeakerTd = document.createElement("td");
        if (player.speaker) {
            playersSpeakerTd.innerHTML = "SPEAKER";
        } else {
            playersSpeakerTd.innerHTML = "&nbsp;";
        };
        playersSpeakerTr.appendChild(playersSpeakerTd);

        // Create Abstain Cell 
        const playersAbstainTd = document.createElement("td");
        if (player.abstain) {
            playersAbstainTd.innerHTML = "ABSTAINING";
        } else {
            playersAbstainTd.innerHTML = "&nbsp;";
        }
        playersAbstainTr.appendChild(playersAbstainTd);

        // Create Score Cell
        const playerScoreTd = document.createElement("td");
        playerScoreTd.innerHTML = player.points;
        playersScoreTr.appendChild(playerScoreTd);

        // Create Avatar Image Cell
        const playersAvatarTd = document.createElement("td");
        const playersAvatarTdImg = document.createElement("img");
        playersAvatarTdImg.src = player.avatar;
        playersAvatarTdImg.classList.add("avatar");
        playersAvatarTd.appendChild(playersAvatarTdImg);
        playersAvatarTr.appendChild(playersAvatarTd);

        // Create Name Cell
        const playersNameTd = document.createElement("td");
        playersNameTd.textContent = player.name;
        playersNameTr.appendChild(playersNameTd);

        // Create "For" Cell
        const playersForTd = document.createElement("td");
        if (player.abstain || player.rider !== "None") {
            playersForTd.innerHTML = "&nbsp;";
        } else if (agendas.currentDisputedAgenda.elect !== '-') { 
            playersForTd.innerHTML = `VOTES: ${player.for}`;
        } else {
            playersForTd.innerHTML = `FOR: ${player.for}`;
        }
        playersForTr.appendChild(playersForTd);

        // Create "Against" Cell
        const playersAgainstTd = document.createElement("td");
        if (player.abstain || player.rider !== "None" || agendas.currentDisputedAgenda.elect !== '-') {
            playersAgainstTd.innerHTML = "&nbsp;";
        } else {
            playersAgainstTd.innerHTML = `AGAINST: ${player.against}`;
        }
        playersAgainstTr.appendChild(playersAgainstTd);
        
        // Create Rider Cell
        const playersRiderTd = document.createElement("td");
        if (player.rider !== "None") {
            playersRiderTd.innerHTML = `RIDER: ${player.rider}`;
        } else {
            playersRiderTd.innerHTML = "&nbsp;";
        }
        playersRiderTr.appendChild(playersRiderTd);

        // Create Elect Cell
        const playersElectTd = document.createElement("td");
        if (agendas.currentDisputedAgenda.elect !== "-") {
            playersElectTd.innerHTML = `Elect: ${player.elect}`;
        } else {
            playersElectTd.innerHTML = "&nbsp;";
        }
        playersElectTr.appendChild(playersElectTd);
    })
    playersTbody.appendChild(playersSpeakerTr);
    playersTbody.appendChild(playersAbstainTr);
    playersTbody.appendChild(playersScoreTr);
    playersTbody.appendChild(playersAvatarTr);
    playersTbody.appendChild(playersNameTr);
    playersTbody.appendChild(playersForTr);
    playersTbody.appendChild(playersAgainstTr);
    playersTbody.appendChild(playersRiderTr);
    playersTbody.appendChild(playersElectTr);

    playersTable.appendChild(playersTbody);
    playersBox.appendChild(playersTable);
    agendaPhaseBody.appendChild(playersBox);

    // Create Bottom Vote Total Box
    const voteTotalBox = document.createElement("div");
    voteTotalBox.style.position = "absolute";
    voteTotalBox.style.left = "50%";
    voteTotalBox.style.top = "84%";
    voteTotalBox.style.width = "90%";
    voteTotalBox.style.height = "14%";
    voteTotalBox.style.translate = "-50%";
    voteTotalBox.style.borderRadius = "30px";
    voteTotalBox.style.backgroundColor = "rgba(150, 150, 150, 1)";

    const voteTotalTable = document.createElement("table");
    voteTotalTable.style.width = "100%";
    voteTotalTable.style.height = "100%";
    voteTotalTable.style.textAlign = "center";
    const voteTotalTableTbody = document.createElement("tbody");

    // Create Total For and Against Votes if the disputed agenda is a for/against
    if (agendas.currentDisputedAgenda.elect === "-") {
        voteTotalTable.style.fontSize = "3vw";
        // Get total for and against votes
        let totalFor = 0;
        let totalAgainst = 0;
        players.forEach(player => {
            totalFor += player.for;
            totalAgainst += player.against;
        })

        // One row, with one column being For, and the other being Against
        const forAgainstTr = document.createElement("tr");

        const forTd = document.createElement("td");
        forTd.textContent = `FOR: ${totalFor}`;
        forAgainstTr.appendChild(forTd);

        const againstTd = document.createElement("td");
        againstTd.textContent = `AGAINST: ${totalAgainst}`;
        forAgainstTr.appendChild(againstTd);

        voteTotalTableTbody.appendChild(forAgainstTr);
    } else if (agendas.currentDisputedAgenda.elect !== "-") { // Create Total Elect Votes
        const electsTr = document.createElement("tr");

        // Get Unique Elects
        let uniqueElects = [];
        players.forEach(player => {
            if (!uniqueElects.includes(player.elect) && player.elect !== "None") { // If the players elect is NOT already in the unique elements array, add it
                uniqueElects.push(player.elect);
            }
        });

        // Scale font size with the amount of elements
        const adaptiveFont = 3-(0.2*uniqueElects.length);
        voteTotalTable.style.fontSize = `${adaptiveFont}vw`;

        // For every elect, collect votes and create a cell in the table
        uniqueElects.forEach(elect => {
            let electVotes = 0;
            players.forEach(player => {
                if (player.elect === elect) {
                    electVotes += player.for;
                }
            });

            const electTd = document.createElement("td");
            electTd.innerHTML = `${elect}: ${electVotes}`;
            electsTr.appendChild(electTd);
        });
        voteTotalTableTbody.appendChild(electsTr);
    }

    voteTotalTable.appendChild(voteTotalTableTbody);
    voteTotalBox.appendChild(voteTotalTable);
    agendaPhaseBody.appendChild(voteTotalBox);
}

updateAgendaPhaseBody();
setInterval(updateAgendaPhaseBody, 2000);