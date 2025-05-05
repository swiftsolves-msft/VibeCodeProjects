// Confirm button logic for specialty selection and choices

// Add confirm-related state to gameState (this will need to be integrated into game.js)
function initializeConfirmState(gameState) {
    gameState.pendingTrait = null;
    gameState.pendingChoice = null;
    gameState.pendingScenario = null;
}

// Specialty notes content
const specialtyNotes = {
    'Network Specialty': `
        <p><strong>Description:</strong> You’re a master of network analysis, tracing data flows through the neon-lit underbelly of the city.</p>
        <p><strong>Career Focus:</strong> Network Security Engineer – Design and maintain secure network architectures, protecting organizations from cyber threats by monitoring traffic and implementing firewalls.</p>
        <p><strong>Specialty Dice:</strong> 50% chance of Analyze Successful (4, 5), 16.67% chance of Telemetry Successful (6), 50% chance of Failed (1, 2, 3).</p>
    `,
    'Identity Specialty': `
        <p><strong>Description:</strong> You specialize in identity verification, cracking the digital masks of suspects in this cyberpunk sprawl.</p>
        <p><strong>Career Focus:</strong> Identity and Access Management (IAM) Specialist – Manage user identities and access controls to ensure only authorized individuals access sensitive systems.</p>
        <p><strong>Specialty Dice:</strong> 50% chance of Analyze Successful (4, 5), 16.67% chance of Telemetry Successful (6), 50% chance of Failed (1, 2, 3).</p>
    `,
    'Coding Specialty': `
        <p><strong>Description:</strong> You’re a coding expert, writing scripts to hack through the city’s digital defenses.</p>
        <p><strong>Career Focus:</strong> Security Software Developer – Build and test software to secure applications, often writing tools to detect vulnerabilities in code.</p>
        <p><strong>Specialty Dice:</strong> 66.67% chance of Coding Successful (3, 4, 5, 6), 33.33% chance of Failed (1, 2).</p>
    `
};

// Function to update notes with specialty information
function updateSpecialtyNotes(trait) {
    if (specialtyNotes[trait]) {
        notesContent.innerHTML = specialtyNotes[trait];
    } else {
        notesContent.innerHTML = "Select a specialty to view details.";
    }
}

// Show intro narrative after specialty confirmation
function showIntroNarrative() {
    try {
        console.log('Showing intro narrative');
        gameContainer.querySelector('#game-content').innerHTML = `
            <img src="intro-pixel-art.png" alt="16-bit pixel art of the mayor winking" class="intro-img">
            <h2 class="text-2xl font-semibold mb-4 text-blue-400">Welcome to Neon City</h2>
            <p class="mb-4">The screen fades to black after you confirm your specialty. A neon glow flickers to life, revealing the mayor of Neon City—a stern figure in a dark suit, his gray hair catching the light of a flickering hologram. He winks at you with a knowing smirk, his voice crackling through the static of your terminal.</p>
            <p class="mb-4">"Welcome to Neon City, detective. I’m Mayor Grayson, and I’ve heard you’re the best cyber sleuth this side of the grid. Our city’s drowning in digital shadows—security incidents are piling up faster than we can trace them. Citizens are reporting breaches, my staff’s on edge, and the security alerting system’s screaming with alerts we can’t keep up with. That’s where you come in.</p>
            <p class="mb-4">You’ll be my eyes in the dark, unraveling these mysteries one node at a time. From vanishing scripts to ghost accounts, the threats are real, and the stakes are higher than the neon skyline. I’ve got faith in your skills—don’t let me down. The city’s counting on you to clean up this mess. Your first case is waiting… let’s see what you’re made of."</p>
            <p class="mb-4">The mayor’s hologram fades, leaving you with the hum of your terminal and the glow of Neon City’s skyline. Your investigation begins now.</p>
            <button id="start-investigation" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Start Investigation</button>
        `;
        notesContent.innerHTML = "The mayor has briefed you on your mission. Click 'Start Investigation' to begin your first case.";
        document.getElementById('start-investigation').addEventListener('click', () => {
            console.log('Start Investigation button clicked');
            startGame();
        });
    } catch (error) {
        console.error('Error in showIntroNarrative:', error);
    }
}

// Show confirm button for specialty selection
function setupSpecialtyConfirmation(trait) {
    console.log('Setting up specialty confirmation for:', trait);
    gameState.pendingTrait = trait;
    updateSpecialtyNotes(trait);
    gameContainer.querySelector('#game-content').innerHTML = `
        <p class="mb-4">You have chosen <strong>${trait}</strong>. Are you sure?</p>
        <div id="confirm-specialty" class="space-y-2">
            <button id="confirm-specialty-btn" class="w-full confirm-button bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">Confirm Specialty</button>
            <button id="cancel-specialty-btn" class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">Cancel</button>
        </div>
    `;
    try {
        document.getElementById('confirm-specialty-btn').addEventListener('click', () => {
            console.log('Confirming specialty:', trait);
            selectTrait(trait);
            showIntroNarrative();
            gameState.pendingTrait = null;
        });
        document.getElementById('cancel-specialty-btn').addEventListener('click', () => {
            console.log('Cancel button clicked');
            resetSpecialtySelection();
        });
    } catch (error) {
        console.error('Error setting up confirmation buttons:', error);
    }
}

// Reset specialty selection to initial screen
function resetSpecialtySelection() {
    console.log('Canceling specialty selection');
    gameState.pendingTrait = null;
    gameContainer.querySelector('#game-content').innerHTML = `
        <p class="mb-4">In a city where neon burns brighter than truth, you're a detective unraveling digital mysteries. Choose your technical specialty to begin your investigation.</p>
        <div id="trait-choices" class="space-y-2">
            <button id="network-trait" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Network Specialty</button>
            <button id="identity-trait" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Identity Specialty</button>
            <button id="coding-trait" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Coding Specialty</button>
        </div>
    `;
    notesContent.innerHTML = "Select a specialty to view details.";
    setupSpecialtySelection();
}

// Show confirm button for choices
function setupChoiceConfirmation(choice, scenario) {
    console.log('Setting up choice confirmation for:', choice.text);
    gameState.pendingChoice = choice;
    gameState.pendingScenario = scenario;
    updateNotes(choice, scenario);
    gameContainer.querySelector('#game-content').innerHTML = `
        <h2 class="text-2xl font-semibold mb-4 text-blue-400">${scenario.title}</h2>
        <p class="mb-4"><strong>Action:</strong> ${choice.text}</p>
        <p class="mb-4">Are you sure you want to proceed with this action?</p>
        <div id="confirm-action" class="space-y-2">
            <button id="confirm-action-btn" class="w-full confirm-button bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">Confirm Action</button>
            <button id="cancel-action-btn" class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded">Cancel</button>
        </div>
    `;
    try {
        document.getElementById('confirm-action-btn').addEventListener('click', () => {
            console.log('Confirming action:', choice.text);
            handleChoiceConfirmed(choice, scenario);
            gameState.pendingChoice = null;
            gameState.pendingScenario = null;
        });
        document.getElementById('cancel-action-btn').addEventListener('click', () => {
            console.log('Canceling action');
            gameState.pendingChoice = null;
            gameState.pendingScenario = null;
            displayScenario(scenario);
        });
    } catch (error) {
        console.error('Error setting up action confirmation buttons:', error);
    }
}

// Handle confirmed choice (replaces direct handleChoice call)
function handleChoiceConfirmed(choice, scenario) {
    if (gameState.isRolling) return;
    gameState.isRolling = true;
    gameState.currentChoiceId = choice.id;

    const buttons = document.querySelectorAll('.choice-button');
    buttons.forEach(button => button.disabled = true);

    try {
        if (gameState.successfulChoices.includes(choice.id)) {
            if (choice.next) {
                gameContainer.querySelector('#game-content').innerHTML = `
                    <h2 class="text-2xl font-semibold mb-4 text-blue-400">${scenario.title}</h2>
                    <p class="mb-4"><strong>Action:</strong> ${choice.text}</p>
                    <p class="mb-4"><strong>Status:</strong> Previously Successful</p>
                    <p class="mb-6"><strong>Outcome:</strong> ${choice.outcome}</p>
                    <h3 class="text-xl font-medium mb-2 text-blue-300">Next Step:</h3>
                    <div id="choices" class="space-y-2"></div>
                `;
                updateNotes(choice, scenario, true);
                detectiveImg.src = 'detective-smile-art.png';
                detectiveImg.alt = '16-bit pixel art of the detective smiling';
                const choicesDiv = document.getElementById('choices');
                choice.next.forEach(nextChoice => {
                    const button = document.createElement('button');
                    button.className = 'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded choice-button';
                    button.textContent = nextChoice.text;
                    button.addEventListener('click', () => setupChoiceConfirmation(nextChoice, scenario));
                    choicesDiv.appendChild(button);
                });
                drawPath(scenario, gameState.successfulChoices, gameState.currentChoiceId, gameState.focusNodeId || choice.id);
                gameState.isRolling = false;
                buttons.forEach(button => button.disabled = false);
                clearDiceCanvas();
            } else {
                gameContainer.querySelector('#game-content').innerHTML = `
                    <h2 class="text-2xl font-semibold mb-4 text-blue-400">${scenario.title}</h2>
                    <p class="mb-4"><strong>Action:</strong> ${choice.text}</p>
                    <p class="mb-4"><strong>Status:</strong> Previously Successful</p>
                    <p class="mb-6"><strong>Outcome:</strong> ${choice.outcome}</p>
                    <button id="new-case" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">Take on a New Case</button>
                `;
                updateNotes(choice, scenario, true);
                detectiveImg.src = 'detective-smile-art.png';
                detectiveImg.alt = '16-bit pixel art of the detective smiling';
                gameState.completedScenarios.push(scenario.id);
                gameState.focusNodeId = null;
                document.getElementById('new-case').addEventListener('click', startGame);
                drawPath(null, [], null, null);
                gameState.isRolling = false;
                clearDiceCanvas();
            }
        } else {
            const socRoll = rollDice();
            const supportRoll = rollDice();
            const socOutcome = getDiceOutcome(gameState.socDice, socRoll);
            const supportOutcome = getDiceOutcome(gameState.supportDice, supportRoll);

            if (socOutcome === choice.successCriteria && !gameState.successfulDice.includes(socOutcome)) {
                gameState.successfulDice.push(socOutcome);
            }
            if (supportOutcome === choice.successCriteria && !gameState.successfulDice.includes(supportOutcome)) {
                gameState.successfulDice.push(supportOutcome);
            }

            gameState.rollAttempts -= 1;
            updateStatusBar();

            showDiceAnimation(socRoll, supportRoll, choice, scenario, () => {
                try {
                    const isSuccess = gameState.successfulDice.includes(choice.successCriteria);

                    if (isSuccess) {
                        gameState.points += 10;
                        gameState.successfulChoices.push(choice.id);
                        gameState.rollAttempts = 2;
                        gameState.successfulDice = [];
                        detectiveImg.src = 'detective-smile-art.png';
                        detectiveImg.alt = '16-bit pixel art of the detective smiling';
                        if (scenario.choices.some(c => c.id === choice.id)) {
                            gameState.focusNodeId = choice.id;
                        }
                        if (choice.next) {
                            gameContainer.querySelector('#game-content').innerHTML = `
                                <h2 class="text-2xl font-semibold mb-4 text-blue-400">${scenario.title}</h2>
                                <p class="mb-4"><strong>Action:</strong> ${choice.text}</p>
                                <p class="mb-4"><strong>Roll:</strong> SOC: ${socOutcome}, Support: ${supportOutcome} (Success!)</p>
                                <p class="mb-6"><strong>Outcome:</strong> ${choice.outcome}</p>
                                <h3 class="text-xl font-medium mb-2 text-blue-300">Next Step:</h3>
                                <div id="choices" class="space-y-2"></div>
                            `;
                            const choicesDiv = document.getElementById('choices');
                            choice.next.forEach(nextChoice => {
                                const button = document.createElement('button');
                                button.className = 'w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded choice-button';
                                button.textContent = nextChoice.text;
                                button.addEventListener('click', () => setupChoiceConfirmation(nextChoice, scenario));
                                choicesDiv.appendChild(button);
                            });
                            drawPath(scenario, gameState.successfulChoices, gameState.currentChoiceId, gameState.focusNodeId);
                        } else {
                            gameContainer.querySelector('#game-content').innerHTML = `
                                <h2 class="text-2xl font-semibold mb-4 text-blue-400">${scenario.title}</h2>
                                <p class="mb-4"><strong>Action:</strong> ${choice.text}</p>
                                <p class="mb-4"><strong>Roll:</strong> SOC: ${socOutcome}, Support: ${supportOutcome} (Success!)</p>
                                <p class="mb-6"><strong>Outcome:</strong> ${choice.outcome}</p>
                                <button id="new-case" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">Take on a New Case</button>
                            `;
                            gameState.completedScenarios.push(scenario.id);
                            gameState.focusNodeId = null;
                            document.getElementById('new-case').addEventListener('click', startGame);
                            drawPath(null, [], null, null);
                        }
                        gameState.isRolling = false;
                        buttons.forEach(button => button.disabled = false);
                        clearDiceCanvas();
                    } else if (gameState.rollAttempts > 0) {
                        detectiveImg.src = 'detective-resolved-art.png';
                        detectiveImg.alt = '16-bit pixel art of the detective with a resolved expression';
                        gameContainer.querySelector('#game-content').innerHTML = `
                            <h2 class="text-2xl font-semibold mb-4 text-blue-400">${scenario.title}</h2>
                            <p class="mb-4"><strong>Action:</strong> ${choice.text}</p>
                            <p class="mb-4"><strong>Roll:</strong> SOC: ${socOutcome}, Support: ${supportOutcome} (No Match!)</p>
                            <p class="mb-6"><strong>Outcome:</strong> Your action didn't yield the required ${choice.successCriteria}. You must reroll to continue.</p>
                            <div class="space-y-2">
                                <button id="reroll" class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded">Reroll (${gameState.rollAttempts} attempts left)</button>
                            </div>
                        `;
                        document.getElementById('reroll').addEventListener('click', () => handleChoiceConfirmed(choice, scenario));
                        drawPath(scenario, gameState.successfulChoices, gameState.currentChoiceId, gameState.focusNodeId);
                        gameState.isRolling = false;
                        buttons.forEach(button => button.disabled = false);
                        clearDiceCanvas();
                    } else {
                        gameState.failures += 1;
                        gameState.points = Math.max(0, gameState.points - 5); // Deduct 5 points, but not below 0
                        detectiveImg.src = 'detective-resolved-art.png';
                        detectiveImg.alt = '16-bit pixel art of the detective with a resolved expression';
                        gameState.rollAttempts = 2;
                        gameState.successfulDice = [];
                        updateStatusBar();
                        if (!checkGameOver()) {
                            gameContainer.querySelector('#game-content').innerHTML = `
                                <h2 class="text-2xl font-semibold mb-4 text-blue-400">${scenario.title}</h2>
                                <p class="mb-4"><strong>Action:</strong> ${choice.text}</p>
                                <p class="mb-4"><strong>Roll:</strong> SOC: ${socOutcome}, Support: ${supportOutcome} (No Match!)</p>
                                <p class="mb-6"><strong>Outcome:</strong> Out of attempts. The trail goes cold—failure recorded. (-5 points)</p>
                                <button id="new-action" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Try a Different Action</button>
                            `;
                            document.getElementById('new-action').addEventListener('click', () => displayScenario(scenario));
                            drawPath(scenario, gameState.successfulChoices, gameState.currentChoiceId, gameState.focusNodeId);
                            gameState.isRolling = false;
                            buttons.forEach(button => button.disabled = false);
                            clearDiceCanvas();
                        }
                    }
                } catch (error) {
                    console.error('Dice roll error:', error);
                    gameState.failures += 1;
                    gameState.points = Math.max(0, gameState.points - 5); // Deduct 5 points, but not below 0
                    updateStatusBar();
                    if (!checkGameOver()) {
                        gameContainer.querySelector('#game-content').innerHTML = `
                            <h2 class="text-2xl font-semibold mb-4 text-blue-400">${scenario.title}</h2>
                            <p class="mb-4"><strong>Error:</strong> Something broke in the shadows.</p>
                            <p class="mb-6"><strong>Outcome:</strong> The trail goes cold—failure recorded. (-5 points)</p>
                            <button id="new-action" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Try a Different Action</button>
                        `;
                        document.getElementById('new-action').addEventListener('click', () => displayScenario(scenario));
                        drawPath(scenario, gameState.successfulChoices, gameState.currentChoiceId, gameState.focusNodeId);
                    }
                    gameState.isRolling = false;
                    buttons.forEach(button => button.disabled = false);
                    clearDiceCanvas();
                }
            });
        }
    } catch (error) {
        console.error('handleChoiceConfirmed error:', error);
        gameState.failures += 1;
        gameState.points = Math.max(0, gameState.points - 5); // Deduct 5 points, but not below 0
        updateStatusBar();
        if (!checkGameOver()) {
            gameContainer.querySelector('#game-content').innerHTML = `
                <h2 class="text-2xl font-semibold mb-4 text-blue-400">${scenario.title}</h2>
                <p class="mb-4"><strong>Error:</strong> Something broke in the shadows.</p>
                <p class="mb-6"><strong>Outcome:</strong> The trail goes cold—failure recorded. (-5 points)</p>
                <button id="new-action" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Try a Different Action</button>
            `;
            document.getElementById('new-action').addEventListener('click', () => displayScenario(scenario));
            drawPath(scenario, gameState.successfulChoices, gameState.currentChoiceId, gameState.focusNodeId);
        }
        gameState.isRolling = false;
        buttons.forEach(button => button.disabled = false);
        clearDiceCanvas();
    }
}