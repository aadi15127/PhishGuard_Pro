// REPLACE THESE WITH YOUR JSONBIN.IO KEYS
const BIN_ID = '69b559ecaa77b81da9e3cd82'; 
const API_KEY = '$2a$10$VhSGWLceggJx3MTI0E.nSuttor1nx4cxUr4eO0RsZHD7BXLcR4pdG';
const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

function closeIntro() { document.getElementById('intro-popup').style.display = 'none'; }

function goHome() { 
    document.querySelectorAll('main, section').forEach(s => s.style.display='none');
    document.getElementById('home-page').style.display='block';
    updateLeaderboard(); 
}

function openComparison() { 
    document.querySelectorAll('main, section').forEach(s => s.style.display='none'); 
    document.getElementById('comparison-page').style.display='block'; 
}

function openScanner() { 
    document.querySelectorAll('main, section').forEach(s => s.style.display='none'); 
    document.getElementById('scanner-page').style.display='block'; 
}

// --- GLOBAL SYNC LOGIC ---
async function updateLeaderboard() {
    const list = document.getElementById('leaderboard-list');
    try {
        const res = await fetch(URL, { headers: { 'X-Master-Key': API_KEY }});
        const data = await res.json();
        const leaders = data.record;
        list.innerHTML = leaders.sort((a,b)=>b.score-a.score).slice(0,5).map(l => `<div class="leader-entry"><span>${l.name}</span><span>${l.score}/5</span></div>`).join('');
    } catch (e) { list.innerHTML = "Offline Mode"; }
}

async function saveScoreCloud(name, score) {
    try {
        const res = await fetch(URL, { headers: { 'X-Master-Key': API_KEY }});
        const data = await res.json();
        let leaders = data.record;
        leaders.push({name, score});
        await fetch(URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
            body: JSON.stringify(leaders)
        });
        updateLeaderboard();
    } catch (e) { console.log("Save error", e); }
}

// --- SCANNER LOGIC ---
function runSimpleScan() {
    const val = document.getElementById('url-in').value;
    const res = (val.includes('.xyz') || !val.startsWith('https')) ? "🚩 Red Flag Found!" : "✅ Looks standard.";
    document.getElementById('scan-out').innerHTML = `<p>${res}</p>`;
}

// --- QUIZ LOGIC ---
const questions = [
    { q: "Link: 'pay-pa1.com'. Safe?", a: ["Yes", "No"], c: 1, e: "Trick: '1' used instead of 'l'." },
    { q: "Is 'http://google.com' (No S) safe?", a: ["Yes", "No"], c: 1, e: "The 'S' means Secure." },
    { q: "Netflix link ends in '.xyz'. Safe?", a: ["Yes", "No"], c: 1, e: "Strange endings are dangerous." },
    { q: "Email says: 'Click now or lose account!'. This is:", a: ["Professional", "Panic Trick"], c: 1, e: "Fear is a phishing tactic." },
    { q: "Is 'netfIix.com' (Capital i) safe?", a: ["Yes", "No"], c: 1, e: "Hackers use similar letters." }
];

let currentQ = 0, score = 0;

function openQuiz() { 
    document.querySelectorAll('main, section').forEach(s => s.style.display='none'); 
    document.getElementById('quiz-page').style.display='block'; 
    currentQ=0; score=0; loadQ(); 
}

function loadQ() {
    const d = questions[currentQ];
    document.getElementById('quiz-q-text').innerText = d.q;
    document.getElementById('quiz-feedback').innerText = "";
    document.getElementById('next-btn').style.display = "none";
    const optDiv = document.getElementById('quiz-options');
    optDiv.innerHTML = '';
    d.a.forEach((o, i) => {
        const b = document.createElement('button');
        b.className = 'btn-outline'; b.style.width="100%"; b.style.margin="5px 0"; b.innerText = o;
        b.onclick = () => {
            if(i === d.c) { b.style.background="var(--primary)"; b.style.color="#000"; score++; }
            else { b.style.background="var(--danger)"; }
            document.getElementById('quiz-feedback').innerHTML = d.e;
            document.getElementById('next-btn').style.display = "block";
        };
        optDiv.appendChild(b);
    });
}

function nextQuestion() {
    currentQ++;
    if(currentQ < questions.length) loadQ();
    else {
        const name = prompt("Score: " + score + "/5. Enter name for Global Rank:");
        if(name) saveScoreCloud(name, score);
        goHome();
    }
}

// Radar Ping Effect
setInterval(() => {
    const radar = document.getElementById('radar-screen');
    if(radar) {
        const ping = document.createElement('div');
        ping.className = 'threat-ping';
        ping.style.left = Math.random()*90+'%'; ping.style.top = Math.random()*90+'%';
        radar.appendChild(ping);
        setTimeout(()=>ping.remove(), 2000);
        document.getElementById('threat-val').innerText = Math.floor(Math.random()*200);
    }
}, 3000);

updateLeaderboard();