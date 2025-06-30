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
let questionsData = {};
let characterQuestions = {};
let generalQuestions = [];

// Función para cargar preguntas desde el archivo JSON
async function loadQuestionsFromJSON() {
    try {
        const response = await fetch('data/questions.json');
        const data = await response.json();
        
        questionsData = data;
        characterQuestions = data.characterQuestions || {};
        generalQuestions = data.generalQuestions || [];
        
        console.log('Preguntas cargadas:', {
            caracteres: Object.keys(characterQuestions).length,
            generales: generalQuestions.length
        });
    } catch (error) {
        console.error('Error cargando preguntas:', error);
        // Fallback con preguntas básicas si falla la carga
        generalQuestions = [
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

// Resultados específicos por personaje
const characterSpecificResults = {
    multitasking: {
        low: {
            emoji: "🧘‍♀️",
            title: "Multitasking Zen Master",
            description: "Lograste hacer todo sin colapsar. Sos una máquina bien aceitada... por ahora."
        },
        medium: {
            emoji: "🎪",
            title: "Malabarista Corporativo",
            description: "Hacés malabares con 47 tareas. Algunas se caen, pero el show continúa."
        },
        high: {
            emoji: "🤯",
            title: "Sobrecarga del Sistema",
            description: "Tu cerebro tiene más pestañas abiertas que Chrome. Necesitás un reinicio urgente."
        }
    },
    resignado: {
        low: {
            emoji: "😌",
            title: "Resignación Funcional",
            description: "Resignado pero eficiente. Has encontrado la paz en el caos laboral."
        },
        medium: {
            emoji: "🥱",
            title: "Piloto Automático Activado",
            description: "Funcionás sin pensar. Tu alma se fue de home office hace meses."
        },
        high: {
            emoji: "👻",
            title: "Presencia Fantasma",
            description: "Estás físicamente presente pero espiritualmente en Netflix. Nadie nota la diferencia."
        }
    },
    entusiasta: {
        low: {
            emoji: "⭐",
            title: "Optimismo Sustentable",
            description: "Mantuviste la energía positiva sin volverte molesto. Un logro épico."
        },
        medium: {
            emoji: "🌈",
            title: "Entusiasmo Contenido",
            description: "Tu energía es alta pero controlada. Tus colegas no huyen cuando te ven."
        },
        high: {
            emoji: "🚀",
            title: "Cohete Corporativo",
            description: "Tu entusiasmo descontrolado asusta hasta a recursos humanos. Calmáte un toque."
        }
    }
};

// Estado del juego
let gameState = {
    selectedCharacter: null,
    characterType: null, // 'multitasking', 'resignado', 'entusiasta'
    currentQuestionIndex: 0,
    chaosScore: 0,
    gameQuestions: [],
    totalQuestions: 7, // Aumentamos a 7 para mejor progresión
    difficultyLevel: 'easy' // 'easy', 'medium', 'hard'
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
    
    // Mapear personaje a tipo para las preguntas
    const characterTypeMap = {
        0: 'multitasking', // La multitasking quemada
        1: 'resignado',    // El que renunció en silencio
        2: 'entusiasta'    // La entusiasta que aún cree
    };
    
    gameState.characterType = characterTypeMap[index];
    console.log('Tipo de personaje:', gameState.characterType);
    
    if (elements.startGameButton) {
        elements.startGameButton.disabled = false;
    }
}

// Función para obtener el nivel de dificultad basado en puntos de caos
function getDifficultyLevel(chaosScore) {
    if (chaosScore <= 2) return 'easy';
    if (chaosScore <= 5) return 'medium';
    return 'hard';
}

// Función para generar preguntas dinámicamente
function generateGameQuestions() {
    let questions = [];
    const characterType = gameState.characterType;
    
    // Verificar que tenemos datos del personaje
    if (!characterQuestions[characterType]) {
        console.warn(`No se encontraron preguntas para ${characterType}, usando generales`);
        // Convertir preguntas generales al formato correcto
        return generalQuestions.map(q => ({
            question: q.question,
            options: q.options.map(opt => ({
                text: opt.answer,
                chaos: opt.chaosPoints
            }))
        })).slice(0, gameState.totalQuestions);
    }
    
    const charQuestions = characterQuestions[characterType];
    
    // Función helper para convertir formato
    const convertQuestion = (q) => ({
        question: q.question,
        options: q.options.map(opt => ({
            text: opt.answer,
            chaos: opt.chaosPoints
        }))
    });
    
    // Distribuir preguntas por dificultad (empezamos fácil)
    const easyQuestions = (charQuestions.easy || []).map(convertQuestion);
    const mediumQuestions = (charQuestions.medium || []).map(convertQuestion);
    const hardQuestions = (charQuestions.hard || []).map(convertQuestion);
    const generalQuestionsConverted = generalQuestions.map(convertQuestion);
    
    // Estrategia: empezar fácil, luego mezclar con generales
    questions.push(...shuffleArray([...easyQuestions]).slice(0, 2)); // 2 fáciles del personaje
    questions.push(...shuffleArray([...generalQuestionsConverted]).slice(0, 2)); // 2 generales
    questions.push(...shuffleArray([...mediumQuestions]).slice(0, 2)); // 2 medias del personaje
    questions.push(...shuffleArray([...hardQuestions]).slice(0, 1)); // 1 difícil del personaje
    
    // Si no tenemos suficientes, completar con generales
    while (questions.length < gameState.totalQuestions && generalQuestionsConverted.length > 0) {
        const remaining = shuffleArray([...generalQuestionsConverted]).slice(0, gameState.totalQuestions - questions.length);
        questions.push(...remaining);
    }
    
    return questions.slice(0, gameState.totalQuestions);
}

// Función para obtener la siguiente pregunta dinámicamente
function getNextQuestion(currentIndex, currentChaos) {
    // Si ya tenemos las preguntas generadas, usar esas
    if (gameState.gameQuestions.length > currentIndex) {
        return gameState.gameQuestions[currentIndex];
    }
    
    // Si no, generar dinámicamente basado en caos actual
    const difficulty = getDifficultyLevel(currentChaos);
    const characterType = gameState.characterType;
    
    let availableQuestions = [];
    
    // Priorizar preguntas del personaje según dificultad
    if (characterQuestions[characterType] && characterQuestions[characterType][difficulty]) {
        availableQuestions = characterQuestions[characterType][difficulty].map(q => ({
            question: q.question,
            options: q.options.map(opt => ({
                text: opt.answer,
                chaos: opt.chaosPoints
            }))
        }));
    }
    
    // Si no hay suficientes del personaje, agregar generales
    if (availableQuestions.length === 0) {
        availableQuestions = generalQuestions.map(q => ({
            question: q.question,
            options: q.options.map(opt => ({
                text: opt.answer,
                chaos: opt.chaosPoints
            }))
        }));
    }
    
    // Filtrar preguntas ya usadas
    const usedQuestions = gameState.gameQuestions.slice(0, currentIndex);
    availableQuestions = availableQuestions.filter(q => 
        !usedQuestions.some(used => used.question === q.question)
    );
    
    if (availableQuestions.length === 0) {
        // Fallback a cualquier pregunta
        availableQuestions = generalQuestions.map(q => ({
            question: q.question,
            options: q.options.map(opt => ({
                text: opt.answer,
                chaos: opt.chaosPoints
            }))
        }));
    }
    
    // Seleccionar aleatoriamente
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
}

function startGame() {
    console.log('Iniciando juego');
    
    gameState.currentQuestionIndex = 0;
    gameState.chaosScore = 0;
    gameState.difficultyLevel = 'easy';
    
    // Generar preguntas específicas para el personaje
    gameState.gameQuestions = generateGameQuestions();
    
    if (elements.totalQuestions) {
        elements.totalQuestions.textContent = gameState.totalQuestions;
    }
    
    showScreen('game-screen');
    showQuestion();
}

function showQuestion() {
    // Obtener pregunta dinámicamente si es necesario
    let question;
    if (gameState.currentQuestionIndex < gameState.gameQuestions.length) {
        question = gameState.gameQuestions[gameState.currentQuestionIndex];
    } else {
        // Generar pregunta dinámicamente basada en caos actual
        question = getNextQuestion(gameState.currentQuestionIndex, gameState.chaosScore);
        gameState.gameQuestions.push(question);
    }
    
    if (!question) {
        console.error('No se pudo obtener pregunta');
        return;
    }
    
    // Actualizar nivel de dificultad basado en caos actual
    const previousDifficulty = gameState.difficultyLevel;
    gameState.difficultyLevel = getDifficultyLevel(gameState.chaosScore);
    
    // Agregar indicador de dificultad
    updateDifficultyIndicator(previousDifficulty !== gameState.difficultyLevel);
    
    // Agregar información del personaje
    updateCharacterInfo();
    
    if (elements.currentQuestion) {
        elements.currentQuestion.textContent = gameState.currentQuestionIndex + 1;
    }
    
    if (elements.questionText) {
        elements.questionText.textContent = question.question;
    }
    
    if (elements.chaosScore) {
        elements.chaosScore.textContent = gameState.chaosScore;
        
        // Agregar clase para animación si cambió el puntaje
        if (gameState.currentQuestionIndex > 0) {
            elements.chaosScore.parentElement.classList.add('score-change');
            setTimeout(() => {
                elements.chaosScore.parentElement.classList.remove('score-change');
            }, 600);
        }
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

// Función para actualizar el indicador de dificultad
function updateDifficultyIndicator(difficultyChanged = false) {
    let difficultyContainer = document.querySelector('.difficulty-indicator');
    
    if (!difficultyContainer) {
        difficultyContainer = document.createElement('div');
        difficultyContainer.className = 'difficulty-indicator';
        document.querySelector('.game-container').appendChild(difficultyContainer);
    }
    
    // Limpiar clases anteriores
    difficultyContainer.className = 'difficulty-indicator';
    difficultyContainer.classList.add(`difficulty-${gameState.difficultyLevel}`);
    
    const difficultyText = {
        'easy': '🟢 Fácil',
        'medium': '🟡 Intermedio', 
        'hard': '🔴 Difícil'
    };
    
    difficultyContainer.textContent = difficultyText[gameState.difficultyLevel] || '🟢 Fácil';
    
    // Animación si cambió la dificultad
    if (difficultyChanged) {
        document.querySelector('.game-container').classList.add('difficulty-transition');
        setTimeout(() => {
            document.querySelector('.game-container')?.classList.remove('difficulty-transition');
        }, 500);
    }
}

// Función para mostrar información del personaje
function updateCharacterInfo() {
    let characterInfo = document.querySelector('.character-info');
    
    if (!characterInfo && gameState.selectedCharacter) {
        characterInfo = document.createElement('div');
        characterInfo.className = 'character-info';
        
        const questionCounter = document.querySelector('.question-counter');
        if (questionCounter) {
            questionCounter.appendChild(characterInfo);
        }
    }
    
    if (characterInfo && gameState.selectedCharacter) {
        characterInfo.innerHTML = `
            <span class="character-emoji">${gameState.selectedCharacter.emoji}</span>
            <span>${gameState.selectedCharacter.name}</span>
        `;
    }
}

function selectAnswer(optionIndex) {
    console.log('Seleccionando respuesta:', optionIndex);
    
    const question = gameState.gameQuestions[gameState.currentQuestionIndex];
    if (!question) {
        console.error('No se encontró la pregunta actual');
        return;
    }
    
    const selectedOption = question.options[optionIndex];
    if (!selectedOption) {
        console.error('No se encontró la opción seleccionada');
        return;
    }
    
    // Validar que selectedOption.chaos es un número
    const chaosPoints = typeof selectedOption.chaos === 'number' ? selectedOption.chaos : 0;
    
    // Agregar puntos de caos
    const previousChaos = gameState.chaosScore;
    gameState.chaosScore += chaosPoints;
    
    // Log para debug
    console.log(`Pregunta ${gameState.currentQuestionIndex + 1}: +${chaosPoints} caos (Total: ${gameState.chaosScore})`);
    console.log(`Dificultad anterior: ${getDifficultyLevel(previousChaos)}, nueva: ${getDifficultyLevel(gameState.chaosScore)}`);
    
    // Mostrar selección visual
    document.querySelectorAll('.answer-option').forEach((btn, index) => {
        if (index === optionIndex) {
            btn.classList.add('selected');
            // Agregar indicador visual del nivel de caos
            const chaosIndicator = document.createElement('span');
            chaosIndicator.className = 'chaos-indicator';
            chaosIndicator.textContent = ` (+${chaosPoints} caos)`;
            btn.appendChild(chaosIndicator);
        }
        btn.disabled = true;
    });
    
    // Actualizar display de caos inmediatamente
    if (elements.chaosScore) {
        elements.chaosScore.textContent = gameState.chaosScore;
    }
    
    // Continuar después de un breve delay
    setTimeout(() => {
        gameState.currentQuestionIndex++;
        
        if (gameState.currentQuestionIndex < gameState.totalQuestions) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1500); // Aumentamos el delay para ver el feedback
}

function showResults() {
    const gameCount = incrementGameCount();
    let result;
    
    // Verificar si es el resultado especial (jugó más de 3 veces)
    if (gameCount >= 3) {
        result = specialResult;
    } else {
        // Priorizar resultados específicos del personaje
        if (gameState.characterType && characterSpecificResults[gameState.characterType]) {
            const characterResults = characterSpecificResults[gameState.characterType];
            
            if (gameState.chaosScore <= 4) {
                result = characterResults.low;
            } else if (gameState.chaosScore <= 9) {
                result = characterResults.medium;
            } else {
                result = characterResults.high;
            }
        } else {
            // Fallback a resultados generales
            result = results.find(r => 
                gameState.chaosScore >= r.min && gameState.chaosScore <= r.max
            ) || results[results.length - 1];
        }
    }
    
    if (elements.finalResult) {
        elements.finalResult.innerHTML = `
            <div class="result-character">
                <span class="character-emoji">${gameState.selectedCharacter?.emoji || '🏢'}</span>
                <span class="character-name">${gameState.selectedCharacter?.name || 'Empleado'}</span>
            </div>
            <span class="result-emoji">${result.emoji}</span>
            <div class="result-title">${result.title}</div>
            <div class="result-description">${result.description}</div>
            <div class="final-score">Puntos de caos: ${gameState.chaosScore}</div>
            <div class="difficulty-reached">Dificultad alcanzada: ${getDifficultyLevel(gameState.chaosScore)}</div>
            <div class="game-count">Partidas jugadas: ${gameCount}</div>
        `;
    }
    
    showScreen('results-screen');
}

function restartGame() {
    console.log('Reiniciando juego');
    
    gameState = {
        selectedCharacter: null,
        characterType: null,
        currentQuestionIndex: 0,
        chaosScore: 0,
        gameQuestions: [],
        totalQuestions: 7,
        difficultyLevel: 'easy'
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