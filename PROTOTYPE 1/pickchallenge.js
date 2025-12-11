// script.js
const quests = {
  daily: [
    {
      id: 101,
      title: "Stargazer",
      category: "Science",
      desc: "Map 3 constellations in the void.",
      icon: "fa-star",
      color: "#a78bfa",
      dimColor: "rgba(167, 139, 250, 0.4)",
      xp: 100,
      coins: 50,
      difficulty: 2,
    },
    {
      id: 102,
      title: "Algebra Sprint",
      category: "Math",
      desc: "Solve 10 equations in 3 minutes.",
      icon: "fa-square-root-variable",
      color: "#22d3ee",
      dimColor: "rgba(34, 211, 238, 0.4)",
      xp: 150,
      coins: 75,
      difficulty: 3,
    },
    {
      id: 103,
      title: "Haiku Hero",
      category: "English",
      desc: "Compose a poem with proper syllables.",
      icon: "fa-feather-pointed",
      color: "#f472b6",
      dimColor: "rgba(244, 114, 182, 0.4)",
      xp: 80,
      coins: 40,
      difficulty: 1,
    },
  ],
  weekly: [
    {
      id: 201,
      title: "Code Architect",
      category: "CS",
      desc: "Build a responsive landing page structure.",
      icon: "fa-code",
      color: "#34d399",
      dimColor: "rgba(52, 211, 153, 0.4)",
      xp: 500,
      coins: 200,
      difficulty: 3,
    },
    {
      id: 202,
      title: "History Dive",
      category: "History",
      desc: "Write a journal entry from Rome.",
      icon: "fa-landmark-dome",
      color: "#fbbf24",
      dimColor: "rgba(251, 191, 36, 0.4)",
      xp: 400,
      coins: 150,
      difficulty: 2,
    },
    {
      id: 203,
      title: "Color Theory",
      category: "Art",
      desc: "Create a complementary color palette.",
      icon: "fa-palette",
      color: "#818cf8",
      dimColor: "rgba(129, 140, 248, 0.4)",
      xp: 300,
      coins: 100,
      difficulty: 1,
    },
  ],
  monthly: [
    {
      id: 301,
      title: "Novel Study",
      category: "Reading",
      desc: "Finish 'The Giver' and submit report.",
      icon: "fa-book-open",
      color: "#f87171",
      dimColor: "rgba(248, 113, 113, 0.4)",
      xp: 2000,
      coins: 800,
      difficulty: 3,
    },
    {
      id: 302,
      title: "Science Fair",
      category: "Project",
      desc: "Complete your final presentation board.",
      icon: "fa-atom",
      color: "#c084fc",
      dimColor: "rgba(192, 132, 252, 0.4)",
      xp: 2500,
      coins: 1000,
      difficulty: 3,
    },
    {
      id: 303,
      title: "Fitness Goal",
      category: "PE",
      desc: "Log 20 hours of physical activity.",
      icon: "fa-heart-pulse",
      color: "#fb923c",
      dimColor: "rgba(251, 146, 60, 0.4)",
      xp: 1500,
      coins: 500,
      difficulty: 2,
    },
  ],
};

const stage = document.getElementById("cards-stage");
const navBtns = document.querySelectorAll(".nav-icon-btn");
const successOverlay = document.getElementById("success-overlay");
const header = document.getElementById("main-header");
const focusInstruction = document.getElementById("focus-instruction");

let focusedCard = null;
let currentMode = "daily";

function getDifficultyLabel(level) {
  if (level === 1) return "EASY";
  if (level === 2) return "MEDIUM";
  return "HARD";
}

function renderCards(mode, animateEnter = false) {
  stage.innerHTML = "";
  focusedCard = null;
  // Reset Header
  header.classList.remove("opacity-0", "translate-y-[-20px]");
  focusInstruction.classList.add("opacity-0", "-translate-y-4");

  quests[mode].forEach((quest, index) => {
    const card = document.createElement("div");
    card.className = `quest-card ${
      animateEnter ? "card-enter-right" : "card-enter-initial"
    }`;
    card.style.animationDelay = `${index * 0.1}s`;
    card.style.setProperty("--glow-color", quest.color);
    card.style.setProperty("--glow-color-dim", quest.dimColor);

    let barsHtml = "";
    for (let i = 0; i < 3; i++) {
      barsHtml += `<div class="diff-bar ${
        i < quest.difficulty ? "active" : ""
      }"></div>`;
    }
    const diffLabel = getDifficultyLabel(quest.difficulty);

    card.innerHTML = `
          <div class="flex justify-between items-start mb-8 w-full pointer-events-none z-10">
              <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-white/10 bg-white/5 px-2 py-1 rounded-md self-start">${quest.category}</span>
              <div class="diff-container">
                  <span class="diff-label">${diffLabel}</span>
                  <div class="diff-bars">${barsHtml}</div>
              </div>
          </div>
          <div class="card-icon-box text-white pointer-events-none z-10"><i class="fas ${quest.icon}"></i></div>
          <h3 class="text-2xl font-bold text-white font-display mb-2 pointer-events-none z-10">${quest.title}</h3>
          <p class="text-sm text-slate-400 font-medium leading-relaxed mb-auto pointer-events-none z-10">${quest.desc}</p>
          <div class="mt-8 pt-4 border-t border-white/10 flex items-center justify-between w-full pointer-events-none z-10">
              <div class="flex flex-col"><span class="text-[10px] text-slate-500 font-bold uppercase">Reward</span><span class="font-bold text-white drop-shadow-md" style="color:${quest.color}">+${quest.xp} XP</span></div>
              <div class="flex flex-col items-end"><span class="text-[10px] text-slate-500 font-bold uppercase">Bonus</span><span class="font-bold text-amber-300 drop-shadow-md">${quest.coins} <i class="fas fa-coins text-[10px]"></i></span></div>
          </div>
      `;
    setupInteraction(card, quest);
    stage.appendChild(card);
  });
}

function setupInteraction(card, quest) {
  let holdTimer = null;
  let progress = 0;

  card.addEventListener("mousedown", (e) => handleClick(e, card));
  card.addEventListener("touchstart", (e) => handleClick(e, card));

  function handleClick(e, card) {
    if (!card.classList.contains("is-focused")) {
      e.preventDefault();
      enterFocusMode(card);
    } else {
      startHold(e);
    }
  }

  const startHold = (e) => {
    e.preventDefault();

    card.classList.add("is-charging"); // Scale

    holdTimer = setInterval(() => {
      progress += 1.5;

      // Vibrate
      if (progress > 10) card.classList.add("shake-1");
      if (progress > 50) {
        card.classList.remove("shake-1");
        card.classList.add("shake-2");
      }
      if (progress > 85) {
        card.classList.remove("shake-2");
        card.classList.add("shake-3");
      }

      if (Math.random() * 100 < progress * 1.5)
        spawnParticle(card, quest.color);
      if (progress > 60) spawnParticle(card, quest.color);

      if (progress >= 100) completeHold(card);
    }, 20);
  };

  const endHold = () => {
    clearInterval(holdTimer);
    progress = 0;
    card.classList.remove("shake-1", "shake-2", "shake-3");
    card.classList.remove("is-charging"); // Smooth return
  };

  window.addEventListener("mouseup", endHold);
  window.addEventListener("touchend", endHold);
}

function enterFocusMode(card) {
  if (focusedCard === card) return;
  focusedCard = card;
  document.querySelectorAll(".quest-card").forEach((c) => {
    if (c === card) {
      c.classList.add("is-focused");
      c.classList.remove("is-hidden");
    } else {
      c.classList.remove("is-focused");
      c.classList.add("is-hidden");
    }
  });

  // Hide Header
  header.classList.add("opacity-0", "translate-y-[-20px]");
  // Show Instruction
  focusInstruction.classList.remove("opacity-0", "-translate-y-4");
}

function exitFocusMode() {
  if (!focusedCard) return;
  focusedCard = null;
  document.querySelectorAll(".quest-card").forEach((c) => {
    c.classList.remove("is-focused", "is-hidden");
  });

  // Show Header
  header.classList.remove("opacity-0", "translate-y-[-20px]");
  // Hide Instruction
  focusInstruction.classList.add("opacity-0", "-translate-y-4");
}

window.addEventListener("click", (e) => {
  if (e.target.closest(".nav-icon-btn")) return;
  if (focusedCard && !e.target.closest(".quest-card.is-focused"))
    exitFocusMode();
});

function spawnParticle(card, color) {
  const p = document.createElement("div");
  p.className = "magic-particle";
  p.style.backgroundColor = color;
  p.style.boxShadow = `0 0 5px ${color}`;
  const size = Math.random() * 6 + 2 + "px";
  p.style.width = size;
  p.style.height = size;
  const startX = Math.random() * 120 - 10 + "%";
  const startY = Math.random() * 120 - 10 + "%";
  p.style.left = startX;
  p.style.top = startY;
  const cx = 50;
  const cy = 50;
  const dx = (parseFloat(startX) - cx) * 8 + "%";
  const dy = (parseFloat(startY) - cy) * 8 + "%";
  p.style.setProperty("--tx", dx);
  p.style.setProperty("--ty", dy);
  card.appendChild(p);
  setTimeout(() => p.remove(), 800);
}

function completeHold(card) {
  card.classList.remove("shake-1", "shake-2", "shake-3");
  card.classList.add("shake-decay");

  const clone = card.cloneNode(true);
  card.parentNode.replaceChild(clone, card);

  setTimeout(() => {
    successOverlay.style.pointerEvents = "auto";
    successOverlay.style.opacity = "1";
  }, 500);
}

function createStars() {
  const container = document.getElementById("stars-container");
  for (let i = 0; i < 60; i++) {
    const star = document.createElement("div");
    star.className = "star";
    const size = Math.random() * 2 + "px";
    star.style.width = size;
    star.style.height = size;
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDuration = Math.random() * 3 + 2 + "s";
    container.appendChild(star);
  }
}

navBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const targetBtn = e.target.closest(".nav-icon-btn");
    const newMode = targetBtn.dataset.mode;
    if (newMode === currentMode) return;
    currentMode = newMode;

    navBtns.forEach((b) => b.classList.remove("active"));
    targetBtn.classList.add("active");

    exitFocusMode();
    const currentCards = document.querySelectorAll(".quest-card");
    currentCards.forEach((c, i) => {
      c.style.animationDelay = `${i * 0.05}s`;
      c.classList.add("card-exit-left");
    });

    setTimeout(() => {
      renderCards(currentMode, true);
    }, 400);
  });
});

createStars();
renderCards("daily");
const style = document.createElement("style");
style.innerHTML = `.card-enter-initial { animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; } @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(style);
