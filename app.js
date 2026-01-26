// ================= FIREBASE =================
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

// ================= SORULAR =================
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

// ================= GLOBAL STATE =================
let my = { name: "", role: "", room: "", score: 0, time: 0, answered: false };
let timer = 20.0;
let interval = null;
let localStep = "";
let localQ = -1;

// ================= JOIN =================
window.joinQuiz = async function () {
    my.name = userName.value.trim();
    my.room = roomCode.value.trim();
    my.role = userRole.value;

    if (!my.name || !my.room) return alert("Bilgileri giriniz");

    const roomRef = db.ref("rooms/" + my.room);
    const snap = await roomRef.once("value");

    if (snap.exists() && snap.val().started && my.role === "competitor") {
        alert("Yarışma başlamıştır");
        return;
    }

    login-view.style.display = "none";
    waiting-view.style.display = "block";
    room-display.innerText = "Oda: " + my.room;

    if (my.role === "host") {
        await roomRef.set({
            started: false,
            currentQ: -1,
            step: "lobby"
        });
        host-controls.style.display = "block";
    } else {
        await roomRef.child("users/" + my.name).set({
            score: 0,
            time: 20,
            answered: false
        });
    }

    listenRoom();
};

// ================= LISTEN =================
function listenRoom() {
    db.ref("rooms/" + my.room).on("value", snap => {
        if (!snap.exists()) return;
        const data = snap.val();

        if (data.currentQ !== localQ || data.step !== localStep) {
            localQ = data.currentQ;
            localStep = data.step;
            syncUI(data);
        }
    });

    db.ref("rooms/" + my.room + "/users").on("value", snap => {
        player-list.innerHTML = "";
        snap.forEach(u => {
            player-list.innerHTML += `<div>${u.key}</div>`;
        });
    });
}

// ================= UI SYNC =================
function syncUI(data) {
    waiting-view.style.display = "none";
    quiz-view.style.display = "block";

    if (data.currentQ >= questions.length) return showFinal();

    if (data.step === "question") renderQuestion(data.currentQ);
    if (data.step === "reveal") revealAnswer(data.currentQ);
    if (data.step === "score") showScores();
}

// ================= QUESTION =================
function renderQuestion(i) {
    my.answered = false;
    timer = 20.0;
    timerEl.innerText = "20.0";

    q-text.innerText = `${i + 1}. ${questions[i].q}`;
    options-container.innerHTML = "";

    questions[i].a.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = opt;
        if (my.role === "competitor") btn.onclick = () => answer(idx, i);
        options-container.appendChild(btn);
    });

    if (my.role === "host") {
        admin-area.style.display = "block";
        main-action-btn.innerText = "Cevabı Göster";
        main-action-btn.disabled = true;
    }

    startTimer();
}

// ================= TIMER =================
function startTimer() {
    clearInterval(interval);
    interval = setInterval(() => {
        timer = (timer - 0.1).toFixed(1);
        timerEl.innerText = timer;
        if (timer <= 0) {
            clearInterval(interval);
            if (my.role === "host") main-action-btn.disabled = false;
        }
    }, 100);
}

// ================= ANSWER =================
function answer(choice, qIdx) {
    if (my.answered) return;
    my.answered = true;
    clearInterval(interval);

    const correct = choice === questions[qIdx].c;
    if (correct) my.score += 5;
    my.time += correct ? (20 - timer) : 20;

    db.ref(`rooms/${my.room}/users/${my.name}`).update({
        score: my.score,
        time: my.time,
        answered: true,
        choice
    });
}

// ================= REVEAL =================
function revealAnswer(i) {
    const correct = questions[i].c;
    document.querySelectorAll(".option-btn")[correct]?.classList.add("correct-green");
    if (my.role === "host") main-action-btn.innerText = "Puan Durumu";
}

// ================= SCORE =================
function showScores() {
    question-content.style.display = "none";
    score-content.style.display = "block";

    db.ref(`rooms/${my.room}/users`).once("value", snap => {
        const arr = [];
        snap.forEach(u => arr.push({ name: u.key, ...u.val() }));
        arr.sort((a, b) => b.score - a.score || a.time - b.time);
        score-list.innerHTML = arr.map((u, i) =>
            `<div>${i + 1}. ${u.name} - ${u.score} P</div>`
        ).join("");
    });

    if (my.role === "host") main-action-btn.innerText = "Sonraki Soru";
}

// ================= ADMIN =================
window.handleAdminAction = function () {
    db.ref("rooms/" + my.room).once("value", snap => {
        const d = snap.val();
        if (d.step === "question") db.ref("rooms/" + my.room).update({ step: "reveal" });
        else if (d.step === "reveal") db.ref("rooms/" + my.room).update({ step: "score" });
        else db.ref("rooms/" + my.room).update({ currentQ: d.currentQ + 1, step: "question" });
    });
};

window.startQuiz = function () {
    db.ref("rooms/" + my.room).update({
        started: true,
        currentQ: 0,
        step: "question"
    });
};

// ================= FINAL =================
function showFinal() {
    quiz-view.style.display = "none";
    final-view.style.display = "block";
}
