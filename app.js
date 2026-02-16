// 1. FIREBASE AYARLARI
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

// 2. SORU BANKASI
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
    { q: "Milli marşımızın belirlenmesi için yapılan yarışmaya kaç şiir katılmıştır?", a: ["743", "724", "732", "721"], c: 1 },
    { q: "Mehmet Akif’in yaşadığı yıllar arası aşağıdakilerden hangisidir?", a: ["1881 – 1938", "1873 – 1936", "1888 – 1946", "1866 - 1940"], c: 1 },
    { q: "Mehmet Akif’in şiirlerinde benimsediği tarz hangisidir?", a: ["Gerçekçi", "Hayalperest", "Sanatı Öne çıkaran", "Kendini Yücelten"], c: 0 },
    { q: "İstiklal Marşı’nın mecliste kabul edildiği tarih hangisidir?", a: ["12 Mart 1920", "12 Mart 1922", "12 Mart 1921", "23 Nisan 1920"], c: 2 },
    { q: "Milli Marş’ı seçmek için yapılan yarışmada Akif’in de sıcak bakmadığı para ödülünün miktarı nedir?", a: ["1000 lira", "5000 lira", "50 lira", "500 Lira"], c: 3 },
    { q: "Akif, 1911’de Safahat isimli kitabını yayımladığında kaç yaşındaydı?", a: ["32", "42", "38", "35"], c: 2 },
    { q: "Mehmet Akif Ersoy’un mezarı nerededir?", a: ["İstanbul", "Burdur", "Çanakkale", "Ankara"], c: 0 },
    { q: "Akif’in başarılı olduğu spor dallarından biri hangisidir?", a: ["Futbol", "Güreş", "Halter", "Basketbol"], c: 1 },
    { q: "Allah bu millete… sözünü tamamlayınız.", a: ["Yokluk göstermesin.", "Güç ve kuvvet versin.", "Bir daha İstiklal marşı yazdırmasın.", "Yenilgi yüzü göstermesin."], c: 2 },
    { q: "Akif’in çocukluk dönemi mizacı (karakter yapısı) nasıldır?", a: ["Ele avuca sığmayan", "Her zaman ciddiyet sahibi", "Sürekli ders çalışan", "Her söylenileni yapan"], c: 0 },
    { q: "Akif İstiklal marşı için verilmek istenen ödülü nereye bağışlamıştır?", a: ["Darülazece", "Hilal-i Ahmer", "Hazine-i Osmaniye", "Vakıflar Müdürlüğü"], c: 1 },
    { q: "Mehmet Akif şiirlerinde daha çok hangi ölçüyü kullanmıştır?", a: ["Hece ölçüsü", "Serbest ölçü", "Beyit", "Aruz Ölçüsü"], c: 3 },
    { q: "Mehmet Akif Ersoy’un babası Tahir Efendi’nin kökü nereden gelmektedir?", a: ["Buhara", "Arnavutluk", "İstanbul", "Mısır"], c: 1 },
    { q: "Mehmet Akif Ersoy kaç yılında ve nerede doğmuştur?", a: ["20 Aralık İstanbul", "20 Aralık Fatih", "21 Aralık Mısır", "21 Aralık İstanbul"], c: 1 },
    { q: "Mehmet Akif Ersoy’un ilk gittiği okulun adı nedir?", a: ["Emir Buhari Mektebi", "Mülkiye Mektebi", "Mahalle Mektebi", "Merkez Rüştiyesi"], c: 0 },
    { q: "1914 Ağustos’ta basılan Safahat’ın dördüncü kitabı hangisidir?", a: ["Hakk’ın Sesleri", "Süleymaniye Kürsüsünde", "Hatıralar", "Fatih Kürsüsünde"], c: 3 },
    { q: "Mehmet Akif Ersoy aşağıdaki spor dallarından hangisi ile ilgilenmemiştir?", a: ["Uzun atlama", "Yüzme", "Güreş", "Koşu"], c: 0 },
    { q: "Mehmet Akif Ersoy hangi hastalıktan vefat etmiştir?", a: ["Siroz", "Verem", "Kanser", "Kabakulak"], c: 0 },
    { q: "Mehmet Akif Ersoy’un annesinin adı nedir?", a: ["İsmet Hanım", "Emine Şerife Hanım", "Melahat Hanım", "Fatma Hanım"], c: 1 },
    { q: "Mehmet Akif Ersoy’un eşinin adı nedir?", a: ["Emine Şerife Hanım", "Nurbanu Hanım", "Fatma Hanım", "İsmet Hanım"], c: 3 },
    { q: "Mehmet Akif Ersoy’un Kastamonu’da coşkulu bir şekilde vaaz verdiği ve Kurtuluş Savaşı’nın iç yüzünü anlattığı camiinin adı nedir?", a: ["Süleymaniye Camii", "Zağanos Paşa Camii", "Şehzadepaşa Camii", "Nasrullah Camii"], c: 3 }
];

let my = { name: "", role: "", room: "", score: 0, time: 0, selected: -1 };
let timerVal = 20.0;
let timerInt = null;
let lastStep = "";
let lastQIdx = -1;

// 3. GİRİŞ İŞLEMLERİ
window.joinQuiz = function() {
    my.name = document.getElementById('userName').value;
    my.room = document.getElementById('roomCode').value;
    my.role = document.getElementById('userRole').value;

    if(!my.name || !my.room) return alert("Lütfen isim ve oda kodu giriniz!");

    document.getElementById('login-view').style.display = 'none';
    document.getElementById('waiting-view').style.display = 'block';
    document.getElementById('room-display').innerText = "Oda: " + my.room;

    if(my.role === 'host') {
        document.getElementById('host-controls').style.display = 'block';
        // Odayı sıfırla veya başlat
        db.ref('rooms/' + my.room).update({ currentQ: -1, step: 'lobby' });
    } else {
        // Yarışmacı kaydı
        db.ref('rooms/' + my.room + '/users/' + my.name).set({ score: 0, time: 0 });
    }
    listen();
}

// 4. VERİTABANI DİNLEME (LISTEN)
function listen() {
    // Katılımcı listesi
    db.ref('rooms/' + my.room + '/users').on('value', snap => {
        const list = document.getElementById('player-list');
        list.innerHTML = "";
        if(snap.val()) {
            snap.forEach(u => { list.innerHTML += `<li>${u.key}</li>`; });
        }
    });

    // Oyun durumu
    db.ref('rooms/' + my.room).on('value', snap => {
        const data = snap.val();
        if(!data || data.currentQ < 0) return;

        // Puan tablosu adımı
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

// 5. OYUN EKRANI FONKSİYONLARI
function renderQuestion(idx) {
    if(timerInt) clearInterval(timerInt);
    
    // Değerleri sıfırla
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
        if(my.role === 'competitor') {
            btn.onclick = () => handleChoice(i, idx);
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
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
        
        // SÜRE BİTTİ
        if(parseFloat(timerVal) <= 0) {
            clearInterval(timerInt);
            document.getElementById('timer').innerText = "0.0";
            
            // Yarışmacı seçmediyse ceza uygula
            if(my.role === 'competitor' && my.selected === -1) {
                applyPenalty();
            }

            if(my.role === 'host') document.getElementById('main-action-btn').disabled = false;
        }
    }, 100);
}

function handleChoice(idx, qIdx) {
    if(my.selected !== -1 || parseFloat(timerVal) <= 0) return;
    
    my.selected = idx;
    clearInterval(timerInt);
    
    document.getElementById('btn-' + idx).classList.add('selected-orange');
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);

    const isCorrect = idx === questions[qIdx].c;
    
    // Yanlış da olsa sadece geçen süreyi ekle
    const timeSpent = 20 - parseFloat(timerVal);

    if(isCorrect) my.score += 5;
    my.time = parseFloat(my.time || 0) + parseFloat(timeSpent);

    db.ref('rooms/' + my.room + '/users/' + my.name).update({ 
        score: my.score, time: my.time, choice: idx 
    });
}

// CEZA FONKSİYONU (Boş bırakanlar için)
function applyPenalty() {
    my.selected = -2; // Tekrar çalışmasını önle
    my.time = parseFloat(my.time || 0) + 20; // 20 saniye ceza
    
    db.ref('rooms/' + my.room + '/users/' + my.name).update({ 
        score: my.score, 
        time: my.time,
        choice: -1 // -1 = Boş
    });
}

function showReveal(qIdx) {
    if(timerInt) clearInterval(timerInt);

    // Hoca cevabı açtığında hala seçilmediyse ceza kes
    if(my.role === 'competitor' && my.selected === -1) {
        applyPenalty();
    }

    const correct = questions[qIdx].c;
    const btn = document.getElementById('btn-' + correct);
    if(btn) btn.classList.add('correct-green');
    
    if(my.role === 'host') document.getElementById('main-action-btn').innerText = "Puan Durumu";
}

function renderScore(usersData, currentQIdx) {
    document.getElementById('question-content').style.display = 'none';
    document.getElementById('score-content').style.display = 'block';
    
    if(!usersData) return;
    
    const correctAns = (questions[currentQIdx]) ? questions[currentQIdx].c : -1;

    const u = [];
    Object.keys(usersData).forEach(name => {
        u.push({name: name, ...usersData[name]});
    });

    // Puan (büyükten küçüğe) -> Süre (küçükten büyüğe)
    u.sort((a,b) => b.score - a.score || a.time - b.time);

    document.getElementById('score-list').innerHTML = u.map((x,i) => {
        let statusIcon;
        if (x.choice === undefined || x.choice === -1) {
            statusIcon = '<span style="color: #95a5a6; margin-right:8px;">➖</span>'; 
        } else if (x.choice === correctAns) {
            statusIcon = '<span style="color: #2ecc71; margin-right:8px;">✅</span>'; 
        } else {
            statusIcon = '<span style="color: #e74c3c; margin-right:8px;">❌</span>';
        }

        // x.time undefined gelirse 0 kabul et
        const timeDisplay = parseFloat(x.time || 0).toFixed(2);

        return `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid rgba(255,255,255,0.1);">
            <div style="display:flex; align-items:center;">
                <span style="width:25px; font-weight:bold;">${i+1}.</span>
                ${statusIcon}
                <span>${x.name}</span>
            </div>
            <div style="text-align:right;">
                <span style="display:block; font-weight:bold;">${x.score} Puan</span>
                <span style="font-size:0.85em; opacity:0.8;">${timeDisplay} sn</span>
            </div>
        </div>`;
    }).join("");

    if(my.role === 'host') {
        document.getElementById('main-action-btn').innerText = "Sonraki Soru";
        document.getElementById('main-action-btn').disabled = false;
    }
}

// 6. YÖNETİCİ BUTONLARI
window.handleAdminAction = function() {
    db.ref('rooms/' + my.room).once('value', snap => {
        const d = snap.val();
        if(d.step === 'question') db.ref('rooms/' + my.room).update({ step: 'reveal' });
        else if(d.step === 'reveal') db.ref('rooms/' + my.room).update({ step: 'score' });
        else if(d.step === 'score') db.ref('rooms/' + my.room).update({ currentQ: d.currentQ + 1, step: 'question' });
    });
}

window.startQuiz = function() { 
    db.ref('rooms/' + my.room).update({ currentQ: 0, step: 'question' }); 
}

function showFinal(usersData) {
    document.getElementById('quiz-view').style.display = 'none';
    document.getElementById('final-view').style.display = 'block';
    
    const u = [];
    if(usersData) {
        Object.keys(usersData).forEach(name => { u.push({name: name, ...usersData[name]}); });
        u.sort((a,b) => b.score - a.score || a.time - b.time);
    }
    
    document.getElementById('final-results').innerHTML = u.map((x,i) => `
        <div style="padding:15px; background:rgba(255,255,255,0.1); margin:10px 0; border-radius:10px;">
            <strong>${i+1}. ${x.name}</strong><br>
            <span>Puan: ${x.score} | Toplam Süre: ${parseFloat(x.time || 0).toFixed(2)} sn</span>
        </div>`).join("");
}
