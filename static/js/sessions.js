async function fetchData(file) {
    const response = await fetch(file)
    const data = await response.json();
    return data
};

async function createTable() {
    // Fetch sessions file
    data = await fetchData(sessionsFileUrl);

    // Create the table
    const table = document.createElement("table");
    table.style.borderCollapse = "collapse";
    table.style.width = "80%";
    table.style.position = "relative";
    table.style.marginTop = "1%";
    table.style.marginBottom = "1%";
    table.style.translate = "-50% 0%";
    table.style.left = "50%";

    // Generate the header row with clickable header cells
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Game header
    const gameTh = document.createElement('th');
    gameTh.textContent = "Game"
    gameTh.style.width = "25%";
    gameTh.style.fontSize = "2vw";
    gameTh.style.border = "0.1vw solid black";
    gameTh.style.padding = "1vw";
    gameTh.style.textAlign = "center";
    gameTh.style.backgroundColor = "rgba(0, 0, 255, 1)";
    gameTh.style.color = "rgba(255, 255, 255, 1)";
    gameTh.style.cursor = "pointer";
    gameTh.style.position = "relative";

    const gameDirectionArrow = document.createElement("span");
    gameDirectionArrow.textContent = ""; // Start with no arrow
    gameDirectionArrow.style.position = "absolute";
    gameDirectionArrow.style.right = "10%";
    gameDirectionArrow.style.top = "5%";
    gameDirectionArrow.style.fontSize = "3vw";
    
    gameTh.appendChild(gameDirectionArrow);
    gameTh.addEventListener("click", () => sortTable("0", "Game", gameDirectionArrow));
    headerRow.appendChild(gameTh);

    // Winner header
    const winnerTh = document.createElement('th');
    winnerTh.textContent = "Winner"
    winnerTh.style.width = "50%";
    winnerTh.style.fontSize = "2vw";
    winnerTh.style.border = "0.1vw solid black";
    winnerTh.style.padding = "1vw";
    winnerTh.style.textAlign = "center";
    winnerTh.style.backgroundColor = "rgba(0, 0, 255, 1)";
    winnerTh.style.color = "rgba(255, 255, 255, 1)";
    winnerTh.style.cursor = "pointer";
    winnerTh.style.position = "relative";

    const winnerDirectionArrow = document.createElement("span");
    winnerDirectionArrow.textContent = ""; // Start with no arrow
    winnerDirectionArrow.style.position = "absolute";
    winnerDirectionArrow.style.right = "10%";
    winnerDirectionArrow.style.top = "5%";
    winnerDirectionArrow.style.fontSize = "3vw";

    winnerTh.appendChild(winnerDirectionArrow);
    winnerTh.addEventListener("click", () => sortTable("1", "Winner", winnerDirectionArrow));
    headerRow.appendChild(winnerTh);

    // Date Played header
    const datePlayedTh = document.createElement('th');
    datePlayedTh.textContent = "Date Played"
    datePlayedTh.style.width = "25%";
    datePlayedTh.style.fontSize = "2vw";
    datePlayedTh.style.border = "0.1vw solid black";
    datePlayedTh.style.padding = "1vw";
    datePlayedTh.style.textAlign = "center";
    datePlayedTh.style.backgroundColor = "rgba(0, 0, 255, 1)";
    datePlayedTh.style.color = "rgba(255, 255, 255, 1)";
    datePlayedTh.style.cursor = "pointer";
    datePlayedTh.style.position = "relative";

    const datePlayedDirectionArrow = document.createElement("span");
    datePlayedDirectionArrow.textContent = ""; // Start with no arrow
    datePlayedDirectionArrow.style.position = "absolute";
    datePlayedDirectionArrow.style.right = "10%";
    datePlayedDirectionArrow.style.top = "5%";
    datePlayedDirectionArrow.style.fontSize = "3vw";

    datePlayedTh.appendChild(datePlayedDirectionArrow);
    datePlayedTh.addEventListener("click", () => sortTable("2", "Date Played", datePlayedDirectionArrow));
    headerRow.appendChild(datePlayedTh);

    // Append headers to table
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Initial render of table rows
    renderTableRows(data);

    table.appendChild(tbody);
    sessionsContainer.appendChild(table);
}

// Sort table function
function sortTable(columnIndex, columnName, arrow) {
    // Reset arrows for all other columns
    if (activeColumn !== columnName) {
        document.querySelectorAll("thead th span").forEach(span => {
            span.textContent = "";
        });
        activeColumn = columnName; // Set new active column
    }

    if (!sortDirections[columnName]) {
        sortDirections[columnName] = 1; // Default to ascending
    } else {
        sortDirections[columnName] *= -1; // Toggle direction
    }

    // Update arrow direction
    arrow.textContent = sortDirections[columnName] === 1 ? "↑" : "↓";

    // Sort the data
    data.sort((a, b) => {
        const aValue = Object.values(a)[columnIndex];
        const bValue = Object.values(b)[columnIndex];

        // Handle dates for "Date Played"
        if (columnName === "Date Played") {
            return sortDirections[columnName] * (aValue - bValue); // Compare epoch values directly
        }

        // Default to localeCompare for strings
        return sortDirections[columnName] * aValue.localeCompare(bValue);
    });

    // Re-render the table rows after sorting
    renderTableRows(data);
}

// Function to render table rows
function renderTableRows(data) {
    tbody.innerHTML = ""; // Clear existing rows

    data.forEach(item => {
        // Create the row
        const tr = document.createElement("tr");
        tr.addEventListener("click", () => viewSession(item));

        // Game name cell
        const gameNameTd = document.createElement("td");
        let gameName;
        // Check which game is the session belongs to, to apply special formatting to the gameName cell
        if (item.gameName === "ti4") {
            gameName = "Twilight Imperium";
        } 
        gameNameTd.textContent = gameName;
        gameNameTd.style.fontSize = "2vw";
        gameNameTd.style.fontFamily = "Oswald";
        gameNameTd.style.border = "0.1vw solid black";
        gameNameTd.style.padding = "1vw";
        gameNameTd.style.textAlign = "center";
        tr.appendChild(gameNameTd);

        // Winner cell
        const winnerTd = document.createElement("td");
        // Check which game is the session belongs to, to apply special formatting to the gameName cell
        if (item.gameName === "ti4") {
            const winnerContainer = document.createElement("div");
            winnerContainer.style.display = "flex";
            winnerContainer.style.flexDirection = "row";
            const text = document.createElement("p");
            text.textContent = item.winner;
            text.style.width = "70%";
            const avatar = document.createElement("img");
            avatar.style.borderRadius = "50%";
            avatar.style.width = "6vw";
            avatar.style.height = "auto";
            avatar.style.border = "0.4vw solid rgb(255, 215, 0)";
            avatar.src = item.avatar;
            winnerContainer.appendChild(text);
            winnerContainer.appendChild(avatar);
            winnerTd.appendChild(winnerContainer);
        }; 
        winnerTd.style.fontSize = "2vw";
        winnerTd.style.fontFamily = "Oswald";
        winnerTd.style.border = "0.1vw solid black";
        winnerTd.style.padding = "1vw";
        winnerTd.style.textAlign = "center";
        tr.appendChild(winnerTd);

        // Date Played Cell
        const datePlayedTd = document.createElement("td");
        const date = changeDateFormat(item.date);
        datePlayedTd.textContent = date;
        datePlayedTd.style.fontSize = "2vw";
        datePlayedTd.style.fontFamily = "Oswald";
        datePlayedTd.style.border = "0.1vw solid black";
        datePlayedTd.style.padding = "1vw";
        datePlayedTd.style.textAlign = "center";
        tr.appendChild(datePlayedTd);

        tbody.appendChild(tr);
    });
}

function changeDateFormat(oldDate) {
    const date = new Date(oldDate); // No need for conversion if already in milliseconds
    const day = date.getDate(); // Get day of the month
    const month = date.toLocaleString('en-US', { month: 'short' }); // Get short month name
    const year = date.getFullYear(); // Get full year
    return `${day} ${month} ${year}`; // Construct the formatted date
}

// Create the table body
const tbody = document.createElement("tbody");

let data;
let sortDirections = {}; // Tracks sorting direction for each column
let activeColumn = null; // Tracks which column is currently sorted
createTable();