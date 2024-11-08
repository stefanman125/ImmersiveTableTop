async function fetchAndDisplayLog() {
    try {
        const response = await fetch(logFileUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch log file");
        }
        
        const text = await response.text();
        // Split the text into lines, reverse the order, and join it back
        const reversedText = text.split('\n').reverse().join('\n');
        document.getElementById("logContainer").textContent = reversedText;

        // Color important words
        colorWord("reset", "red")
        colorWord("score changed", "yellow")
        colorWord("objective", "green")
        colorWord("secret objective", "green")
        colorWord("removed", "red")
        colorWord("added", "green")
        colorWord("renamed", "yellow")
        colorWord("renamed", "yellow")
        colorWord("overridden", "yellow")
        colorWord("rebuild", "yellow")
    } catch (error) {
        console.error("Error fetching log file:", error);
        document.getElementById("logContainer").textContent = "Unable to load log file.";
    }
}

// Color words in the log container based on a regex
function colorWord(word, color) {
    const container = document.getElementById('logContainer');
    container.innerHTML = container.innerHTML.replace(
        new RegExp(`(${word})`, 'gi'),
        `<span style="color: ${color};">$1</span>`
    );
}

// Call the function when the page loads
window.onload = fetchAndDisplayLog;