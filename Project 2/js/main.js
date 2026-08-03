(function () {
    "use strict";

    const THEME_KEY = "puzzle_theme_mode";
    const LOCAL_SCORES_KEY = "puzzle_scores_fallback_v1";
    const SIZE = 4;
    const HINT_LIMIT = 5;
    const MODES = ["tide", "breeze", "sun"];

    /* ---------- Theme toggle ---------- */
    function initTheme() {
        const toggle = document.getElementById("themeToggle");
        const body = document.body;

        const applyTheme = (mode) => {
            const resolved = mode === "night" ? "night" : "day";
            body.setAttribute("data-theme", resolved);
            if (toggle) {
                toggle.textContent = resolved === "night" ? "Day Mode" : "Night Mode";
                toggle.setAttribute("aria-label", resolved === "night" ? "Switch to day mode" : "Switch to night mode");
            }
        };

        applyTheme(localStorage.getItem(THEME_KEY) || "day");

        if (toggle) {
            toggle.addEventListener("click", () => {
                const next = body.getAttribute("data-theme") === "night" ? "day" : "night";
                applyTheme(next);
                localStorage.setItem(THEME_KEY, next);
            });
        }
    }

    /* ---------- Local fallback score store ---------- */
    function readLocalScores() {
        try {
            const raw = localStorage.getItem(LOCAL_SCORES_KEY);
            const parsed = raw ? JSON.parse(raw) : {};
            MODES.forEach((m) => { if (!Array.isArray(parsed[m])) parsed[m] = []; });
            return parsed;
        } catch (err) {
            const empty = {};
            MODES.forEach((m) => { empty[m] = []; });
            return empty;
        }
    }

    function writeLocalScores(store) {
        localStorage.setItem(LOCAL_SCORES_KEY, JSON.stringify(store));
    }

    function addLocalScore(mode, entry) {
        const store = readLocalScores();
        store[mode].push(entry);
        store[mode].sort((a, b) => a.moves - b.moves || a.time - b.time);
        store[mode] = store[mode].slice(0, 10);
        writeLocalScores(store);
        return store[mode];
    }

    /* ---------- Leaderboard (API-first, local fallback) ---------- */
    const Leaderboard = {
        async save(mode, player, moves, time) {
            const entry = { player, moves, time };
            try {
                const res = await fetch("api/save_score.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ player, mode, moves, time }),
                });
                if (!res.ok) throw new Error("save failed: " + res.status);
                const data = await res.json();
                if (!data.success) throw new Error(data.error || "save rejected");
                return { ok: true, source: "server" };
            } catch (err) {
                addLocalScore(mode, entry);
                return { ok: false, source: "local", error: err };
            }
        },

        async load(mode) {
            try {
                const res = await fetch("api/get_scores.php?mode=" + encodeURIComponent(mode));
                if (!res.ok) throw new Error("load failed: " + res.status);
                const data = await res.json();
                if (!Array.isArray(data)) throw new Error("unexpected response shape");
                return {
                    source: "server",
                    scores: data.map((row) => ({
                        player: row.player,
                        moves: Number(row.moves),
                        time: Number(row.time_seconds),
                    })),
                };
            } catch (err) {
                const store = readLocalScores();
                return { source: "local (offline fallback)", scores: store[mode] };
            }
        },
    };

    /* ---------- Puzzle engine ---------- */
    class PuzzleGame {
        constructor(panel) {
            this.panel = panel;
            this.mode = panel.dataset.mode;
            this.imageUrl = panel.dataset.image;
            this.size = SIZE;
            this.blankId = this.size * this.size - 1;

            this.grid = panel.querySelector(".puzzle-grid");
            this.timerEl = panel.querySelector(".js-timer");
            this.statusEl = panel.querySelector(".js-status");
            this.hintsEl = panel.querySelector(".js-hints");
            this.completeEl = panel.querySelector(".complete-msg");

            this.moves = 0;
            this.seconds = 0;
            this.timerHandle = null;
            this.started = false;
            this.solved = false;
            this.hintsLeft = HINT_LIMIT;
            this.hintedIndex = null;

            this.grid.style.setProperty("--size", this.size);

            panel.querySelector(".js-shuffle").addEventListener("click", () => this.shuffle());
            panel.querySelector(".js-reset").addEventListener("click", () => this.reset());
            panel.querySelector(".js-hint").addEventListener("click", () => this.hint());

            this.shuffle();
        }

        solvedTiles() {
            const arr = [];
            for (let i = 0; i < this.size * this.size; i++) arr.push(i);
            return arr;
        }

        isSolved() {
            return this.tiles.every((v, i) => v === i);
        }

        rowCol(index) {
            return [Math.floor(index / this.size), index % this.size];
        }

        areAdjacent(a, b) {
            const [r1, c1] = this.rowCol(a);
            const [r2, c2] = this.rowCol(b);
            return (r1 === r2 && Math.abs(c1 - c2) === 1) || (c1 === c2 && Math.abs(r1 - r2) === 1);
        }

        neighbors(index) {
            const [r, c] = this.rowCol(index);
            const out = [];
            if (r > 0) out.push(index - this.size);
            if (r < this.size - 1) out.push(index + this.size);
            if (c > 0) out.push(index - 1);
            if (c < this.size - 1) out.push(index + 1);
            return out;
        }

        /* Shuffle by simulating legal random moves from the solved state.
           This guarantees the result is always reachable/solvable, with no
           inversion-parity math required. */
        shuffle() {
            this.tiles = this.solvedTiles();
            let blank = this.tiles.indexOf(this.blankId);
            let lastBlank = -1;
            const steps = 250;

            for (let i = 0; i < steps; i++) {
                const options = this.neighbors(blank).filter((n) => n !== lastBlank);
                const pick = options[Math.floor(Math.random() * options.length)];
                [this.tiles[blank], this.tiles[pick]] = [this.tiles[pick], this.tiles[blank]];
                lastBlank = blank;
                blank = pick;
            }

            if (this.isSolved()) {
                return this.shuffle();
            }

            this.moves = 0;
            this.seconds = 0;
            this.started = false;
            this.solved = false;
            this.hintsLeft = HINT_LIMIT;
            this.hintedIndex = null;
            this.stopTimer();
            this.completeEl.textContent = "";
            this.updateStatus();
            this.render();
        }

        reset() {
            this.shuffle();
        }

        render() {
            this.grid.innerHTML = "";
            const n = this.size;

            this.tiles.forEach((identity, pos) => {
                const cell = document.createElement("button");
                cell.type = "button";
                cell.className = "puzzle-tile";

                if (identity === this.blankId) {
                    cell.classList.add("blank");
                    cell.setAttribute("aria-hidden", "true");
                } else {
                    const homeRow = Math.floor(identity / n);
                    const homeCol = identity % n;
                    const pctX = n > 1 ? (homeCol / (n - 1)) * 100 : 0;
                    const pctY = n > 1 ? (homeRow / (n - 1)) * 100 : 0;

                    cell.style.backgroundImage = `url(${this.imageUrl})`;
                    cell.style.backgroundSize = `${n * 100}% ${n * 100}%`;
                    cell.style.backgroundPosition = `${pctX}% ${pctY}%`;

                    const label = document.createElement("span");
                    label.className = "tile-num";
                    label.textContent = String(identity + 1);
                    cell.appendChild(label);

                    cell.setAttribute("aria-label", "Tile " + (identity + 1));
                    cell.addEventListener("click", () => this.attemptMove(pos));
                }

                if (pos === this.hintedIndex) cell.classList.add("hinted");

                this.grid.appendChild(cell);
            });
        }

        attemptMove(pos) {
            if (this.solved) return;
            const blank = this.tiles.indexOf(this.blankId);
            if (!this.areAdjacent(pos, blank)) return;

            [this.tiles[pos], this.tiles[blank]] = [this.tiles[blank], this.tiles[pos]];
            this.moves += 1;
            this.hintedIndex = null;

            if (!this.started) {
                this.started = true;
                this.startTimer();
            }

            if (this.isSolved()) {
                this.solved = true;
                this.stopTimer();
                this.completeEl.textContent = `Solved in ${this.moves} moves and ${this.seconds}s! Saving your score...`;
                this.saveResult();
            }

            this.updateStatus();
            this.render();
        }

        startTimer() {
            this.stopTimer();
            this.timerHandle = setInterval(() => {
                this.seconds += 1;
                this.timerEl.textContent = String(this.seconds);
            }, 1000);
        }

        stopTimer() {
            if (this.timerHandle) {
                clearInterval(this.timerHandle);
                this.timerHandle = null;
            }
            this.timerEl.textContent = String(this.seconds);
        }

        updateStatus() {
            this.statusEl.textContent = this.solved
                ? `Moves: ${this.moves} | Solved!`
                : `Moves: ${this.moves} | ${this.started ? "In progress" : "Ready to start"}`;
            this.hintsEl.textContent = `Magic Hints left: ${this.hintsLeft}`;
        }

        /* Greedy hint: among tiles adjacent to the blank, suggest the one
           whose move reduces distance-to-home the most. */
        hint() {
            if (this.solved || this.hintsLeft <= 0) return;

            const blank = this.tiles.indexOf(this.blankId);
            const candidates = this.neighbors(blank);

            let best = null;
            let bestScore = -Infinity;

            candidates.forEach((pos) => {
                const identity = this.tiles[pos];
                const [curR, curC] = this.rowCol(pos);
                const [homeR, homeC] = this.rowCol(identity);
                const [blankR, blankC] = this.rowCol(blank);
                const distBefore = Math.abs(curR - homeR) + Math.abs(curC - homeC);
                const distAfter = Math.abs(blankR - homeR) + Math.abs(blankC - homeC);
                const improvement = distBefore - distAfter;
                if (improvement > bestScore) {
                    bestScore = improvement;
                    best = pos;
                }
            });

            if (best === null) return;
            this.hintsLeft -= 1;
            this.hintedIndex = best;
            this.updateStatus();
            this.render();
        }

        async saveResult() {
            const nameInput = document.getElementById("playerName");
            const player = (nameInput && nameInput.value.trim()) || "Anonymous";
            const result = await Leaderboard.save(this.mode, player, this.moves, this.seconds);
            const note = result.ok
                ? "Score saved to the leaderboard!"
                : "Score saved locally (server unavailable).";
            this.completeEl.textContent = `Solved in ${this.moves} moves and ${this.seconds}s! ${note}`;
            document.dispatchEvent(new CustomEvent("scores:updated", { detail: { mode: this.mode } }));
        }
    }

    /* ---------- Tab switching ---------- */
    function initModeTabs(games) {
        const tabs = document.querySelectorAll(".mode-tab");
        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const mode = tab.dataset.mode;
                tabs.forEach((t) => {
                    t.classList.toggle("active", t === tab);
                    t.setAttribute("aria-selected", t === tab ? "true" : "false");
                });
                document.querySelectorAll(".mode-panel").forEach((panel) => {
                    const active = panel.dataset.mode === mode;
                    panel.classList.toggle("active", active);
                    panel.hidden = !active;
                });
            });
        });
    }

    /* ---------- Leaderboard UI ---------- */
    function initLeaderboard() {
        const list = document.getElementById("scoreList");
        const sourceEl = document.getElementById("lbSource");
        const tabs = document.querySelectorAll(".lb-tab");
        let currentMode = "tide";

        async function renderScores(mode) {
            const { source, scores } = await Leaderboard.load(mode);
            sourceEl.textContent = "Source: " + source;
            list.innerHTML = "";

            if (!scores.length) {
                const li = document.createElement("li");
                li.className = "empty";
                li.textContent = "No scores yet — be the first to solve this mode!";
                list.appendChild(li);
                return;
            }

            scores.slice(0, 10).forEach((entry, i) => {
                const li = document.createElement("li");
                const rank = document.createElement("span");
                rank.className = "rank";
                rank.textContent = `#${i + 1} ${entry.player}`;
                const detail = document.createElement("span");
                detail.textContent = `${entry.moves} moves · ${entry.time}s`;
                li.appendChild(rank);
                li.appendChild(detail);
                list.appendChild(li);
            });
        }

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                tabs.forEach((t) => {
                    t.classList.toggle("active", t === tab);
                    t.setAttribute("aria-selected", t === tab ? "true" : "false");
                });
                currentMode = tab.dataset.mode;
                renderScores(currentMode);
            });
        });

        document.addEventListener("scores:updated", (e) => {
            if (e.detail.mode === currentMode) renderScores(currentMode);
        });

        renderScores(currentMode);
    }

    /* ---------- Init ---------- */
    document.addEventListener("DOMContentLoaded", () => {
        initTheme();
        const games = Array.from(document.querySelectorAll(".mode-panel")).map((panel) => new PuzzleGame(panel));
        initModeTabs(games);
        initLeaderboard();
    });
})();
