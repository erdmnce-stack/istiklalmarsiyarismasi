/**********************
 * FIREBASE CONFIG
 **********************/
const firebaseConfig = {
    apiKey: "AIzaSyBfMm6VcVQ3GoqqsNKbHM2PN1akJFzki_s",
    authDomain: "istiklalmarsiyarismasi.firebaseapp.com",
    databaseURL: "https://istiklalmarsiyarismasi-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "istiklalmarsiyarismasi",
    storageBucket: "istiklalmarsiyarismasi.firebasestorage.app",
    messagingSenderId: "78708182382",
    appId: "1:78708182382:web:efe75268cbdc77c682057f"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/**********************
 * QUESTIONS
 **********************/
const questions = [
    { q: "İstiklal Marşı hangi tarihte kabul edilmiştir?", a: ["12 Mart 1921","29 Ekim 1923","23 Nisan 1920","30 Ağustos 1922"], c: 0 },
    { q: "Mehmet Âkif Ersoy, İstiklal Marşı'nı nerede yazmıştır?", a: ["Ankara Palas","Taceddin Dergâhı","Çankaya Köşkü","Meclis Binası"], c: 1 },
    { q: "İstiklal Marşı hangi ordumuza ithaf edilmiştir?", a: ["Jandarma Kuvvetleri","Deniz Kuvvetleri","Kahraman Türk Ordusu","Kuvayı Milliye"], c: 2 },
    { q: "İstiklal Marşı'nın bestecisi kimdir?", a: ["Mehmet Âkif Ersoy","Zeki Üngör","Osman Zeki Üngör","Cemal Reşit Rey"], c: 2 },
    { q: "Mehmet Âkif Ersoy ödül parasını nereye bağışlamıştır?", a: ["Kızılay","Darülmesai","Çocuk Esirgeme Kurumu","Türk Hava Kurumu"], c: 1 }
];

/**********************
 * STATE
 **********************/
let my = { name:"", role:"", room:"", score:0, time:0, selected:null };
let timerVal = 20.0;
let timerInt = null;
let currentQ = -1;
let currentStep = "";

/**********************
 * JOIN
 **********************/
window.joinQuiz = function () {
    my.name = userName.value.trim();
    my.room = roomCode.value.trim();
    my.role = userRole.value;

    if (!my.name || !my.room) return alert("Eksik bilgi");

    login-view.style.display = "none";
    waiting-view.style.display = "block";
    room-display.innerText = "Oda: " + my.room;

    if (my.role === "host") {
        host-controls.style.display = "block";
        wait-text.style.display = "none";
        db.ref("rooms/" + my.room).set({ currentQ:-1, step:"lobby" });
    } else {
        db.ref(`rooms/${my.room}/users/${my.name}`).set({
            score:0, time:0, answered:false
        });
    }

    listenRoom();
};

/**********************
 * LISTEN ROOM
 **********************/
function listenRoom() {
    db.ref(`rooms/${my.room}`).on("value", snap => {
        const d = snap.val();
        if (!d || d.currentQ < 0) return;

        if (d.currentQ !== currentQ || d.step !== currentStep) {
            currentQ = d.currentQ;
            currentStep = d.step;
            syncUI();
        }
    });
}

/**********************
 * SYNC UI
 **********************/
function syncUI() {
    waiting-view.style.display = "none";
    quiz-view.style.display = "block";

    if (currentQ >= questions.length) return showFinal();

    if (currentStep === "question") renderQuestion();
    if (currentStep === "reveal") showReveal();
    if (currentStep === "score") renderScore();
}

/**********************
 * QUESTION
 **********************/
function renderQuestion() {
    clearInterval(timerInt);

    my.selected = null;
    timerVal = 20.0;

    question-content.style.display = "block";
    score-content.style.display = "none";

    q-text.innerText = questions[currentQ].q;
    timer.innerText = "20.0";

    options-container.innerHTML = "";
    questions[currentQ].a.forEach((t,i)=>{
        const b = document.createElement("button");
        b.innerText = t;
        b.className = "option-btn";

        if (my.role === "competitor") b.onclick = ()=>choose(i);
        else b.disabled = true;

        options-container.appendChild(b);
    });

    startTimer();
}

/**********************
 * TIMER (LOCAL)
 **********************/
function startTimer() {
    timerInt = setInterval(()=>{
        timerVal = Math.max(0, timerVal - 0.1).toFixed(1);
        timer.innerText = timerVal;

        if (timerVal <= 0) {
            clearInterval(timerInt);
            disableOptions();
        }
    },100);
}

/**********************
 * ANSWER
 **********************/
function choose(i) {
    if (my.selected !== null) return;

    my.selected = i;
    clearInterval(timerInt);
    disableOptions();

    const correct = i === questions[currentQ].c;
    if (correct) my.score += 5;
    my.time += correct ? (20 - timerVal) : 20;

    db.ref(`rooms/${my.room}/users/${my.name}`).update({
        score: my.score,
        time: my.time,
        answered:true
    });
}

/**********************
 * REVEAL
 **********************/
function showReveal() {
    clearInterval(timerInt);
    const c = questions[currentQ].c;
    options-container.children[c]?.classList.add("correct-green");
}

/**********************
 * SCORE
 **********************/
function renderScore() {
    question-content.style.display = "none";
    score-content.style.display = "block";

    db.ref(`rooms/${my.room}/users`).once("value", snap=>{
        const arr=[];
        snap.forEach(x=>arr.push({name:x.key,...x.val()}));
        arr.sort((a,b)=>b.score-a.score||a.time-b.time);

        score-list.innerHTML = arr.map((x,i)=>
            `<div class="score-row">${i+1}. ${x.name} - ${x.score}</div>`
        ).join("");
    });
}

/**********************
 * ADMIN
 **********************/
window.handleAdminAction = function () {
    const ref = db.ref(`rooms/${my.room}`);
    ref.once("value", s=>{
        const d = s.val();
        if (d.step==="question") ref.update({step:"reveal"});
        else if (d.step==="reveal") ref.update({step:"score"});
        else ref.update({currentQ:d.currentQ+1,step:"question"});
    });
};

window.startQuiz = function () {
    db.ref(`rooms/${my.room}`).update({ currentQ:0, step:"question" });
};

/**********************
 * UTILS
 **********************/
function disableOptions(){
    document.querySelectorAll(".option-btn").forEach(b=>b.disabled=true);
}

function showFinal(){
    quiz-view.style.display="none";
    final-view.style.display="block";
}
