import { behaviors, quotes, scenarios, tilts, mantras, games, locations, lifeGameQuestions } from './data.js';

// --- STATE ---
const state = {};

// Helper: Get Unique Random Item
function getUniqueRandomItem(key, sourceList) {
    if (!state[key] || state[key].length === 0) {
        state[key] = [...sourceList];
    }
    const randomIndex = Math.floor(Math.random() * state[key].length);
    return state[key].splice(randomIndex, 1)[0];
}

// Helper: Audio Playback (Synthetic)
function playSound(type) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'bell') {
        // Dzwonek (High pitch, clear)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        osc.start();
        osc.stop(ctx.currentTime + 1.5);
    } else if (type === 'horn') {
        // Trąbka/Buzzer (Sawtooth, harsh)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    }
}

// --- LOGIC ---

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('fade-in'); 
    });
    document.querySelectorAll('.nav-btn').forEach(el => {
        el.classList.remove('active-tab', 'text-amber-500', 'border-amber-500');
        el.classList.add('border-transparent');
    });

    const content = document.getElementById(`content-${tabName}`);
    if(content) {
        content.classList.remove('hidden');
        void content.offsetWidth; // Reflow
        content.classList.add('fade-in');
    }
    
    const btn = document.querySelector(`button[data-tab="${tabName}"]`);
    if(btn) {
        btn.classList.add('active-tab', 'text-amber-500', 'border-amber-500');
        btn.classList.remove('border-transparent');
    }
}

// Generator: Single Behavior
function generateBehavior() {
    const categoryEl = document.getElementById('behavior-category');
    const category = categoryEl.value;
    const list = behaviors[category];
    const randomItem = getUniqueRandomItem(`behavior_${category}`, list);
    
    const display = document.getElementById('behavior-display');
    const catText = categoryEl.options[categoryEl.selectedIndex].text;

    display.innerHTML = `
        <div class="fade-in">
            <h3 class="text-amber-500 font-bold text-xs mb-2 uppercase tracking-wide opacity-80">${catText}</h3>
            <p class="text-xl md:text-2xl font-bold text-white leading-relaxed">"${randomItem}"</p>
        </div>
    `;
}

// Generator: Status Mixer
function generateMixedBehaviors() {
    const cat1 = document.getElementById('mixer-cat-1').value;
    const cat2 = document.getElementById('mixer-cat-2').value;
    
    const item1 = getUniqueRandomItem(`behavior_${cat1}`, behaviors[cat1]);
    const item2 = getUniqueRandomItem(`behavior_${cat2}`, behaviors[cat2]);
    
    const display = document.getElementById('mixer-display');
    
    const cardClass = "bg-neutral-900 p-6 rounded border border-neutral-700 flex flex-col items-center justify-center text-center fade-in";
    const labelClass = "text-xs uppercase font-bold mb-2 text-neutral-500";
    
    display.innerHTML = `
        <div class="${cardClass}">
            <span class="${labelClass}">Cechy listy 1</span>
            <p class="text-lg font-bold text-amber-100">"${item1}"</p>
        </div>
        <div class="${cardClass}">
            <span class="${labelClass}">Cechy listy 2</span>
            <p class="text-lg font-bold text-amber-100">"${item2}"</p>
        </div>
    `;
}

// Generator: Life Game Question
function generateLifeQuestion() {
    const item = getUniqueRandomItem('life_questions', lifeGameQuestions);
    const display = document.getElementById('life-question-text');
    display.classList.remove('fade-in');
    void display.offsetWidth;
    display.innerText = `"${item}"`;
    display.classList.add('fade-in');
}

// Generic Generators
function simpleGenerate(sourceId, targetId, listKey, listData, colorClass) {
    const item = getUniqueRandomItem(listKey, listData);
    document.getElementById(targetId).innerHTML = `
        <span class="fade-in text-lg font-bold ${colorClass}">"${item}"</span>
    `;
}

function nextCoachQuote() {
    const item = getUniqueRandomItem('quotes', quotes);
    const display = document.getElementById('coach-display');
    display.innerText = `"${item}"`;
}

// Games Rendering
function renderGames() {
    const container = document.getElementById('games-list');
    if (!container) return;
    
    container.innerHTML = games.map(game => `
        <div class="game-card bg-neutral-800 p-5 rounded-lg border border-neutral-700 hover:border-amber-500 hover:bg-neutral-750 transition cursor-pointer group" data-id="${game.id}">
            <div class="flex justify-between items-start">
                <h3 class="text-lg font-bold text-amber-100 group-hover:text-amber-400 mb-1">
                    ${game.title}
                </h3>
                ${game.players ? `<span class="text-xs bg-neutral-900 px-2 py-1 rounded text-neutral-400"><i class="fas fa-users mr-1"></i>${game.players}</span>` : ''}
            </div>
            <span class="text-xs uppercase tracking-wide text-neutral-500 group-hover:text-neutral-300 block mt-1">${game.category}</span>
        </div>
    `).join('');

    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => {
            openGameDetails(parseInt(card.getAttribute('data-id')));
        });
    });
}

function openGameDetails(id) {
    const game = games.find(g => g.id === id);
    if (!game) return;

    document.getElementById('modal-game-title').innerText = game.title;
    document.getElementById('modal-game-category').innerText = game.category;
    document.getElementById('modal-game-desc').innerText = game.description;
    document.getElementById('modal-game-goal').innerText = game.goal;
    document.getElementById('game-details-modal').classList.remove('hidden');
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    // Tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.currentTarget.getAttribute('data-tab')));
    });

    // Generators
    document.getElementById('btn-generate-behavior')?.addEventListener('click', generateBehavior);
    document.getElementById('btn-mix-behaviors')?.addEventListener('click', generateMixedBehaviors);
    
    document.getElementById('btn-life-question')?.addEventListener('click', generateLifeQuestion);
    document.getElementById('btn-bell')?.addEventListener('click', () => playSound('bell'));
    document.getElementById('btn-horn')?.addEventListener('click', () => playSound('horn'));

    document.getElementById('btn-generate-scenario')?.addEventListener('click', () => 
        simpleGenerate('btn-generate-scenario', 'scenario-display', 'scenarios', scenarios, 'text-amber-50'));
    
    document.getElementById('btn-generate-tilt')?.addEventListener('click', () => 
        simpleGenerate('btn-generate-tilt', 'tilt-display', 'tilts', tilts, 'text-red-400'));
        
    document.getElementById('btn-generate-location')?.addEventListener('click', () => 
        simpleGenerate('btn-generate-location', 'location-display', 'locations', locations, 'text-green-300'));

    document.getElementById('btn-next-coach')?.addEventListener('click', nextCoachQuote);

    // Modals
    document.getElementById('btn-info-main')?.addEventListener('click', () => document.getElementById('main-info-modal').classList.remove('hidden'));
    document.getElementById('btn-close-main-info')?.addEventListener('click', () => document.getElementById('main-info-modal').classList.add('hidden'));
    
    document.getElementById('btn-close-game-modal')?.addEventListener('click', () => document.getElementById('game-details-modal').classList.add('hidden'));
    document.getElementById('btn-close-game-modal-action')?.addEventListener('click', () => document.getElementById('game-details-modal').classList.add('hidden'));

    renderGames();
});
