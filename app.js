document.addEventListener("DOMContentLoaded", () => {

/* ================= FIREBASE ================= */
const firebaseConfig = {
    apiKey: "AIzaSyBfMm6VcVQ3GoqqsNKbHM2PN1akJFzki_s",
    authDomain: "istiklalmarsiyarismasi.firebaseapp.com",
    databaseURL: "https://istiklalmarsiyarismasi-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "istiklalmarsiyarismasi",
    storageBucket: "istiklalmarsiyarismasi.appspot.com",
    messagingSenderId: "78708182382",
    appId: "1:78708182382:web:efe75268cbdc77c682057f"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ================= DOM ================= */
const loginView = document.getElementById("login-view");
const waitingView = document.getElementById("waiting-view");
const quizView = document.getElementById("quiz-view");
const finalView = document.getElementById("final-view");

const roomDisplay = document.getElementById("room-display");
const hostControls = document.getElementById("host-controls");
const waitText = document.getElementById("wait-text");

const qText = document.getElementById("q-text");
const timerEl = document.getElementById("timer");
const optionsContainer = document.getElementById("options-container");
const scoreList = document.getElementById("score-list");

/* ================= QUESTIONS ================= */
const questions = [
    { q: "İstiklal Marşı hangi tarihte kabul edilmiştir?", a: ["12 Mart 1921","29 Ekim 1923","23 Nisan 1920","30 Ağustos 1922"], c: 0 },
    { q: "Mehmet Âkif Ersoy, İstiklal Marşı'nı nerede yazmıştır?", a: ["Ankara Palas","Taceddin Dergâhı","Çankaya Köşkü","Meclis Binası"], c: 1 },
    { q: "İstiklal Marşı hangi ordumuza ithaf edilmiştir?", a: ["Jandarma","Deniz","Kahraman Türk Ordusu","Kuvayı Milliye"], c: 2 }
];

/* ================= STATE ================= */
let my = { name:"", role:"", room:"", score:0, time:0, answered:false };
let timer = 20.0;
let interval = null;
let localQ = -1;
let localStep = "";

/* ================= JOIN ================= */
window.joinQuiz = async function () {
    my.name = document.getElementById("userName").value.trim();
    my.room = document.getElementById("roomCode").value.trim();
    my.role = document.getElementById("userRole").value;

    if (!my.name || !my.room) {
        alert("Bilgileri eksiksiz girin");
        return;
    }

    loginView.style.display = "none";
    waitingView.style.display = "block";
    roomDisplay.innerText = "Oda: " + my.room;

    const roomRef = db.ref("rooms/" + my.room);
    const snap = await roomRef.once("value");

    if (my.role === "host") {
        await roomRef.set({
            started: false,
            currentQ: -1,
            step: "lobby"
        });
        hostControls.style.display = "block";
        waitText.style.display = "none";
    } else {
        if (snap.exists() && snap.val().started) {
            alert("Yarışma başlamıştır");
            location.reload();
            return;
        }
        await roomRef.child("users/" + my.name).set({
            score: 0,
            time: 0
        });
    }

    listenRoom();
};

/* ================= LISTEN ================= */
function listenRoom() {
    db.ref("rooms/" + my.room).on("value", snap => {
        const d = snap.val();
        if (!d || d.currentQ < 0) return;

        if (d.currentQ !== localQ || d.step !== localStep) {
            localQ = d.currentQ;
            localStep = d.step;
            syncUI(d);
        }
    });
}

/* ================= UI ================= */
function syncUI(d) {
    waitingView.style.display = "none";
    quizView.style.display = "block";

    if (d.currentQ >= questions.length) {
        quizView.style.display = "none";
        finalView.style.display = "block";
        return;
    }

    if (d.step === "question") renderQuestion(d.currentQ);
}

/* ================= QUESTION ================= */
function renderQuestion(i) {
    clearInterval(interval);
    timer = 20.0;
    timerEl.innerText = "20.0";

    qText.innerText = questions[i].q;
    optionsContainer.innerHTML = "";

    questions[i].a.forEach((t, idx) => {
        const b = document.createElement("button");
        b.className = "option-btn";
        b.innerText = t;
        if (my.role === "competitor") {
            b.onclick = () => answer(idx, i);
        }
        optionsContainer.appendChild(b);
    });

    interval = setInterval(() => {
        timer = (timer - 0.1).toFixed(1);
        timerEl.innerText = timer;
        if (timer <= 0) clearInterval(interval);
    }, 100);
}

/* ================= ANSWER ================= */
function answer(choice, qIdx) {
    clearInterval(interval);
    const correct = choice === questions[qIdx].c;
    if (correct) my.score += 5;

    db.ref(`rooms/${my.room}/users/${my.name}`).update({
        score: my.score
    });
}

/* ================= START ================= */
window.startQuiz = function () {
    db.ref("rooms/" + my.room).update({
        started: true,
        currentQ: 0,
        step: "question"
    });
};

});
