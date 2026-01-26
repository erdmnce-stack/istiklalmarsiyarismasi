// 1. FIREBASE AYARLARI (Kendi bilgilerini buraya yapıştır)
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

// 2. SORULAR
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

// 3. OYUN DEĞİŞKENLERİ
let myData = { name: "", role: "", room: "", score: 0, time: 0 };
let currentQuestionIndex = -1;
let timerInterval;

// 4. FONKSİYONLAR
function joinQuiz() {
    myData.name = document.getElementById('userName').value;
    myData.role = document.getElementById('userRole').value;
    myData.room = document.getElementById('roomCode').value;

    if (!myData.name || !myData.room) return alert("Eksik bilgi!");

    db.ref('rooms/' + myData.room + '/status').once('value', (snap) => {
        if (snap.val() === 'started' && myData.role === 'competitor') {
            return alert("Yarışma başladı!");
        }
        document.getElementById('login-view').style.display = 'none';
        document.getElementById('waiting-view').style.display = 'block';
        document.getElementById('display-room-code').innerText = "Oda: " + myData.room;
        initLobby();
    });
}

function initLobby() {
    if(myData.role === 'host') {
        document.getElementById('host-start-area').style.display = 'block';
        document.getElementById('wait-msg').style.display = 'none';
        db.ref('rooms/' + myData.room).update({ status: 'waiting', currentQuestion: -1 });
    } else {
        db.ref('rooms/' + myData.room + '/users/' + myData.name).set({ score: 0, time: 0 });
    }

    db.ref('rooms/' + myData.room + '/users').on('value', (snap) => {
        const list = document.getElementById('player-list');
        list.innerHTML = "";
        snap.forEach(u => {
            const li = document.createElement('li');
            li.innerText = u.key;
            list.appendChild(li);
        });
    });

    db.ref('rooms/' + myData.room + '/currentQuestion').on('value', (snap) => {
        currentQuestionIndex = snap.val();
        if (currentQuestionIndex >= 0) {
            document.getElementById('waiting-view').style.display = 'none';
            document.getElementById('quiz-view').style.display = 'block';
            if (currentQuestionIndex < questions.length) displayQuestion(currentQuestionIndex);
            else showFinalResults();
        }
    });
}

function startQuizNow() {
    db.ref('rooms/' + myData.room).update({ status: 'started', currentQuestion: 0 });
}

function displayQuestion(index) {
    const q = questions[index];
    document.getElementById('question-area').style.display = 'block';
    document.getElementById('mid-scoreboard').style.display = 'none';
    document.getElementById('question-text').innerText = q.q;
    document.getElementById('question-count').innerText = `Soru: ${index+1}/${questions.length}`;
    
    const container = document.getElementById('options-container');
    container.innerHTML = "";
    q.a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        if(myData.role === 'competitor') btn.onclick = () => submitAnswer(i, index, btn);
        else btn.disabled = true;
        container.appendChild(btn);
    });

    if(myData.role === 'host') document.getElementById('admin-controls').style.display = 'block';
    startTimer();
}

function startTimer() {
    clearInterval(timerInterval);
    let timeLeft = 20;
    document.getElementById('timer').innerText = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) finishQuestion();
    }, 1000);
}

function submitAnswer(choice, qIndex, btn) {
    clearInterval(timerInterval);
    const timeTaken = 20 - parseInt(document.getElementById('timer').innerText);
    if (choice === questions[qIndex].c) {
        btn.classList.add('correct');
        myData.score += 5;
        myData.time += timeTaken;
    } else {
        btn.classList.add('wrong');
        myData.time += 20;
    }
    db.ref('rooms/' + myData.room + '/users/' + myData.name).update({ score: myData.score, time: myData.time });
    finishQuestion();
}

function finishQuestion() {
    clearInterval(timerInterval);
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(b => b.disabled = true);
    
    // Ara puan durumunu göster
    document.getElementById('question-area').style.display = 'none';
    document.getElementById('mid-scoreboard').style.display = 'block';
    
    updateScoreboard('leaderboard-list');

    if(myData.role === 'host') document.getElementById('next-btn').disabled = false;
}

function updateScoreboard(targetId) {
    db.ref('rooms/' + myData.room + '/users').once('value', (snap) => {
        const users = [];
        snap.forEach(u => { users.push({ name: u.key, ...u.val() }); });
        users.sort((a, b) => b.score - a.score || a.time - b.time);
        
        document.getElementById(targetId).innerHTML = users.map((u, i) => 
            `<div class="score-row"><span>${i+1}. ${u.name}</span><span>${u.score} P</span></div>`
        ).join("");
    });
}

function nextQuestion() {
    document.getElementById('next-btn').disabled = true;
    db.ref('rooms/' + myData.room).update({ currentQuestion: currentQuestionIndex + 1 });
}

function showFinalResults() {
    document.getElementById('quiz-view').style.display = 'none';
    document.getElementById('result-view').style.display = 'block';
    updateScoreboard('final-leaderboard');
}
