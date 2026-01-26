// FIREBASE YAPILANDIRMASI (Bilgilerini buraya yapıştır)
const firebaseConfig = { apiKey: "AIzaSyBfMm6VcVQ3GoqqsNKbHM2PN1akJFzki_s",
    authDomain: "istiklalmarsiyarismasi.firebaseapp.com",
    databaseURL: "https://istiklalmarsiyarismasi-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "istiklalmarsiyarismasi",
    storageBucket: "istiklalmarsiyarismasi.firebasestorage.app",
    messagingSenderId: "78708182382",
    appId: "1:78708182382:web:efe75268cbdc77c682057f" };
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

let my = { name: "", role: "", room: "", score: 0, time: 0, selected: -1 };
let timerVal = 20.0;
let timerInt;

function joinQuiz() {
    my.name = document.getElementById('userName').value;
    my.room = document.getElementById('roomCode').value;
    my.role = document.getElementById('userRole').value;
    if(!my.name || !my.room) return alert("Eksik bilgi!");

    document.getElementById('login-view').style.display = 'none';
    document.getElementById('waiting-view').style.display = 'block';
    
    if(my.role === 'host') {
        document.getElementById('host-controls').style.display = 'block';
        document.getElementById('wait-text').style.display = 'none';
        db.ref('rooms/' + my.room).set({ currentQ: -1, step: 'lobby' });
    } else {
        db.ref('rooms/' + my.room + '/users/' + my.name).set({ score: 0, time: 0, choice: -1 });
    }
    listen();
}

function listen() {
    db.ref('rooms/' + my.room + '/users').on('value', snap => {
        const list = document.getElementById('player-list');
        list.innerHTML = "";
        snap.forEach(u => { list.innerHTML += `<li>${u.key}</li>`; });
    });

    db.ref('rooms/' + my.room).on('value', snap => {
        const data = snap.val();
        if(!data || data.currentQ < 0) return;
        
        document.getElementById('waiting-view').style.display = 'none';
        document.getElementById('quiz-view').style.display = 'block';
        
        if(data.currentQ >= questions.length) return showFinal();
        syncUI(data.step, data.currentQ);
    });
}

function syncUI(step, qIdx) {
    if(step === 'question') renderQuestion(qIdx);
    else if(step === 'reveal') showCorrectAnswer(qIdx);
    else if(step === 'score') renderScoreboard();
}

function renderQuestion(idx) {
    my.selected = -1;
    document.getElementById('question-content').style.display = 'block';
    document.getElementById('score-content').style.display = 'none';
    document.getElementById('q-text').innerText = questions[idx].q;
    
    const cont = document.getElementById('options-container');
    cont.innerHTML = "";
    questions[idx].a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.id = 'btn-' + i;
        btn.innerText = opt;
        if(my.role === 'competitor') btn.onclick = () => select(i, idx);
        else btn.disabled = true;
        cont.appendChild(btn);
    });

    if(my.role === 'host') {
        document.getElementById('admin-area').style.display = 'block';
        document.getElementById('main-action-btn').innerText = "Cevabı Göster";
    }
    startTimer();
}

function startTimer() {
    clearInterval(timerInt);
    timerVal = 20.0;
    document.getElementById('timer').innerText = "20.0";
    timerInt = setInterval(() => {
        timerVal = (timerVal - 0.1).toFixed(1);
        document.getElementById('timer').innerText = timerVal;
        if(timerVal <= 0) {
            clearInterval(timerInt);
            document.getElementById('timer').innerText = "0.0";
        }
    }, 100);
}

function select(idx, qIdx) {
    if(my.selected !== -1) return; // Zaten seçmişse engelle
    my.selected = idx;
    
    // KRİTİK: Sadece bu yarışmacı için süreyi durdur
    clearInterval(timerInt); 
    
    // Seçeneği turuncu yap
    document.getElementById('btn-' + idx).classList.add('selected-orange');
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

    const isCorrect = idx === questions[qIdx].c;
    const finalTimeUsed = isCorrect ? (20 - parseFloat(timerVal)).toFixed(2) : 20.00;

    if(isCorrect) my.score += 5;
    my.time += parseFloat(finalTimeUsed);

    db.ref('rooms/' + my.room + '/users/' + my.name).update({ 
        score: my.score, time: my.time, choice: idx 
    });
}

function showCorrectAnswer(qIdx) {
    clearInterval(timerInt); // Sunucu bastığında herkesin süresi durur
    const correct = questions[qIdx].c;
    document.getElementById('btn-' + correct).classList.add('correct-green');
    
    if(my.role === 'host') document.getElementById('main-action-btn').innerText = "Puan Durumu";
}

function renderScoreboard() {
    document.getElementById('question-content').style.display = 'none';
    document.getElementById('score-content').style.display = 'block';
    
    db.ref('rooms/' + my.room + '/users').once('value', snap => {
        const u = []; snap.forEach(x => u.push({name: x.key, ...x.val()}));
        u.sort((a,b) => b.score - a.score || a.time - b.time);
        document.getElementById('score-list').innerHTML = u.map((x,i) => `<div class="score-row"><span>${i+1}. ${x.name}</span><span>${x.score} P</span></div>`).join("");
    });

    if(my.role === 'host') document.getElementById('main-action-btn').innerText = "Sonraki Soru";
}

function handleAdminAction() {
    db.ref('rooms/' + my.room).once('value', snap => {
        const s = snap.val().step;
        const q = snap.val().currentQ;
        if(s === 'question') db.ref('rooms/' + my.room).update({ step: 'reveal' });
        else if(s === 'reveal') db.ref('rooms/' + my.room).update({ step: 'score' });
        else if(s === 'score') db.ref('rooms/' + my.room).update({ currentQ: q + 1, step: 'question' });
    });
}

function startQuiz() { db.ref('rooms/' + my.room).update({ currentQ: 0, step: 'question' }); }

function showFinal() {
    document.getElementById('quiz-view').style.display = 'none';
    document.getElementById('final-view').style.display = 'block';
}
