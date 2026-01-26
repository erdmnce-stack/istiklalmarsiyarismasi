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
 * DOM ELEMENTS
 **********************/
const loginView = document.getElementById("login-view");
const waitingView = document.getElementById("waiting-view");
const quizView = document.getElementById("quiz-view");
const finalView = document.getElementById("final-view");

const roomDisplay = document.getElementById("room-display");
const hostControls = document.getElementById("host-controls");
const waitText = document.getElementById("wait-text");

const questionContent = document.getElementById("question-content");
const scoreContent = document.getElementById("score-content");

const qText = document.getElementById("q-text");
const timerEl = document.getElementById("timer");
const optionsContainer = document.getElementById("options-container");
const scoreList = document.getElementById("score-list");

/**********************
 * QUESTIONS
 **********************/
const questions = [
     { q: "İstiklal Marşı hangi tarihte kabul edilmiştir?", a: ["12 Mart 1921", "29 Ekim 1923", "23 Nisan 1920", "30 Ağustos 1922"], c: 0 },
    { q: "Mehmet Âkif Ersoy, İstiklal Marşı'nı nerede yazmıştır?", a: ["Ankara Palas", "Taceddin Dergâhı", "Çankaya Köşkü", "Meclis Binası"], c: 1 },
    { q: "İstiklal Marşı hangi ordumuza ithaf edilmiştir?", a: ["Jandarma Kuvvetleri", "Deniz Kuvvetleri", "Kahraman Türk Ordusu", "Kuvayı Milliye"], c: 2 },
    { q: "İstiklal Marşı'nın bestecisi kimdir?", a: ["Mehmet Âkif Ersoy", "Zeki Üngör", "Osman Zeki Üngör", "Cemal Reşit Rey"], c: 2 },
    { q: "Mehmet Âkif Ersoy, ödül olarak verilen parayı nereye bağışlamıştır?", a: ["Kızılay", "Darülmesai", "Çocuk Esirgeme Kurumu", "Türk Hava Kurumu"], c: 1 },
    { q: "İstiklal Marşı toplam kaç kıtadan oluşmaktadır?", a: ["8", "9", "10", "12"], c: 2 },
    { q: "Mehmet Âkif Ersoy'un şiirlerini topladığı eserin adı nedir?", a: ["Safahat", "Çile", "Han-ı Yağma", "Kendi Gök Kubbemiz"], c: 0 },
    { q: "İstiklal Marşı yarışmasına toplam kaç şiir katılmıştır?", a: ["524", "724", "100", "124"], c: 1 },
    { q: "İstiklal Marşı'nın ilk iki kıtası hangi ölçü ile yazılmıştır?", a: ["Hece Ölçüsü", "Serbest Ölçü", "Aruz Ölçüsü", "Mani Tipi"], c: 2 },
    { q: "İstiklal Marşı mecliste ilk kez kim tarafından okunmuştur?", a: ["Mustafa Kemal Atatürk", "Hamdullah Suphi Tanrıöver", "İsmet İnönü", "Kazım Karabekir"], c: 1 },
    { q: "Mehmet Âkif Ersoy aslen nerelidir (Babası)?", a: ["İstanbul", "Ankara", "Arnavutluk (İpek)", "Burdur"], c: 2 },
    { q: "Mehmet Âkif Ersoy'un asıl mesleği nedir?", a: ["Öğretmen", "Asker", "Veteriner Hekim", "Mühendis"], c: 2 },
    { q: "İstiklal Marşı'nın kabul edildiği dönemde Milli Eğitim Bakanı (Maarif Vekili) kimdir?", a: ["Hamdullah Suphi Tanrıöver", "Reşit Galip", "Hasan Ali Yücel", "Tevfik İleri"], c: 0 },
    { q: "Mehmet Âkif Ersoy hangi ilin milletvekilliğini yapmıştır?", a: ["İstanbul", "Ankara", "Burdur", "Çanakkale"], c: 2 },
    { q: "Korkma, sönmez bu şafaklarda yüzen al sancak; / Sönmeden yurdumun üstünde tüten en son ...?", a: ["Ocak", "Bayrak", "Yıldız", "Şafak"], c: 0 },
    { q: "Mehmet Âkif Ersoy ne zaman vefat etmiştir?", a: ["27 Aralık 1936", "10 Kasım 1938", "12 Mart 1921", "29 Ekim 1923"], c: 0 },
    { q: "Mehmet Âkif, Safahat'ın hangi bölümünde Çanakkale şehitlerine yer vermiştir?", a: ["Süleymaniye Kürsüsünde", "Asım", "Hakkın Sesleri", "Hatıralar"], c: 1 },
    { q: "İstiklal Marşı ilk olarak hangi gazetede yayınlanmıştır?", a: ["Hâkimiyet-i Milliye", "Açıksöz", "İrade-i Milliye", "Vakit"], c: 1 },
    { q: "Aşağıdakilerden hangisi Safahat'ın bölümlerinden biri değildir?", a: ["Fatih Kürsüsünde", "Gölgeler", "Çile", "Süleymaniye Kürsüsünde"], c: 2 },
    { q: "Mehmet Âkif Ersoy, İstiklal Marşı'nı neden Safahat'a almamıştır?", a: ["Unuttuğu için", "Milletin eseri olduğu için", "Şiiri beğenmediği için", "Sığmadığı için"], c: 1 }
];

/**********************
 * STATE
 **********************/
let my = { name:"", role:"", room:"", score:0, time:0, answered:false };
let timerVal = 20.0;
let timerInt = null;
let currentQ = -1;
let currentStep = "";

/**********************
 * JOIN
 **********************/
window.joinQuiz = function () {
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

    if (my.role === "host") {
        hostControls.style.display = "block";
        waitText.style.display = "none";
        db.ref("rooms/" + my.room).set({ currentQ: -1, step: "lobby" });
    } else {
        db.ref(`rooms/${my.room}/users/${my.name}`).set({
            score: 0,
            time: 0
        });
    }

    listenRoom();
};

/**********************
 * LISTEN ROOM
 **********************/
function listenRoom() {
    db.ref(`rooms/${my.room}`).on("value", snap => {
        const data = snap.val();
        if (!data || data.currentQ < 0) return;

        if (data.currentQ !== currentQ || data.step !== currentStep) {
            currentQ = data.currentQ;
            currentStep = data.step;
            syncUI();
        }
    });
}

/**********************
 * SYNC UI
 **********************/
function syncUI() {
    waitingView.style.display = "none";
    quizView.style.display = "block";

    if (currentQ >= questions.length) {
        showFinal();
        return;
    }

    if (currentStep === "question") renderQuestion();
    if (currentStep === "reveal") showReveal();
    if (currentStep === "score") renderScore();
}

/**********************
 * QUESTION
 **********************/
function renderQuestion() {
    clearInterval(timerInt);

    timerVal = 20.0;
    my.answered = false;

    questionContent.style.display = "block";
    scoreContent.style.display = "none";

    qText.innerText = questions[currentQ].q;
    timerEl.innerText = "20.0";

    optionsContainer.innerHTML = "";
    questions[currentQ].a.forEach((text, i) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = text;

        if (my.role === "competitor") {
            btn.onclick = () => chooseAnswer(i, btn);
        } else {
            btn.disabled = true;
        }

        optionsContainer.appendChild(btn);
    });

    startTimer();
}

/**********************
 * TIMER (LOCAL)
 **********************/
function startTimer() {
    timerInt = setInterval(() => {
        timerVal = Math.max(0, timerVal - 0.1).toFixed(1);
        timerEl.innerText = timerVal;

        if (timerVal <= 0) {
            clearInterval(timerInt);
            disableOptions();
        }
    }, 100);
}

/**********************
 * ANSWER
 **********************/
function chooseAnswer(index, btn) {
    if (my.answered) return;

    my.answered = true;
    clearInterval(timerInt);

    btn.classList.add("selected-orange");
    disableOptions();

    const correct = index === questions[currentQ].c;
    if (correct) my.score += 5;
    my.time += correct ? (20 - timerVal) : 20;

    db.ref(`rooms/${my.room}/users/${my.name}`).update({
        score: my.score,
        time: my.time
    });
}

/**********************
 * REVEAL
 **********************/
function showReveal() {
    clearInterval(timerInt);
    const correctIdx = questions[currentQ].c;
    const btn = optionsContainer.children[correctIdx];
    if (btn) btn.classList.add("correct-green");
}

/**********************
 * SCORE
 **********************/
function renderScore() {
    questionContent.style.display = "none";
    scoreContent.style.display = "block";

    db.ref(`rooms/${my.room}/users`).once("value", snap => {
        const users = [];
        snap.forEach(x => users.push({ name: x.key, ...x.val() }));
        users.sort((a, b) => b.score - a.score || a.time - b.time);

        scoreList.innerHTML = users.map((u, i) =>
            `<div class="score-row">${i + 1}. ${u.name} - ${u.score} P</div>`
        ).join("");
    });
}

/**********************
 * ADMIN
 **********************/
window.handleAdminAction = function () {
    const ref = db.ref(`rooms/${my.room}`);
    ref.once("value", snap => {
        const d = snap.val();
        if (d.step === "question") ref.update({ step: "reveal" });
        else if (d.step === "reveal") ref.update({ step: "score" });
        else ref.update({ currentQ: d.currentQ + 1, step: "question" });
    });
};

window.startQuiz = function () {
    db.ref(`rooms/${my.room}`).update({
        currentQ: 0,
        step: "question"
    });
};

/**********************
 * UTILS
 **********************/
function disableOptions() {
    document.querySelectorAll(".option-btn").forEach(b => b.disabled = true);
}

function showFinal() {
    quizView.style.display = "none";
    finalView.style.display = "block";
}
