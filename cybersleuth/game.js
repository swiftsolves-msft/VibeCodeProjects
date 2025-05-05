// Remove duplicate containers
document.querySelectorAll('#game-container').forEach((el, index) => {
    if (index > 0) el.remove();
});
document.querySelectorAll('#detective-window').forEach((el, index) => {
    if (index > 0) el.remove();
});
document.querySelectorAll('#grid-window').forEach((el, index) => {
    if (index > 0) el.remove();
});
document.querySelectorAll('#notes-window').forEach((el, index) => {
    if (index > 0) el.remove();
});

// Apply random neon flicker to all windows
const gameContainer = document.getElementById('game-container');
const detectiveWindow = document.getElementById('detective-window');
const gridWindow = document.getElementById('grid-window');
// Remove: const notesWindow = document.getElementById('notes-window'); // Already declared in notes.js
const musicFrame = document.querySelector('.music-frame');
const detectiveImg = document.getElementById('detective-img');
const detectiveSpecialty = document.getElementById('detective-specialty');
function applyNeonFlicker(element) {
    console.log('Applying neon flicker to:', element);
    const duration = (Math.random() * 0.5 + 0.5).toFixed(2);
    const delay = (Math.random() * 5 + 5).toFixed(2);
    element.style.animation = `neonFlicker ${duration}s infinite ${delay}s`;
}
applyNeonFlicker(gameContainer);
applyNeonFlicker(detectiveWindow);
applyNeonFlicker(gridWindow);
applyNeonFlicker(notesWindow); // Use the global notesWindow from notes.js
applyNeonFlicker(musicFrame);

let gameState = {
    points: 0,
    failures: 0,
    currentScenario: null,
    successfulChoices: [],
    completedScenarios: [],
    currentChoiceId: null,
    selectedTrait: null,
    focusNodeId: null,
    isRolling: false,
    socDice: {
        1: "Failed",
        2: "Failed",
        3: "Telemetry Successful",
        4: "Telemetry Successful",
        5: "Correlation Successful",
        6: "Correlation Successful"
    },
    supportDice: null,
    rollAttempts: 2,
    successfulDice: [],
    pendingTrait: null, // Added for confirm functionality
    pendingChoice: null, // Added for confirm functionality
    pendingScenario: null // Added for confirm functionality
};

const pointsDisplay = document.getElementById('points');
const failuresDisplay = document.getElementById('failures');
const rollAttemptsDisplay = document.getElementById('roll-attempts');

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

function getDiceOutcome(dice, roll) {
    return dice[roll];
}

function getRandomScenario() {
    try {
        console.log('Getting random scenario, available scenarios:', scenarios);
        const availableScenarios = scenarios.filter(
            scenario => !gameState.completedScenarios.includes(scenario.id)
        );
        if (availableScenarios.length === 0) {
            gameContainer.querySelector('#game-content').innerHTML = `
                <h2 class="text-2xl font-semibold mb-4 text-blue-400">All Cases Solved!</h2>
                <p class="mb-6">You’ve cracked every case in this neon jungle. Start a new game to face the shadows again.</p>
                <button id="restart" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">Start New Game</button>
            `;
            document.getElementById('restart').addEventListener('click', resetGame);
            drawPath(null, [], null, null);
            notesContent.innerHTML = "All cases solved. Start a new game to continue taking notes.";
            return null;
        }
        return availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
    } catch (error) {
        console.error('Error in getRandom relicsenario:', error);
        return null;
    }
}

function updateStatusBar() {
    pointsDisplay.textContent = gameState.points;
    failuresDisplay.textContent = gameState.failures;
    rollAttemptsDisplay.textContent = gameState.rollAttempts;
}

function updateDetectiveSpecialty() {
    detectiveSpecialty.textContent = gameState.selectedTrait ? `Specialty: ${gameState.selectedTrait}` : '';
}

function checkGameOver() {
    if (gameState.failures >= 3) {
        gameContainer.querySelector('#game-content').innerHTML = `
            <img src="boss-pixel-art.png" alt="16-bit pixel art of the boss character" class="game-over-img">
            <h2 class="text-2xl font-semibold mb-4 text-blue-400">You're Fired!</h2>
            <p class="mb-6">Too many missteps in the neon dark. The city’s chewed you up. Try again?</p>
            <button id="restart" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">Try Again</button>
        `;
        detectiveImg.src = 'shocked-pixel-art.png';
        detectiveImg.alt = '16-bit pixel art of the detective with a shocked expression';
        gameState.focusNodeId = null;
        document.getElementById('restart').addEventListener('click', resetGame);
        drawPath(null, [], null, null);
        notesContent.innerHTML = "Game over. Start a new game to continue taking notes.";
        return true;
    }
    return false;
}

function resetGame() {
    gameState = {
        points: 0,
        failures: 0,
        currentScenario: null,
        successfulChoices: [],
        completedScenarios: [],
        currentChoiceId: null,
        selectedTrait: null,
        focusNodeId: null,
        isRolling: false,
        socDice: {
            1: "Failed",
            2: "Failed",
            3: "Telemetry Successful",
            4: "Telemetry Successful",
            5: "Correlation Successful",
            6: "Correlation Successful"
        },
        supportDice: null,
        rollAttempts: 2,
        successfulDice: [],
        pendingTrait: null, // Added for confirm functionality
        pendingChoice: null, // Added for confirm functionality
        pendingScenario: null // Added for confirm functionality
    };
    updateStatusBar();
    gameContainer.querySelector('#game-content').innerHTML = `
        <p class="mb-4">In a city where neon burns brighter than truth, you're a detective unraveling digital mysteries. Choose your technical specialty to begin your investigation.</p>
        <div id="trait-choices" class="space-y-2">
            <button id="network-trait" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Network Specialty</button>
            <button id="identity-trait" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Identity Specialty</button>
            <button id="coding-trait" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Coding Specialty</button>
        </div>
    `;
    detectiveImg.src = 'detective-pixel-art.png';
    detectiveImg.alt = '16-bit pixel art of the detective protagonist';
    updateDetectiveSpecialty();
    setupSpecialtySelection();
    applyNeonFlicker(gameContainer);
    applyNeonFlicker(detectiveWindow);
    applyNeonFlicker(gridWindow);
    applyNeonFlicker(notesWindow);
    applyNeonFlicker(musicFrame);
    drawPath(null, [], null, null);
    notesContent.innerHTML = "Select an action to view notes.";
    clearDiceCanvas();
}

function setupSpecialtySelection() {
    const networkButton = document.getElementById('network-trait');
    const identityButton = document.getElementById('identity-trait');
    const codingButton = document.getElementById('coding-trait');
    console.log('Specialty buttons:', networkButton, identityButton, codingButton);
    networkButton.addEventListener('click', () => {
        console.log('Network Specialty clicked');
        setupSpecialtyConfirmation('Network Specialty'); // Use confirm.js
    });
    networkButton.onclick = () => console.log('Network Specialty onclick triggered');
    identityButton.addEventListener('click', () => {
        console.log('Identity Specialty clicked');
        setupSpecialtyConfirmation('Identity Specialty'); // Use confirm.js
    });
    identityButton.onclick = () => console.log('Identity Specialty onclick triggered');
    codingButton.addEventListener('click', () => {
        console.log('Coding Specialty clicked');
        setupSpecialtyConfirmation('Coding Specialty'); // Use confirm.js
    });
    codingButton.onclick = () => console.log('Coding Specialty onclick triggered');
}

function selectTrait(trait) {
    try {
        console.log('Selecting trait:', trait);
        gameState.selectedTrait = trait;
        if (trait === 'Network Specialty') {
            gameState.supportDice = {
                1: "Failed",
                2: "Failed",
                3: "Failed",
                4: "Analyze Successful",
                5: "Analyze Successful",
                6: "Telemetry Successful"
            };
        } else if (trait === 'Identity Specialty') {
            gameState.supportDice = {
                1: "Failed",
                2: "Failed",
                3: "Failed",
                4: "Analyze Successful",
                5: "Analyze Successful",
                6: "Telemetry Successful"
            };
        } else if (trait === 'Coding Specialty') {
            gameState.supportDice = {
                1: "Failed",
                2: "Failed",
                3: "Coding Successful",
                4: "Coding Successful",
                5: "Coding Successful",
                6: "Coding Successful"
            };
        }
        updateDetectiveSpecialty();
        // Note: The intro narrative is shown in confirm.js via showIntroNarrative, which then calls startGame
    } catch (error) {
        console.error('Error in selectTrait:', error);
    }
}

function startGame() {
    try {
        console.log('Starting game');
        const scenario = getRandomScenario();
        if (!scenario) return;
        gameState.currentScenario = scenario;
        gameState.successfulChoices = [];
        gameState.currentChoiceId = null;
        gameState.focusNodeId = null;
        gameState.isRolling = false;
        gameState.rollAttempts = 2;
        gameState.successfulDice = [];
        detectiveImg.src = 'detective-pixel-art.png';
        detectiveImg.alt = '16-bit pixel art of the detective protagonist';
        displayScenario(scenario);
        drawPath(scenario, gameState.successfulChoices, gameState.currentChoiceId, gameState.focusNodeId);
        notesContent.innerHTML = "Select an action to view notes.";
        clearDiceCanvas();
    } catch (error) {
        console.error('Error in startGame:', error);
    }
}

function displayScenario(scenario) {
    try {
        gameContainer.querySelector('#game-content').innerHTML = `
            <h2 class="text-2xl font-semibold mb-4 text-blue-400">${scenario.title}</h2>
            <p class="mb-6">${scenario.description}</p>
            <h3 class="text-xl font-medium mb-2 text-blue-300">What do you do?</h3>
            <div id="choices" class="space-y-2"></div>
        `;
        const choicesDiv = document.getElementById('choices');
        scenario.choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded choice-button';
            button.textContent = choice.text;
            button.addEventListener('click', () => setupChoiceConfirmation(choice, scenario)); // Use confirm.js
            choicesDiv.appendChild(button);
        });
        drawPath(scenario, gameState.successfulChoices, gameState.currentChoiceId, gameState.focusNodeId);
        updateStatusBar();
        clearDiceCanvas();
    } catch (error) {
        console.error('Error in displayScenario:', error);
    }
}

// Note: handleChoice is now in confirm.js as handleChoiceConfirmed

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, setting up specialty selection');
    setupSpecialtySelection();
});