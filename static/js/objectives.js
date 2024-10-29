let objectives = []; // Current objectives displayed in the table

// Load objectives from JSON file
async function loadObjectivesFromFile(objectivesFileUrl) {
    try {
        const response = await fetch(objectivesFileUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
            objectives = data; // Store objectives for display directly from JSON
            console.log('Loaded objectives:', objectives); // Log the loaded objectives
        } else {
            throw new Error('Objectives data is not an array');
        }
    } catch (error) {
        console.error('Error loading objectives:', error);
    }
}

// Create the table structure and insert objectives
function createObjectivesTable() {
    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = ''; // Clear previous content

    const table = document.createElement('table');
    table.setAttribute('border', '1');
    table.style.width = '100%';

    // Create table header
    const headerRow = document.createElement('tr');
    const headers = ['Objective', 'Action']; // Added 'Score' header
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    table.appendChild(headerRow);

    // Create rows for each objective using document fragment for efficiency
    const fragment = document.createDocumentFragment();

    objectives.forEach((objective, objIndex) => {
        const row = createObjectiveRow(objective, objIndex); // Pass the whole objective object
        fragment.appendChild(row);
    });

    // Add fragment (rows) to table
    table.appendChild(fragment);
    tableContainer.appendChild(table);
}

// Create an individual row for each objective
function createObjectiveRow(objective, objIndex) {
    const row = document.createElement('tr');

    // Objective cell
    const objectiveCell = document.createElement('td');
    objectiveCell.textContent = objective 
    row.appendChild(objectiveCell);

    // Action cell (Remove button)
    const actionCell = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => confirmRemoveObjective(objIndex); // Attach handler with confirmation
    actionCell.appendChild(removeBtn);
    row.appendChild(actionCell);

    return row;
}

// Confirm and remove objective by index if user confirms
function confirmRemoveObjective(objIndex) {
    const confirmation = confirm('Are you sure you want to remove this objective?');
    if (confirmation) {
        removeObjective(objIndex); // Proceed with removal if confirmed
    }
}

// Remove objective by index and update table
function removeObjective(objIndex) {
    const objective = objectives[objIndex]
    objectives.splice(objIndex, 1); // Remove objective
    updateTableRow(objIndex); // Efficiently update the table
    saveObjectivesToJson(); // Save updated data to JSON
    logAction(`Objective "${objective}" was removed by`) // Log the action for non-repudation
}

// Efficiently update the table (remove a row)
function updateTableRow(rowIndex) {
    const table = document.querySelector('table');
    table.deleteRow(rowIndex + 1); // +1 to account for the header row
}

// Save objectives to the server (POST request)
async function saveObjectivesToJson() {
    try {
        const response = await fetch('/admin/objectives', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objectives) // Send updated objectives array
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result.message); // Log success message
    } catch (error) {
        console.error('Error saving objectives:', error);
    }
}

// Handler to add a new objective
function addNewObjective() {
    let newObjectiveName = prompt('Enter the new objective conditions:');

    let newObjectiveScore;
    do {
        newObjectiveScore = prompt("Is the new objective T1 or T2:");
    } while (newObjectiveScore !== "T1" && newObjectiveScore !== "T2");

    if (newObjectiveScore === "T1") {
        newObjectiveName = `${newObjectiveName} (I)`
    } else if (newObjectiveScore === "T2") {
        newObjectiveName = `${newObjectiveName} (II)`
    }
    
    // Add the new objective as an object
    objectives.push(newObjectiveName);
    createObjectivesTable(); // Refresh the table
    saveObjectivesToJson(); // Save updated data to JSON file
    logAction(`Objective "${newObjectiveName}" was added by`) // Log the action for non-repudation
}

// Handler to navigate the user to /admin
function navigateToAdmin() {
    window.location.href = '/admin';
}

// Load objectives and create table
loadObjectivesFromFile(objectivesFileUrl).then(() => {
    createObjectivesTable(); // Populate the table with loaded objectives
});

// Add event listener for "Add Objective" button
document.getElementById('addObjectiveBtn').addEventListener('click', addNewObjective);

// Add event listener for "Back to Menu" button
document.getElementById('backToMenuBtn').addEventListener('click', navigateToAdmin);
