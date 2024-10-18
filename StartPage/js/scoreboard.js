//Where The Current Data Array For Each Player will be Stored
//TODO FIGURE OUT IMAGE STRUCTURE
let players = [
    { name: 'Joe', score: 0, avatar: 'test_picture.png' },
    { name: 'Stefan', score: 0, avatar: 'test_picture.png' },
    { name: 'Admam', score: 0, avatar: 'test_picture.png' },
    { name: 'Other Dude ', score: 0, avatar: 'test_picture.png' },

];

// Function to generate a random score increment
function generateRandomScore() {
    return 1;  // Random score increment between 0 and 19
}

// Function to update a random player's score
function updatePlayerScore() {
    const PlayerScoreIndex = Math.floor(Math.random() * players.length);
    const randomScore = generateRandomScore();
    players[PlayerScoreIndex].score += randomScore;

    //This Will set the Score Per Player Using a the Randomizer + current Score
    const playerScoreElement = document.getElementById('score');
    playerScoreElement.textContent = `${players[PlayerScoreIndex].name} Score: ${players[PlayerScoreIndex].score}`;

    //Once Score is Changed With Above
    //This will update the current leaderboard
    updateLeaderboard();
}

// Function to update the leaderboard display
function updateLeaderboard() {
    // Sort players by score in descending order
    players.sort((a, b) => b.score - a.score);
    const highscore = players[0].score;
    const isTie = players.filter(players => players.score === highscore).length > 1;
    // Get the leaderboard container
    const leaderboardContainer = document.getElementById('leaderboard');
    leaderboardContainer.innerHTML = '';  // Clear the current leaderboard

    // Display the updated leaderboard
    players.forEach((player, index) => {
        const playerCard = document.createElement('div');
        playerCard.classList.add('player-card');


        //If No Score == No boarder
        if (player.score === 0) {
            playerCard.classList.add('player-card');
        }
        //If Players Score is Top Score & Is tied Silver boarder
        else if (player.score === highscore && isTie) {
            playerCard.classList.add('tied');
        }
        //If Player index is 0 and is not tie Gold boarder
        else if (index === 0 && !isTie) {
            playerCard.classList.add('highlighted');
        }


        // Create the avatar image
        const avatarImg = document.createElement('img');
        avatarImg.src = player.avatar;
        avatarImg.alt = 'Player Avatar';
        avatarImg.classList.add('avatar');

        // Create the player info container
        const playerInfo = document.createElement('div');
        playerInfo.classList.add('player-info');

        // Add player name and current Score
        const playerName = document.createElement('h1');
        playerName.textContent = player.name;
        const playerScore = document.createElement('p');
        playerScore.textContent = `Score: ${player.score}`;

        playerCard.appendChild(avatarImg);
        playerCard.appendChild(playerInfo);
        playerInfo.appendChild(playerName);
        playerInfo.appendChild(playerScore);



        // Append the player card to the leaderboard
        leaderboardContainer.appendChild(playerCard);
    });
}

// Event listener for the refresh button
document.getElementById('refreshButton').addEventListener('click', updatePlayerScore);

//Displays the whole leaderboard
updateLeaderboard();
