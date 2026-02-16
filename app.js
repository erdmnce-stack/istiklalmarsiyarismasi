// 1. FIREBASE YAPILANDIRMASI
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

// 2. 20 SORULUK BANKA
const questions = [
    { q: "İstiklal Marşı hangi tarihte kabul edilmiştir?", a: ["12 Mart 1921", "29 Ekim 1923", "23 Nisan 1920", "30 Ağustos 1922"], c: 0 },
    { q: "Mehmet Âkif Ersoy, İstiklal Marşı'nı nerede yazmıştır?", a: ["Ankara Palas", "Taceddin Dergâhı", "Çankaya Köşkü", "Meclis Binası"], c: 1 },
    { q: "İstiklal Marşı hangi ordumuza ithaf edilmiştir?", a: ["Jandarma Kuvvetleri", "Deniz Kuvvetleri", "Kahraman Türk Ordusu", "Kuvayı Milliye"], c: 2 },
    { q: "İstiklal Marşı'nın bestecisi kimdir?", a: ["Mehmet Âkif Ersoy", "Şevki Güngör", "Osman Zeki Üngör", "Cemal Reşit Rey"], c: 2 },
    { q: "Mehmet Âkif Ersoy ödül olarak verilen parayı nereye bağışlamıştır?", a: ["Kızılay", "Darülmesai", "Çocuk Esirgeme Kurumu", "Türk Hava Kurumu"], c: 1 },
    { q: "İstiklal Marşı toplam kaç kıtadan oluşmaktadır?", a: ["8", "9", "10", "12"], c: 2 },
    { q: "Mehmet Âkif Ersoy'un şiirlerini topladığı eserin adı nedir?", a: ["Safahat", "Çile", "Han-ı Yağma", "Kendi Gök Kubbemiz"], c: 0 },
    { q: "İstiklal Marşı yarışmasına toplam kaç şiir katılmıştır?", a: ["524", "724", "100", "124"], c: 1 },
    { q: "İstiklal Marşı'nın ilk iki kıtası hangi ölçü ile yazılmıştır?", a: ["Hece Ölçüsü", "Serbest Ölçü", "Aruz Ölçüsü", "Mani Tipi"], c: 2 },
    { q: "İstiklal Marşı mecliste ilk kez kim tarafından okunmuştur?", a: ["Mustafa Kemal Atatürk", "Hamdullah Suphi Tanrıöver", "İsmet İnönü", "Kazım Karabekir"], c: 1 },
    { q: "Mehmet Âkif Ersoy aslen nerelidir (Babası)?", a: ["İstanbul", "Ankara", "Arnavutluk (İpek)", "Burdur"], c: 2 },
    { q: "Mehmet Âkif Ersoy'un asıl mesleği nedir?", a: ["Öğretmen", "Asker", "Veteriner Hekim", "Mühendis"], c: 2 },
    { q: "İstiklal Marşı'nın kabul edildiği dönemde Maarif Vekili kimdir?", a: ["Hamdullah Suphi Tanrıöver", "Reşit Galip", "Hasan Ali Yücel", "Tevfik İleri"], c: 0 },
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
let timerInt = null;
let lastStep = "";
let lastQIdx = -1;

window.joinQuiz = function() {
    my.name = document.getElementById('userName').value;
    my.room = document.getElementById('roomCode').value;
    my.role = document.getElementById('userRole').value;

    if(!my.name || !my.room) return alert("Bilgileri girin!");

    document.getElementById('login-view').style.display = 'none';
    document.getElementById('waiting-view').style.display = 'block';
    document.getElementById('room-display').innerText = "Oda: " + my.room;

    if(my.role === 'host') {
        document.getElementById('host-controls').style.display = 'block';
        // DÜZELTME: update kullanarak kullanıcı listesini silmiyoruz
        db.ref('rooms/' + my.room).update({ currentQ: -1, step: 'lobby' });
    } else {
        db.ref('rooms/' + my.room + '/users/' + my.name).set({ score: 0, time: 0 });
    }
    listen();
}

function listen() {
    // Katılımcı listesi (Lobi)
    db.ref('rooms/' + my.room + '/users').on('value', snap => {
        const list = document.getElementById('player-list');
        list.innerHTML = "";
        snap.forEach(u => { list.innerHTML += `<li>${u.key}</li>`; });
    });

    // Ana Oyun Akışı
    db.ref('rooms/' + my.room).on('value', snap => {
        const data = snap.val();
        if(!data || data.currentQ < 0) return;

        // Puan durumu adımındaysak listeyi her zaman güncelle (yeni cevaplar gelebilir)
        if(data.step === 'score') {
            renderScore(data.users);
            lastStep = 'score';
            lastQIdx = data.currentQ;
            return;
        }

        // Diğer adımlar için tekrar yüklemeyi engelle
        if (data.step === lastStep && data.currentQ === lastQIdx) return;
        lastStep = data.step;
        lastQIdx = data.currentQ;

        document.getElementById('waiting-view').style.display = 'none';
        document.getElementById('quiz-view').style.display = 'block';
        
        if(data.currentQ >= questions.length) return showFinal(data.users);
        syncUI(data.step, data.currentQ);
    });
}

function syncUI(step, qIdx) {
    if(step === 'question') renderQuestion(qIdx);
    else if(step === 'reveal') showReveal(qIdx);
}

function renderQuestion(idx) {
    if(timerInt) clearInterval(timerInt);
    my.selected = -1;
    timerVal = 20.0;
    
    document.getElementById('question-content').style.display = 'block';
    document.getElementById('score-content').style.display = 'none';
    document.getElementById('q-text').innerText = (idx + 1) + ". " + questions[idx].q;
    document.getElementById('timer').innerText = "20.0";
    
    const cont = document.getElementById('options-container');
    cont.innerHTML = "";
    questions[idx].a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.id = 'btn-' + i;
        btn.innerText = opt;
        if(my.role === 'competitor') btn.onclick = () => handleChoice(i, idx);
        else btn.disabled = true;
        cont.appendChild(btn);
    });

    if(my.role === 'host') {
        document.getElementById('admin-area').style.display = 'block';
        document.getElementById('main-action-btn').innerText = "Cevabı Göster";
        document.getElementById('main-action-btn').disabled = true;
    }
    startTimer();
}

function startTimer() {
    timerInt = setInterval(() => {
        timerVal = (parseFloat(timerVal) - 0.1).toFixed(1);
        document.getElementById('timer').innerText = timerVal;
        if(timerVal <= 0) {
            clearInterval(timerInt);
            document.getElementById('timer').innerText = "0.0";
            if(my.role === 'host') document.getElementById('main-action-btn').disabled = false;
        }
    }, 100);
}

function handleChoice(idx, qIdx) {
    if(my.selected !== -1 || timerVal <= 0) return;
    my.selected = idx;
    clearInterval(timerInt); // Yarışmacı için süreyi durdur
    
    document.getElementById('btn-' + idx).classList.add('selected-orange');
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

    const isCorrect = idx === questions[qIdx].c;
    const timeSpent = isCorrect ? (20 - parseFloat(timerVal)) : 20.00;
    if(isCorrect) my.score += 5;
    my.time += parseFloat(timeSpent);

    db.ref('rooms/' + my.room + '/users/' + my.name).update({ 
        score: my.score, time: my.time, choice: idx 
    });
}

function showReveal(qIdx) {
    if(timerInt) clearInterval(timerInt);
    const correct = questions[qIdx].c;
    const btn = document.getElementById('btn-' + correct);
    if(btn) btn.classList.add('correct-green');
    if(my.role === 'host') document.getElementById('main-action-btn').innerText = "Puan Durumu";
}

function renderScore(usersData) {
    document.getElementById('question-content').style.display = 'none';
    document.getElementById('score-content').style.display = 'block';
    
    if(!usersData) return;
    const u = [];
    Object.keys(usersData).forEach(name => {
        u.push({name: name, ...usersData[name]});
    });

    // Sıralama: Önce Puan (Büyük), sonra Süre (Küçük)
    u.sort((a,b) => b.score - a.score || a.time - b.time);

    document.getElementById('score-list').innerHTML = u.map((x,i) => `
        <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid rgba(255,255,255,0.1);">
            <span>${i+1}. ${x.name}</span>
            <span>${x.score} Puan | ${x.time.toFixed(2)} sn</span>
        </div>`).join("");

    if(my.role === 'host') {
        document.getElementById('main-action-btn').innerText = "Sonraki Soru";
        document.getElementById('main-action-btn').disabled = false;
    }
}

window.handleAdminAction = function() {
    db.ref('rooms/' + my.room).once('value', snap => {
        const d = snap.val();
        if(d.step === 'question') db.ref('rooms/' + my.room).update({ step: 'reveal' });
        else if(d.step === 'reveal') db.ref('rooms/' + my.room).update({ step: 'score' });
        else if(d.step === 'score') db.ref('rooms/' + my.room).update({ currentQ: d.currentQ + 1, step: 'question' });
    });
}

window.startQuiz = function() { db.ref('rooms/' + my.room).update({ currentQ: 0, step: 'question' }); }

function showFinal(usersData) {
    document.getElementById('quiz-view').style.display = 'none';
    document.getElementById('final-view').style.display = 'block';
    
    const u = [];
    Object.keys(usersData).forEach(name => { u.push({name: name, ...usersData[name]}); });
    u.sort((a,b) => b.score - a.score || a.time - b.time);
    
    document.getElementById('final-results').innerHTML = u.map((x,i) => `
        <div style="padding:15px; background:rgba(255,255,255,0.1); margin:10px 0; border-radius:10px;">
            <strong>${i+1}. ${x.name}</strong><br>
            <span>Puan: ${x.score} | Toplam Süre: ${x.time.toFixed(2)} sn</span>
        </div>`).join("");
}


