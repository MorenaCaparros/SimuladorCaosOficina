// Datos del juego
const characters = [
    {
        name: "La multitasking quemada",
        description: "Hace todo, pero ya no siente nada.",
        emoji: "🧘‍♀️"
    },
    {
        name: "El que renunció en silencio", 
        description: "Está en cuerpo presente, mente ausente.",
        emoji: "😵"
    },
    {
        name: "La entusiasta que aún cree",
        description: "Todavía piensa que todo puede mejorar.",
        emoji: "🌟"
    }
];

// Variable para almacenar las preguntas cargadas desde JSON
let questions = [];

// Función para cargar preguntas desde el archivo JSON
async function loadQuestionsFromJSON() {
    try {
        const response = await fetch('data/questions.json');
        const data = await response.json();
        questions = data.questions.map(q => ({
            question: q.question,
            options: q.options.map(opt => ({
                text: opt.answer,
                chaos: opt.chaosPoints
            }))
        }));
        console.log('Preguntas cargadas:', questions.length);
    } catch (error) {
        console.error('Error cargando preguntas:', error);
        // Fallback con preguntas básicas si falla la carga
        questions = [
            {
                question: "Error cargando preguntas. ¿Continuar?",
                options: [
                    { text: "Sí", chaos: 0 },
                    { text: "No", chaos: 1 },
                    { text: "Tal vez", chaos: 2 }
                ]
            }
        ];
    }
}

const results = [
    {
        min: 0, max: 3,
        emoji: "🧘‍♀️",
        title: "Tranquilo, pero explotado",
        description: "Resolviste todo con paciencia. Sos esencial, pero invisible. Felicitaciones, sos aire."
    },
    {
        min: 4, max: 7,
        emoji: "😵",
        title: "Tornado productivo", 
        description: "Avanzaste entre incendios. No sabés cómo, pero llegaste. ¿Dormiste? No."
    },
    {
        min: 8, max: 11,
        emoji: "🧨",
        title: "Empleado del mes (según vos)",
        description: "Entregaste todo mal y tarde, pero sonreíste. Y eso vale más que hacer las cosas bien."
    },
    {
        min: 12, max: 15,
        emoji: "🪑",
        title: "Parte del mobiliario",
        description: "Llevás tanto en esa silla que te confundieron con un perchero. Y nadie se dio cuenta."
    },
    {
        min: 16, max: 20,
        emoji: "🧟‍♂️",
        title: "El burnout camina entre nosotros",
        description: "Ya no sabés si es martes o enero. Respondés mails en sueños. Estás funcionando por reflejo."
    }
];

const specialResult = {
    emoji: "🎲",
    title: "Ascendiste sin querer",
    description: "Jugaste tanto que ascendiste. Ahora tenés más reuniones, menos tiempo y el mismo sueldo. Te toca liderar... el caos."
};

// Estado del juego
let gameState = {
    selectedCharacter: null,
    currentQuestionIndex: 0,
    chaosScore: 0,
    gameQuestions: [],
    totalQuestions: 5
};

// Elementos del DOM
let elements = {};

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM cargado, inicializando juego...');
    
    // Cargar preguntas primero
    await loadQuestionsFromJSON();
    
    initializeElements();
    initializeEventListeners();
    showScreen('start-screen');
    
    console.log('Juego inicializado correctamente');
});

function initializeElements() {
    elements = {
        // Pantallas
        startScreen: document.getElementById('start-screen'),
        characterSelection: document.getElementById('character-selection'),
        gameScreen: document.getElementById('game-screen'),
        resultsScreen: document.getElementById('results-screen'),
        
        // Botones
        startButton: document.getElementById('start-button'),
        startGameButton: document.getElementById('start-game-button'),
        restartButton: document.getElementById('restart-button'),
        shareButton: document.getElementById('share-button'),
        
        // Contenedores
        characterContainer: document.getElementById('character-container'),
        questionText: document.getElementById('question-text'),
        answerOptions: document.getElementById('answer-options'),
        finalResult: document.getElementById('final-result'),
        
        // Contadores y puntajes
        currentQuestion: document.getElementById('current-question'),
        totalQuestions: document.getElementById('total-questions'),
        chaosScore: document.getElementById('chaos-score')
    };
    
    console.log('Elementos inicializados:', elements);
}

function initializeEventListeners() {
    if (elements.startButton) {
        elements.startButton.addEventListener('click', showCharacterSelection);
        console.log('Event listener agregado al botón start');
    } else {
        console.error('No se encontró el botón start-button');
    }
    
    if (elements.startGameButton) {
        elements.startGameButton.addEventListener('click', startGame);
    }
    
    if (elements.restartButton) {
        elements.restartButton.addEventListener('click', restartGame);
    }
    
    if (elements.shareButton) {
        elements.shareButton.addEventListener('click', shareResult);
    }
}

function showScreen(screenId) {
    console.log('Mostrando pantalla:', screenId);
    
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Mostrar la pantalla seleccionada
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    } else {
        console.error('No se encontró la pantalla:', screenId);
    }
}

function showCharacterSelection() {
    console.log('Mostrando selección de personajes');
    showScreen('character-selection');
    renderCharacters();
}

function renderCharacters() {
    if (!elements.characterContainer) {
        console.error('No se encontró character-container');
        return;
    }
    
    elements.characterContainer.innerHTML = '';
    
    characters.forEach((character, index) => {
        const characterCard = document.createElement('div');
        characterCard.className = 'character-card';
        characterCard.dataset.characterIndex = index;
        
        characterCard.innerHTML = `
            <span class="emoji">${character.emoji}</span>
            <h3>${character.name}</h3>
            <p>${character.description}</p>
        `;
        
        characterCard.addEventListener('click', () => selectCharacter(index));
        elements.characterContainer.appendChild(characterCard);
    });
}

function selectCharacter(index) {
    console.log('Personaje seleccionado:', index);
    
    // Remover selección previa
    document.querySelectorAll('.character-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Seleccionar nuevo personaje
    const selectedCard = document.querySelector(`[data-character-index="${index}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    gameState.selectedCharacter = characters[index];
    
    if (elements.startGameButton) {
        elements.startGameButton.disabled = false;
    }
}

function startGame() {
    console.log('Iniciando juego');
    
    gameState.currentQuestionIndex = 0;
    gameState.chaosScore = 0;
    gameState.gameQuestions = shuffleArray([...questions]).slice(0, gameState.totalQuestions);
    
    if (elements.totalQuestions) {
        elements.totalQuestions.textContent = gameState.totalQuestions;
    }
    
    showScreen('game-screen');
    showQuestion();
}

function showQuestion() {
    if (gameState.gameQuestions.length === 0) {
        console.error('No hay preguntas cargadas');
        return;
    }
    
    const question = gameState.gameQuestions[gameState.currentQuestionIndex];
    
    if (elements.currentQuestion) {
        elements.currentQuestion.textContent = gameState.currentQuestionIndex + 1;
    }
    
    if (elements.questionText) {
        elements.questionText.textContent = question.question;
    }
    
    if (elements.chaosScore) {
        elements.chaosScore.textContent = gameState.chaosScore;
    }
    
    // Limpiar opciones anteriores
    if (elements.answerOptions) {
        elements.answerOptions.innerHTML = '';
        
        // Crear botones de respuesta
        question.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.className = 'answer-option';
            optionButton.textContent = option.text;
            optionButton.addEventListener('click', () => selectAnswer(index));
            elements.answerOptions.appendChild(optionButton);
        });
    }
}

function selectAnswer(optionIndex) {
    const question = gameState.gameQuestions[gameState.currentQuestionIndex];
    const selectedOption = question.options[optionIndex];
    
    // Agregar puntos de caos
    gameState.chaosScore += selectedOption.chaos;
    
    // Mostrar selección visual
    document.querySelectorAll('.answer-option').forEach((btn, index) => {
        if (index === optionIndex) {
            btn.classList.add('selected');
        }
        btn.disabled = true;
    });
    
    // Continuar después de un breve delay
    setTimeout(() => {
        gameState.currentQuestionIndex++;
        
        if (gameState.currentQuestionIndex < gameState.totalQuestions) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1000);
}

function showResults() {
    const gameCount = incrementGameCount();
    let result;
    
    // Verificar si es el resultado especial (jugó más de 3 veces)
    if (gameCount >= 3) {
        result = specialResult;
    } else {
        // Encontrar resultado basado en puntaje
        result = results.find(r => 
            gameState.chaosScore >= r.min && gameState.chaosScore <= r.max
        ) || results[results.length - 1];
    }
    
    if (elements.finalResult) {
        elements.finalResult.innerHTML = `
            <span class="result-emoji">${result.emoji}</span>
            <div class="result-title">${result.title}</div>
            <div class="result-description">${result.description}</div>
            <div class="final-score">Puntos de caos: ${gameState.chaosScore}</div>
            <div class="game-count">Partidas jugadas: ${gameCount}</div>
        `;
    }
    
    showScreen('results-screen');
}

function restartGame() {
    console.log('Reiniciando juego');
    
    gameState = {
        selectedCharacter: null,
        currentQuestionIndex: 0,
        chaosScore: 0,
        gameQuestions: [],
        totalQuestions: 5
    };
    
    if (elements.startGameButton) {
        elements.startGameButton.disabled = true;
    }
    
    showScreen('start-screen');
}

function shareResult() {
    const text = `¡Acabo de jugar al Simulador de Caos en la Oficina y obtuve ${gameState.chaosScore} puntos de caos! ¿Podrás sobrevivir un día más en la oficina?`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Simulador de Caos en la Oficina',
            text: text,
            url: window.location.href
        });
    } else {
        // Fallback para navegadores que no soportan Web Share API
        navigator.clipboard.writeText(text).then(() => {
            alert('¡Resultado copiado al portapapeles!');
        }).catch(() => {
            alert(`Tu resultado: ${text}`);
        });
    }
}