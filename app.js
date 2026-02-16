// 1. FIREBASE YAPILANDIRMASI
const firebaseConfig = {
    apiKey: "AIzaSyBfMm6VcVQ3GoqqsNKbHM2PN1akJFzki_s",
    authDomain: "istiklalmarsiyarismasi.firebaseapp.com",
    databaseURL: "https://istiklalmarsiyarismasi-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "istiklalmarsiyarismasit
    storageBucket: "istiklalmarsiyarismasi.firebasestorage.app",
    messagingSenderId: "78708182382",
    appId: "1:78708182382:web:efe75268cbdc77c682057f"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2. 20 SORULUK BANKA
const questions = [
    { q: "Babasının Mehmet Akif Ersoy’a taktığı isim nedir?", a: ["Ragıyp", "Rakıf", "Ragif", "Refik"], c: 2 },
    { q: "Mehmet Akif’in bildiği diller hangileridir?", a: ["Türkçe, Arapça, Farsça, Fransızca", "Türkçe, Arapça, İngilizce, Rusça", "Türkçe, Almanca, Arapça, İtalyanca", "Türkçe, Fransızca, Almanca, Arapça"], c: 0 },
    { q: "Akif’in okulunu okuduğu meslek hangisidir?", a: ["Öğretmenlik", "Doktorluk", "Katiplik", "Baytarlık"], c: 3 },
    { q: "Akif’in memuriyet hayatını geçirdiği yerler hangileridir?", a: ["Anadolu, Arabistan, Fransa", "Rumeli, Anadolu, Arabistan", "Anadolu, Cezayir, Fas", "Fransa, Anadolu, Mısır"], c: 1 },
    { q: "Mehmet Akif’in ilk şiiri hangi dergide yayınlandı?", a: ["Darülbedayi", "Şiir Mecmuası", "Hazine-i Fünun", "Darülfünun"], c: 2 },
    { q: "Mehmet Akif, batı toplumlarından özellikle nelerin alınması gerektiğini ifade etmiştir?", a: ["Bilim ve fen", "Bilim ve tıp", "Sanayi ve bilim", "Sanat ve Bilim"], c: 3 },
    { q: "Mehmet Akif 1913 yılında iki aylık bir seyahatle hangi ülkeye gitmiştir?", a: ["Cezayir", "Bosna Hersek", "Suriye", "Mısır"], c: 3 },
    { q: "«Ayrılık hissi nasıl girdi sizin beyninize? / Fikr-i Kavmiyeti şeytan mı sokan zihninize» Akif yukarıdaki şiiriyle neye karşı çıkmaya çalışmıştır?", a: ["Fen Bilimlerinden uzaklaşılması", "Geleneklere Önem verilmeyişi", "Milliyetçilik hareketleri", "Parlamento Sistemi"], c: 2 },
    { q: "1920 yılında Akif, İstiklal harbini desteklediği için görevine son verildiği konuşmasını hangi ilde yapmıştır?", a: ["Isparta", "Balıkesir", "Sivas", "Erzurum"], c: 1 },
    { q: "Mehmet Akif’in İstiklal harbini desteklediği yazılar kaleme aldığı Kastamonu’da çıkarılan derginin adı nedir?", a: ["Sebilürreşad", "Sırat-ı Müstakim", "Hazine-i Fünun", "Mecmua-ı Havadis"], c: 0 },
    { q: "Mehmet Akif hangi ilin milletvekili seçilerek meclise girmiştir?", a: ["Balıkesir", "Kastamonu", "Burdur", "Isparta"], c: 2 },
    { q: "Akif’in yazdığı şiirleri bir araya getirdiği kitabının ismi nedir?", a: ["Akifname", "Asım’ın nesli", "Mesnevi", "Safahat"], c: 3 },
    { q: "Mehmet Akif’in yaşadığı yıllar arası aşağıdakilerden hangisidir?", a: ["1881 – 1938", "1873 – 1936", "1888 – 1946", "1866 - 1940"], c: 1 },
    { q: "Mehmet Akif’in şiirlerinde benimsediği tarz hangisidir?", a: ["Gerçekçi", "Hayalperest", "Sanatı Öne çıkaran", "Kendini Yücelten"], c: 0 },
    { q: "İstiklal Marşı’nın mecliste kabul edildiği tarih hangisidir?", a: ["12 Mart 1920", "12 Mart 1922", "12 Mart 1921", "23 Nisan 1920"], c: 2 },
    { q: "Milli Marş’ı seçmek için yapılan yarışmada Akif’in de sıcak bakmadığı para ödülünün miktarı nedir?", a: ["1000 lira", "5000 lira", "50 lira", "500 Lira"], c: 3 },
    { q: "Akif’in çocukluk dönemi mizacı (karakter yapısı) nasıldır?", a: ["Ele avuca sığmayan", "Her zaman ciddiyet sahibi", "Sürekli ders çalışan", "Her söylenileni yapan"], c: 0 },
    { q: "Akif İstiklal marşı için verilmek istenen ödülü nereye bağışlamıştır?", a: ["Darülazece", "Hilal-i Ahmer", "Hazine-i Osmaniye", "Vakıflar Müdürlüğü"], c: 1 },
    { q: "Mehmet Akif şiirlerinde daha çok hangi ölçüyü kullanmıştır?", a: ["Hece ölçüsü", "Serbest ölçü", "Beyit", "Aruz Ölçüsü"], c: 3 },
    { q: "Mehmet Akif Ersoy’un babası Tahir Efendi’nin kökü nereden gelmektedir?", a: ["Buhara", "Arnavutluk", "İstanbul", "Mısır"], c: 1 },
];

let my = { name: "", role: "", room: "", score: 0, time: 0, selected: -1 };
let timerVal = 30.0;
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

        // GÜNCELLEME: renderScore'a data.currentQ parametresini ekledik
        if(data.step === 'score') {
            renderScore(data.users, data.currentQ);
            lastStep = 'score';
            lastQIdx = data.currentQ;
            return;
        }

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
        
        // SÜRE BİTTİĞİNDE YAPILACAKLAR
        if(timerVal <= 0) {
            clearInterval(timerInt);
            document.getElementById('timer').innerText = "0.0";
            
            // --- DEĞİŞİKLİK BURADA BAŞLIYOR ---
            // Eğer kullanıcı yarışmacıysa VE hala seçim yapmadıysa (-1 ise)
            if(my.role === 'competitor' && my.selected === -1) {
                my.time += 20; // Toplam süreye 20 sn ekle
                
                // Veritabanına "Boş Bıraktı" (-1) olarak kaydet
                db.ref('rooms/' + my.room + '/users/' + my.name).update({ 
                    score: my.score, 
                    time: my.time,
                    choice: -1 
                });
            }
            // --- DEĞİŞİKLİK BURADA BİTİYOR ---

            if(my.role === 'host') document.getElementById('main-action-btn').disabled = false;
        }
    }, 100);
}

function handleChoice(idx, qIdx) {
    if(my.selected !== -1 || timerVal <= 0) return;
    my.selected = idx;
    clearInterval(timerInt);
    
    document.getElementById('btn-' + idx).classList.add('selected-orange');
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

    const isCorrect = idx === questions[qIdx].c;
    const timeSpent = (20 - parseFloat(timerVal)) ;
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

// GÜNCELLEME: currentQIdx parametresini ve ikon mantığını ekledik
function renderScore(usersData, currentQIdx) {
    document.getElementById('question-content').style.display = 'none';
    document.getElementById('score-content').style.display = 'block';
    
    if(!usersData) return;
    
    // Doğru cevap şıkkı (0, 1, 2, 3)
    const correctAns = (questions[currentQIdx]) ? questions[currentQIdx].c : -1;

    const u = [];
    Object.keys(usersData).forEach(name => {
        u.push({name: name, ...usersData[name]});
    });

    // Sıralama: Önce Puan (Büyük), sonra Süre (Küçük)
    u.sort((a,b) => b.score - a.score || a.time - b.time);

    document.getElementById('score-list').innerHTML = u.map((x,i) => {
        // İKON BELİRLEME: Kullanıcının seçimi doğru cevapla aynı mı?
        let statusIcon;
        if (x.choice === correctAns) {
            statusIcon = '<span style="color: #2ecc71; margin-right:8px; font-size:1.2em;">✅</span>'; // Yeşil Tik
        } else {
            statusIcon = '<span style="color: #e74c3c; margin-right:8px; font-size:1.2em;">❌</span>'; // Kırmızı Çarpı
        }

        return `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid rgba(255,255,255,0.1);">
            <div style="display:flex; align-items:center;">
                <span style="width:25px; font-weight:bold;">${i+1}.</span>
                ${statusIcon}
                <span>${x.name}</span>
            </div>
            <div style="text-align:right;">
                <span style="display:block; font-weight:bold;">${x.score} Puan</span>
                <span style="font-size:0.85em; opacity:0.8;">${x.time.toFixed(2)} sn</span>
            </div>
        </div>`;
    }).join("");

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




