window.addEventListener('load', () => {
    toggleHelpMenu();
});

function toggleHelpMenu() {
    const playButton = document.querySelector('.play');
    const helpMenu = document.querySelector('.help_menu');
    const exitButton = document.querySelector('.exit_menu');

    // Add event listeners for click and touch events
    playButton.addEventListener('click', (event) => {
        event.stopPropagation();
        helpMenu.style.display = 'block';
    });
    playButton.addEventListener('touchend', (event) => {
        event.stopPropagation();
        helpMenu.style.display = 'block';
    });
    exitButton.addEventListener('click', (event) => {
        event.stopPropagation();
        // Navigate to gamePage.html when the exitButton is clicked
        window.location.href = 'gamePage.html';
    });
    exitButton.addEventListener('touchend', (event) => {
        event.stopPropagation();
        // Navigate to gamePage.html when the exitButton is tapped
        window.location.href = 'gamePage.html';
    });
    document.addEventListener('click', () => {
        window.location.href = 'gamePage.html';
    });
    document.addEventListener('touchend', () => {
        window.location.href = 'gamePage.html';
    });
    helpMenu.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    helpMenu.addEventListener('touchend', (event) => {
        event.stopPropagation();
    });
}