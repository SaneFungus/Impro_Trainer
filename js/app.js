// Importujemy dane z pliku data.js
import { behaviors, quotes, scenarios, tilts, mantras, games } from './data.js';

// --- LOGIC ---

function switchTab(tabName) {
    // Hide all contents
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('fade-in'); // Reset animation
    });
    // Remove active class from buttons
    document.querySelectorAll('.nav-btn').forEach(el => {
        el.classList.remove('active-tab', 'bg-neutral-700');
        el.classList.add('hover:bg-neutral-700');
    });

    // Show selected content
    const content = document.getElementById(`content-${tabName}`);
    if(content) {
        content.classList.remove('hidden');
        // Trigger animation reflow
        void content.offsetWidth;
        content.classList.add('fade-in');
    }
    
    // Activate button
    const btn = document.querySelector(`button[data-tab="${tabName}"]`);
    if(btn) {
        btn.classList.add('active-tab', 'bg-neutral-700');
        btn.classList.remove('hover:bg-neutral-700');
    }
}

function generateBehavior() {
    const categoryEl = document.getElementById('behavior-category');
    const category = categoryEl.value;
    const list = behaviors[category];
    const randomItem = list[Math.floor(Math.random() * list.length)];
    
    const display = document.getElementById('behavior-display');
    const catText = categoryEl.options[categoryEl.selectedIndex].text;

    display.innerHTML = `
        <div class="fade-in">
            <h3 class="text-amber-500 font-bold text-lg mb-2 uppercase tracking-wide opacity-80">${catText}</h3>
            <p class="text-xl md:text-2xl font-bold text-white leading-relaxed">"${randomItem}"</p>
        </div>
    `;
}

function generateScenario() {
    const item = scenarios[Math.floor(Math.random() * scenarios.length)];
    document.getElementById('scenario-display').innerHTML = `<span class="fade-in text-lg font-medium">${item}</span>`;
}

function generateTilt() {
    const item = tilts[Math.floor(Math.random() * tilts.length)];
    document.getElementById('tilt-display').innerHTML = `<span class="fade-in text-xl font-bold text-red-400">"${item}"</span>`;
}

function generateMantra() {
    const item = mantras[Math.floor(Math.random() * mantras.length)];
    document.getElementById('mantra-display').innerHTML = `<span class="fade-in italic">"${item}"</span>`;
}

let coachInterval;
function nextCoachQuote() {
    const item = quotes[Math.floor(Math.random() * quotes.length)];
    const display = document.getElementById('coach-display');
    
    // Animation effect
    display.classList.remove('scale-100');
    display.classList.add('scale-95', 'opacity-50');
    
    setTimeout(() => {
        display.innerText = `"${item}"`;
        display.classList.remove('scale-95', 'opacity-50');
        display.classList.add('scale-100');
    }, 150);
}

function toggleAutoCoach() {
    const btn = document.getElementById('auto-coach-btn');
    if (coachInterval) {
        clearInterval(coachInterval);
        coachInterval = null;
        btn.innerHTML = '<i class="fas fa-play mr-2"></i> Auto (co 10s)';
        btn.classList.remove('bg-amber-600', 'text-white');
        btn.classList.add('text-amber-500');
    } else {
        nextCoachQuote();
        coachInterval = setInterval(nextCoachQuote, 10000);
        btn.innerHTML = '<i class="fas fa-stop mr-2"></i> Stop';
        btn.classList.add('bg-amber-600', 'text-white');
        btn.classList.remove('text-amber-500');
    }
}

function renderGames() {
    const container = document.getElementById('games-list');
    if (!container) return;
    
    container.innerHTML = games.map(game => `
        <div class="bg-neutral-800 p-5 rounded-lg border border-neutral-700 hover:border-amber-600 transition group">
            <h3 class="text-lg font-bold text-amber-100 group-hover:text-amber-400 mb-2">
                <i class="fas fa-gamepad mr-2 text-neutral-600 group-hover:text-amber-500"></i>${game.title}
            </h3>
            <p class="text-neutral-400 text-sm leading-relaxed">${game.desc}</p>
        </div>
    `).join('');
}

// --- MODAL LOGIC ---
function showMainInfo() {
    document.getElementById('main-info-modal').classList.remove('hidden');
}
function closeMainInfo() {
    document.getElementById('main-info-modal').classList.add('hidden');
}

function showMethodInfo() {
    document.getElementById('method-info-modal').classList.remove('hidden');
}
function closeMethodInfo() {
    document.getElementById('method-info-modal').classList.add('hidden');
}

// --- EVENT LISTENERS ---
// Because we are in a module, we cannot use onclick="..." in HTML easily without attaching to window.
// It is better practice to add event listeners in JS.

document.addEventListener('DOMContentLoaded', () => {
    // Nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.currentTarget.getAttribute('data-tab')));
    });

    // Action buttons
    document.getElementById('btn-generate-behavior')?.addEventListener('click', generateBehavior);
    document.getElementById('btn-generate-scenario')?.addEventListener('click', generateScenario);
    document.getElementById('btn-generate-tilt')?.addEventListener('click', generateTilt);
    document.getElementById('btn-generate-mantra')?.addEventListener('click', generateMantra);
    
    // Coach buttons
    document.getElementById('btn-next-coach')?.addEventListener('click', nextCoachQuote);
    document.getElementById('auto-coach-btn')?.addEventListener('click', toggleAutoCoach);

    // Modal buttons
    document.getElementById('btn-info-main')?.addEventListener('click', showMainInfo);
    document.getElementById('btn-close-main-info')?.addEventListener('click', closeMainInfo);
    document.getElementById('btn-info-method')?.addEventListener('click', showMethodInfo);
    document.getElementById('btn-close-method-info')?.addEventListener('click', closeMethodInfo);

    // Key press for coach
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !document.getElementById('content-coach').classList.contains('hidden')) {
            nextCoachQuote();
        }
    });

    // Init
    renderGames();
});
