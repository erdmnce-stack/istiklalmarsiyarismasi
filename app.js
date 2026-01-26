// FIREBASE BİLGİLERİNİ BURAYA YAPIŞTIR
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

let myInfo = { name: "", role: "", room: "", score: 0, time: 0, hasAnswered: false };
let timerVal = 20.0;
let timerInterval;

function joinQuiz() {
    myInfo.name = document.getElementById('userName').value;
    myInfo.room = document.getElementById('roomCode').value;
    myInfo.role = document.getElementById('userRole').value;

    if(!myInfo.name || !myInfo.room) return alert("Bilgileri girin!");

    document.getElementById('login-view').style.display = 'none';
    document.getElementById('waiting-view').style.display = 'block';
    document.getElementById('room-display').innerText = "Oda: " + myInfo.room;

    if(myInfo.role === 'host') {
        document.getElementById('host-controls').style.display = 'block';
        document.getElementById('wait-text').style.display = 'none';
        db.ref('rooms/' + myInfo.room).set({ currentQ: -1, step: 'lobby' });
    } else {
        db.ref('rooms/' + myInfo.room + '/users/' + myInfo.name).set({ score: 0, time: 0 });
    }

    listenRoom();
}

function listenRoom() {
    // Katılımcı listesini dinle
    db.ref('rooms/' + myInfo.room + '/users').on('value', (snap) => {
        const list = document.getElementById('player-list');
        list.innerHTML = "";
        snap.forEach(u => { list.innerHTML += `<li>${u.key}</li>`; });
    });

    // Oyun durumunu dinle
    db.ref('rooms/' + myInfo.room).on('value', (snap) => {
        const data = snap.val();
        if(!data) return;

        if(data.currentQ >= 0) {
            document.getElementById('waiting-view').style.display = 'none';
            document.getElementById('quiz-view').style.display = 'block';
            updateUI(data);
        }
        if(data.currentQ >= questions.length) showFinal(data);
    });
}

function updateUI(data) {
    const qIndex = data.currentQ;
    const step = data.step;

    if(step === 'question') {
        renderQuestion(qIndex);
    } else if(step === 'reveal') {
        renderReveal(qIndex);
    } else if(step === 'score') {
        renderScore();
    }
}

function renderQuestion(idx) {
    clearInterval(timerInterval);
    myInfo.hasAnswered = false;
    document.getElementById('question-content').style.display = 'block';
    document.getElementById('score-content').style.display = 'none';
    document.getElementById('q-text').innerText = questions[idx].q;
    
    const container = document.getElementById('options-container');
    container.innerHTML = "";
    questions[idx].a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.id = 'btn-' + i;
        btn.innerText = opt;
        if(myInfo.role === 'competitor') btn.onclick = () => handleAnswer(i, idx);
        else btn.disabled = true;
        container.appendChild(btn);
    });

    if(myInfo.role === 'host') {
        document.getElementById('admin-area').style.display = 'block';
        document.getElementById('main-action-btn').innerText = "Cevabı Göster";
        document.getElementById('main-action-btn').disabled = true;
    }
    
    runTimer();
}

function runTimer() {
    timerVal = 20.0;
    timerInterval = setInterval(() => {
        timerVal = (timerVal - 0.1).toFixed(1);
        document.getElementById('timer').innerText = timerVal;
        if(timerVal <= 0) {
            clearInterval(timerInterval);
            if(myInfo.role === 'host') document.getElementById('main-action-btn').disabled = false;
        }
    }, 100);
}

function handleAnswer(choice, qIdx) {
    if(myInfo.hasAnswered) return;
    myInfo.hasAnswered = true;
    clearInterval(timerInterval); // Yarışmacı için süre durur
    
    document.getElementById('btn-' + choice).classList.add('selected-orange');
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

    const isCorrect = choice === questions[qIdx].c;
    const timeSpent = (20 - parseFloat(timerVal)).toFixed(2);
    
    if(isCorrect) {
        myInfo.score += 5;
        myInfo.time += parseFloat(timeSpent);
    } else {
        myInfo.time += 20;
    }
    
    db.ref('rooms/' + myInfo.room + '/users/' + myInfo.name).update({ score: myInfo.score, time: myInfo.time, lastChoice: choice });
}

function renderReveal(idx) {
    clearInterval(timerInterval);
    const correct = questions[idx].c;
    document.getElementById('btn-' + correct).classList.add('correct-green');
    
    if(myInfo.role === 'host') {
        document.getElementById('main-action-btn').innerText = "Puan Durumu";
    }
}

function renderScore() {
    document.getElementById('question-content').style.display = 'none';
    document.getElementById('score-content').style.display = 'block';
    
    db.ref('rooms/' + myInfo.room + '/users').once('value', (snap) => {
        const users = []; snap.forEach(u => { users.push({name: u.key, ...u.val()}); });
        users.sort((a,b) => b.score - a.score || a.time - b.time);
        document.getElementById('score-list').innerHTML = users.map((u,i) => `<div>${i+1}. ${u.name} - ${u.score}P</div>`).join("");
    });

    if(myInfo.role === 'host') {
        document.getElementById('main-action-btn').innerText = "Sonraki Soru";
    }
}

function handleAdminAction() {
    db.ref('rooms/' + myInfo.room).once('value', (snap) => {
        const data = snap.val();
        if(data.step === 'question') db.ref('rooms/' + myInfo.room).update({ step: 'reveal' });
        else if(data.step === 'reveal') db.ref('rooms/' + myInfo.room).update({ step: 'score' });
        else if(data.step === 'score') db.ref('rooms/' + myInfo.room).update({ currentQ: data.currentQ + 1, step: 'question' });
    });
}

function startQuiz() { db.ref('rooms/' + myInfo.room).update({ currentQ: 0, step: 'question' }); }

function showFinal(data) {
    document.getElementById('quiz-view').style.display = 'none';
    document.getElementById('final-view').style.display = 'block';
    // Final sıralama renderScore ile aynı mantık
}
