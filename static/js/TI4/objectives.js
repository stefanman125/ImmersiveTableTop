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
        const response = await fetch('/ti/admin/objectives', {
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

// Add the new objective to the main table and json file
function addNewObjective(newObjectiveName) {
    if (objectives.includes(newObjectiveName)) {
        alert("Objective has already been added.")
    } else {
        objectives.push(newObjectiveName);
        createObjectivesTable(); // Refresh the table
        saveObjectivesToJson(); // Save updated data to JSON file
        logAction(`Objective "${newObjectiveName}" was added by`) // Log the action for non-repudation
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
    modalContent.style.width = "80%";
    modalContent.style.maxWidth = "500px";
    modalContent.style.maxHeight = "70vh"; // Set max height for the modal
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

// Load objectives and create table
loadObjectivesFromFile(objectivesFileUrl).then(() => {
    createObjectivesTable(); // Populate the table with loaded objectives
});

// Add event listener for "Add Objective" button
document.getElementById('addObjectiveBtn').addEventListener('click', addNewObjectiveModal);

// Add event listener for "Back to Menu" button
document.getElementById('backToMenuBtn').addEventListener('click', function() {
    window.location.href = '/ti/admin';
});
