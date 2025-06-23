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
    },
    {
        question: "Tu silla está rota y te hundís cada vez que te sentás. ¿Solución?",
        options: [
            { text: "Caja debajo", chaos: 1 },
            { text: "Te mandan banquito", chaos: 2 },
            { text: "Te adaptás", chaos: 0 }
        ]
    },
    {
        question: "Llamado a las 8 AM cuando todavía estás en pijama. ¿Respondés?",
        options: [
            { text: "Atendés y decís 'Hola, delivery'", chaos: 2 },
            { text: "No atendés", chaos: 1 },
            { text: "Respondés por Slack", chaos: 0 }
        ]
    },
    {
        question: "Impresora endemoniada que funciona cuando quiere. ¿Tu táctica?",
        options: [
            { text: "Post-it 'NO FUNCIONA'", chaos: 2 },
            { text: "Desenchufás", chaos: 1 },
            { text: "Llamás a sistemas", chaos: 0 }
        ]
    },
    {
        question: "Te piden un informe 'para ayer' sobre algo que no existe. ¿Cómo reaccionás?",
        options: [
            { text: "Preguntás si es joda", chaos: 1 },
            { text: "Lo hacés con estrés", chaos: 2 },
            { text: "Plantilla con dibujitos", chaos: 0 }
        ]
    },
    {
        question: "Grupo de WhatsApp del trabajo está muerto hace 3 días. ¿Qué hacés?",
        options: [
            { text: "Sticker pasivo-agresivo", chaos: 1 },
            { text: "Renombrás el grupo", chaos: 2 },
            { text: "Silenciás por 1 año", chaos: 0 }
        ]
    },
    {
        question: "Informe que tardaste 3 horas en hacer y nadie va a leer. ¿Tu estrategia?",
        options: [
            { text: "Copiás uno viejo", chaos: 1 },
            { text: "Usás ChatGPT", chaos: 0 },
            { text: "Lo hacés bien y nadie lo lee", chaos: 2 }
        ]
    }
];

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
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    initializeEventListeners();
    showScreen('start-screen');
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
}

function initializeEventListeners() {
    elements.startButton.addEventListener('click', showCharacterSelection);
    elements.startGameButton.addEventListener('click', startGame);
    elements.restartButton.addEventListener('click', restartGame);
    elements.shareButton.addEventListener('click', shareResult);
}

function showScreen(screenId) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // Mostrar la pantalla seleccionada
    document.getElementById(screenId).classList.remove('hidden');
}

function showCharacterSelection() {
    showScreen('character-selection');
    renderCharacters();
}

function renderCharacters() {
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
    // Remover selección previa
    document.querySelectorAll('.character-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Seleccionar nuevo personaje
    const selectedCard = document.querySelector(`[data-character-index="${index}"]`);
    selectedCard.classList.add('selected');
    
    gameState.selectedCharacter = characters[index];
    elements.startGameButton.disabled = false;
}

function startGame() {
    gameState.currentQuestionIndex = 0;
    gameState.chaosScore = 0;
    gameState.gameQuestions = shuffleArray(questions).slice(0, gameState.totalQuestions);
    
    elements.totalQuestions.textContent = gameState.totalQuestions;
    
    showScreen('game-screen');
    showQuestion();
}

function showQuestion() {
    const question = gameState.gameQuestions[gameState.currentQuestionIndex];
    
    elements.currentQuestion.textContent = gameState.currentQuestionIndex + 1;
    elements.questionText.textContent = question.question;
    elements.chaosScore.textContent = gameState.chaosScore;
    
    // Limpiar opciones anteriores
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
    
    elements.finalResult.innerHTML = `
        <span class="result-emoji">${result.emoji}</span>
        <div class="result-title">${result.title}</div>
        <div class="result-description">${result.description}</div>
        <div class="final-score">Puntos de caos: ${gameState.chaosScore}</div>
        <div class="game-count">Partidas jugadas: ${gameCount}</div>
    `;
    
    showScreen('results-screen');
}

function restartGame() {
    gameState = {
        selectedCharacter: null,
        currentQuestionIndex: 0,
        chaosScore: 0,
        gameQuestions: [],
        totalQuestions: 5
    };
    
    elements.startGameButton.disabled = true;
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
