const gamesContainer = document.getElementById("games-container");
const sessionsContainer = document.getElementById("sessions-container")

// Games tab button
document.getElementById('gamesButton').addEventListener('click', function() {
    sessionsContainer.style.display = 'none';
    gamesContainer.style.display = 'flex';
});

// Sessions tab button
document.getElementById('sessionsButton').addEventListener('click', function() {
    gamesContainer.style.display = 'none';
    sessionsContainer.style.display = 'block';
});

// When the page loads, load the games tab
sessionsContainer.style.display = "none";