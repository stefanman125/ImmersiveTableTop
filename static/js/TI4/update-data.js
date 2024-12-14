let players;
let objectives;
let agendas;
let gamedata;
let music;

// Function to continuously fetch multiple files at different intervals
function fetchDataContinuously(playersFileUrl, objectivesFileUrl, agendasFileUrl, gamedataFileUrl, musicFileUrl) {
    // Helper function to fetch a file and log the response
    const fetchFile = async (url, fileName) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`${fileName} fetch failed with status: ${response.status}`);
            }
            return await response.json(); // Return the parsed JSON data
        } catch (error) {
            console.error(`Error fetching ${fileName}:`, error);
            return null; // Return null on failure
        }
    };

    // Set intervals to fetch files and update global variables
    setInterval(() => {
        fetchFile(playersFileUrl, 'Players').then(data => {
            if (data !== null) players = data;
        });
    }, 1000); // Fetch players every 1 second

    setInterval(() => {
        fetchFile(objectivesFileUrl, 'Objectives').then(data => {
            if (data !== null) objectives = data;
        });
    }, 2000); // Fetch objectives every 2 seconds

    setInterval(() => {
        fetchFile(agendasFileUrl, 'Agendas').then(data => {
            if (data !== null) agendas = data;
        });
    }, 2000); // Fetch agendas every 2 seconds

    setInterval(() => {
        fetchFile(gamedataFileUrl, 'Gamedata').then(data => {
            if (data !== null) gamedata = data;
        });
    }, 5000); // Fetch gamedata every 5 seconds

    setInterval(() => {
        fetchFile(musicFileUrl, 'Music').then(data => {
            if (data !== null) music = data;
        });
    }, 1000); // Fetch music every 1 second
}

fetchDataContinuously(playersFileUrl, objectivesFileUrl, agendasFileUrl, gamedataFileUrl, musicFileUrl);