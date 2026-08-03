# Project 2 Final Proposal — 15 Puzzle: Full-Stack Final Project

**Student:** Yohan Jacob
**Track:** Undergraduate
**Team:** Solo submission
**Sprint Window:** July 22 – August 2, 2026 (12-day build)
**Proposal Submission Date:** July 25, 2026

---

## 1. Project Topic

I will build a themed Fifteen Puzzle (sliding tile puzzle) web application using a **Summer Beach** visual identity, matching the course hub's design direction. The app will feature three distinct puzzle modes, each with its own image-tile set and beach-inspired name:

| Mode | Theme | Tile Imagery Concept |
|---|---|---|
| **Tide Mode** | Ocean waves / shoreline | Wave crests, tide pools, shells |
| **Breeze Mode** | Coastal wind / palm trees | Palm fronds, kites, seagulls |
| **Sun Mode** | Sunset / beach daytime | Sun, sand dunes, umbrellas |

Numeric placeholders will be fully replaced with themed image tiles before final submission; numbers will not appear as the shipped tile design.

## 2. Track Selection: Undergraduate

Per the Undergrad Core Focus requirements, this build will prioritize:
- Usability-first gameplay with clear interaction feedback (move counter, timer, solved-state messaging).
- Magic Hint support with multiple guided uses per session (not limited/rationed like the Graduate track).
- Solid, maintainable implementation across HTML5, CSS3, and JavaScript.
- A functional PHP + MySQL score persistence workflow (save and list endpoints), with local-storage fallback if the database is unavailable.

## 3. Scope for the 12-Day Sprint

Given the compressed timeline, scope is intentionally limited to a fully working core rather than extra unfinished features:

**In scope:**
- Fully playable 4x4 Fifteen Puzzle with accurate move validation and solved-state detection.
- Dynamic, automated shuffle producing a guaranteed-solvable board on load and reset (no manual pre-arranging).
- Three themed modes (Tide, Breeze, Sun) with themed image tiles, each with independent timer/move tracking.
- Magic Hint feature (undergrad-tier: multiple uses).
- PHP API layer (`api/save_score.php`, `api/get_scores.php` or equivalent) backed by a MySQL table storing player name, mode/variant, move count, solve time, and timestamp.
- Persistent leaderboard UI showing ranked top scores per mode.
- Responsive layout with day/night theme toggle, consistent with the course hub's visual system.
- Local-storage fallback if the MySQL connection is unavailable, so the game remains playable offline.

**Out of scope (deferred/not attempted, to protect the timeline):**
- Grid sizes beyond 4x4 (3x3/6x6/8x8/10x10 options will not be built out for this submission).
- Adaptive difficulty analytics and Graduate-tier advanced analytics panel.
- Background music/audio toggle, beyond a simple stub if time allows.

## 4. Technical Stack

- **HTML5** — semantic structure, accessible navigation, organized sections.
- **CSS3** — responsive grid/flex layout, CSS custom properties for the beach theme, day/night variables.
- **JavaScript** — puzzle state management, move validation, shuffle algorithm (solvability-guaranteed), timer/move tracking, hint logic.
- **PHP** — API endpoints for saving and retrieving scores, input validation, JSON responses.
- **MySQL** — single `scores` table (`id`, `player`, `mode`, `moves`, `time_seconds`, `created_at`), accessed via CLI-created schema (no GUI DB tools, per course policy) and PHP `mysqli`/`PDO` direct connections.

## 5. Database & Security Approach

- Schema created and managed via MySQL command-line client only (no phpMyAdmin/Workbench), per the course's database development constraint.
- All API inputs (player name, mode, moves, time) validated server-side before insert.
- Prepared statements used for all queries to prevent SQL injection.
- Consistent JSON response shape returned from both endpoints, with error handling for malformed input and DB-unavailable states.

## 6. Milestone Plan (12-Day Sprint)

| Days | Milestone |
|---|---|
| Jul 22–23 | Finalize theme assets, board layout, and CSS design system |
| Jul 24–25 | Proposal submission; core puzzle grid + move logic in JS |
| Jul 26–27 | Solvable shuffle algorithm, timer/move tracking, solved-state detection |
| Jul 28–29 | PHP API + MySQL schema (CLI-created), save/list score integration |
| Jul 30 | Magic Hint feature, leaderboard UI, local-storage fallback |
| Jul 31 | Polish pass: responsive QA, day/night theme, three-mode theming |
| Aug 1 | Q&A defense prep (Q1–Q11 one question minimum, all 5 of Q12) |
| Aug 2 | Final QA against rubric, record submission video, turn in by 11:59 PM |

## 7. Rubric Alignment Check

| Rubric Category | Points | Plan to Meet It |
|---|---|---|
| UI Theme and Visual Design | 15 | Themed image tiles across 3 modes, responsive layout, day/night support |
| Puzzle Mechanics and Interaction | 20 | Validated move logic, guaranteed-solvable shuffle, solved detection, timer/move feedback |
| JavaScript Engineering | 15 | Modular puzzle class(es), clear event-driven structure, no global-state sprawl |
| Backend/API Integration | 15 | PHP save/list endpoints, consistent JSON, frontend-backend integration tested |
| Database and Data Integrity | 15 | CLI-managed MySQL schema, prepared statements, ranked query output |
| Advanced Features and Track Depth | 10 | Undergrad-tier Magic Hint, difficulty-aware behavior |
| Documentation and Reflection | 10 | Reflection section covering decisions, growth, and rubric alignment |
