// 1. FIREBASE (Bilgilerini buraya yapıştır)
const firebaseConfig = {
    apiKey: "AIzaSyBfMm6VcVQ3GoqqsNKbHM2PN1akJFzki_s",
    authDomain: "istiklalmarsiyarismasi.firebaseapp.com",
    databaseURL: "https://istiklalmarsiyarismasi-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "istiklalmarsiyarismasi",
    storageBucket: "istiklalmarsiyarismasi.firebasestorage.app",
    messagingSenderId: "78708182382",
    appId: "1:78708182382:web:efe75268cbdc77c682057f"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const questions = [
    { q: "İstiklal Marşı hangi tarihte kabul edilmiştir?", a: ["12 Mart 1921", "29 Ekim 1923", "23 Nisan 1920", "30 Ağustos 1922"], c: 0 },
    // ... Diğer 19 soruyu buraya ekle (Önceki listeden) ...
];

let myData = { name: "", role: "", room: "", score: 0, time: 0, selectedIdx: -1 };
let currentQuestionIndex = -1;
let timerInterval;

function joinQuiz() {
    myData.name = document.getElementById('userName').value;
    myData.role = document.getElementById('userRole').value;
    myData.room = document.getElementById('roomCode').value;
    if (!myData.name || !myData.room) return alert("Eksik bilgi!");

    document.getElementById('login-view').style.display = 'none';
    document.getElementById('waiting-view').style.display = 'block';
    document.getElementById('display-room-code').innerText = "Oda: " + myData.room;
    initLobby();
}

function initLobby() {
    if(myData.role === 'host') {
        document.getElementById('host-start-area').style.display = 'block';
        document.getElementById('wait-msg').style.display = 'none';
        db.ref('rooms/' + myData.room).update({ status: 'waiting', currentQuestion: -1, step: 'question' });
    } else {
        db.ref('rooms/' + myData.room + '/users/' + myData.name).set({ score: 0, time: 0 });
    }

    // Oyuncu Listesi
    db.ref('rooms/' + myData.room + '/users').on('value', (snap) => {
        const list = document.getElementById('player-list');
        list.innerHTML = "";
        snap.forEach(u => { list.innerHTML += `<li>${u.key}</li>`; });
    });

    // Ana Oyun Döngüsü
    db.ref('rooms/' + myData.room).on('value', (snap) => {
        const roomData = snap.val();
        if (!roomData) return;
        currentQuestionIndex = roomData.currentQuestion;
        
        if (currentQuestionIndex >= 0) {
            document.getElementById('waiting-view').style.display = 'none';
            document.getElementById('quiz-view').style.display = 'block';
            
            if (currentQuestionIndex < questions.length) {
                handleStep(roomData.step);
            } else {
                showFinalResults();
            }
        }
    });
}

function handleStep(step) {
    if (step === 'question') {
        displayQuestion(currentQuestionIndex);
    } else if (step === 'answer') {
        revealAnswer();
    } else if (step === 'score') {
        showMidScoreboard();
    }
}

function startQuizNow() { db.ref('rooms/' + myData.room).update({ status: 'started', currentQuestion: 0, step: 'question' }); }

function displayQuestion(index) {
    myData.selectedIdx = -1;
    document.getElementById('question-area').style.display = 'block';
    document.getElementById('mid-scoreboard').style.display = 'none';
    document.getElementById('question-text').innerText = questions[index].q;
    document.getElementById('question-count').innerText = `Soru: ${index+1}/${questions.length}`;
    
    const container = document.getElementById('options-container');
    container.innerHTML = "";
    questions[index].a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.id = 'opt-' + i;
        btn.innerText = opt;
        if(myData.role === 'competitor') btn.onclick = () => selectOption(i, btn);
        else btn.disabled = true;
        container.appendChild(btn);
    });

    if(myData.role === 'host') {
        document.getElementById('admin-controls').style.display = 'block';
        document.getElementById('show-answer-btn').style.display = 'block';
        document.getElementById('show-answer-btn').disabled = true;
        document.getElementById('show-score-btn').style.display = 'none';
        document.getElementById('next-btn').style.display = 'none';
    }
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    let timeLeft = 20.0;
    timerInterval = setInterval(() => {
        timeLeft = (timeLeft - 0.1).toFixed(1);
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if(myData.role === 'host') document.getElementById('show-answer-btn').disabled = false;
        }
    }, 100);
}

function selectOption(idx, btn) {
    if (myData.selectedIdx !== -1) return;
    clearInterval(timerInterval);
    myData.selectedIdx = idx;
    btn.classList.add('selected-orange');
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
    
    const timeTaken = 20 - parseFloat(document.getElementById('timer').innerText);
    const correct = idx === questions[currentQuestionIndex].c;
    if(correct) { myData.score += 5; myData.time += timeTaken; }
    else { myData.time += 20; }
    
    db.ref('rooms/' + myData.room + '/users/' + myData.name).update({ score: myData.score, time: myData.time });
}

function revealAnswer() {
    clearInterval(timerInterval);
    const correctIdx = questions[currentQuestionIndex].c;
    document.getElementById('opt-' + correctIdx).classList.add('correct-green');
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
}

function triggerShowAnswer() { db.ref('rooms/' + myData.room).update({ step: 'answer' }); 
    document.getElementById('show-answer-btn').style.display = 'none';
    document.getElementById('show-score-btn').style.display = 'block';
}

function triggerShowScore() { db.ref('rooms/' + myData.room).update({ step: 'score' }); 
    document.getElementById('show-score-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'block';
}

function showMidScoreboard() {
    document.getElementById('question-area').style.display = 'none';
    document.getElementById('mid-scoreboard').style.display = 'block';
    updateScoreTable('leaderboard-list');
}

function nextQuestion() {
    db.ref('rooms/' + myData.room).update({ currentQuestion: currentQuestionIndex + 1, step: 'question' });
}

function updateScoreTable(id) {
    db.ref('rooms/' + myData.room + '/users').once('value', (snap) => {
        const u = []; snap.forEach(x => u.push({name: x.key, ...x.val()}));
        u.sort((a,b) => b.score - a.score || a.time - b.time);
        document.getElementById(id).innerHTML = u.map((x,i) => `<div class="score-row"><span>${i+1}. ${x.name}</span><span>${x.score} P</span></div>`).join("");
    });
}

function showFinalResults() {
    document.getElementById('quiz-view').style.display = 'none';
    document.getElementById('result-view').style.display = 'block';
    updateScoreTable('final-leaderboard');
}
