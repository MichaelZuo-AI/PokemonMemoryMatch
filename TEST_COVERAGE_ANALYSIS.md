# Test Coverage Analysis

## Current State

The project has **zero automated tests**. There are no test files, no test runner, no testing framework, and no `package.json`. All validation is manual.

**Current test coverage: 0%**

---

## Recommended Test Infrastructure

Since this is a vanilla JS project with no build tools, a minimal setup would be:

```bash
npm init -y
npm install --save-dev jest jsdom @jest/globals
```

Use `jsdom` as the test environment so DOM-dependent code can run in Node. Functions that are pure logic should be extracted or exported for direct unit testing.

### Suggested `jest.config.js`

```js
module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js'],
};
```

---

## Priority Areas for Testing

### Priority 1 — Pure Logic (High value, easy to test)

These functions have no DOM or audio dependencies and can be unit tested directly.

#### 1. `getTypeMultiplier(attackerType, defenderType)` — `script.js:73-79`

The type effectiveness system drives all battle damage. A bug here silently breaks game balance.

**What to test:**
- Fire vs Grass returns `2` (super effective)
- Water vs Fire returns `2`
- Grass vs Water returns `2`
- Fire vs Water returns `0.5` (not very effective)
- Water vs Grass returns `0.5`
- Grass vs Fire returns `0.5`
- Normal vs anything returns `1` (neutral)
- Anything vs Normal returns `1`
- Same type vs same type returns `1`
- Unknown/undefined attacker type returns `1`

**Why it matters:** This is the core battle mechanic. If the type chart is wrong, battles become unfair — particularly bad for a 5-year-old who doesn't understand why they keep losing.

---

#### 2. `shuffleArray(arr)` — `script.js:895-902`

Used for both card shuffling (memory game) and CPU team selection (battle mode).

**What to test:**
- Output contains the same elements as input (no loss/duplication)
- Output length matches input length
- Empty array returns empty array
- Single-element array returns same element
- Statistical randomness: over many runs, not always the same order (probabilistic test)

**Why it matters:** A broken shuffle means cards appear in predictable patterns (memory game becomes trivial) or the CPU always picks the same team.

---

#### 3. `cpuPickTeam(playerTeam)` — `script.js:1003-1014`

CPU opponent team selection logic.

**What to test:**
- Returns exactly 3 Pokemon
- No overlap with the player's team
- All returned Pokemon are from the unlocked pool
- Works when player has selected Pokemon that exhaust a type category
- Handles edge case where fewer than 3 non-player Pokemon are available

**Why it matters:** If the CPU picks the same Pokemon as the player, or picks locked Pokemon, the battle breaks.

---

#### 4. `renderHpBar(barId, textId, current, max)` — `script.js:1272-1288`

HP bar color thresholds.

**What to test:**
- HP > 50%: bar is green
- HP 26-50%: bar is yellow
- HP ≤ 25%: bar is red
- HP at exactly 50%, 25% boundaries (off-by-one risk)
- HP at 0: bar width is 0%, color is red
- HP at max: bar width is 100%, color is green

**Why it matters:** Visual feedback is critical for a young player who can't read numbers well. Wrong colors mislead about battle state.

---

### Priority 2 — Game State Logic (Medium complexity)

#### 5. `flipCard(card)` — `script.js:448-460`

Card flip guard conditions.

**What to test:**
- Cannot flip when `isLocked` is true (two cards already face-up)
- Cannot flip the same card twice
- Cannot flip an already-matched card
- First flip adds card to `flippedCards` array
- Second flip triggers `checkForMatch()`
- Plays flip sound on valid flip

**Why it matters:** Double-flip bugs are the most common memory game defect and confuse young players.

---

#### 6. `checkForMatch()` / `disableCards()` / `unflipCards()` — `script.js:462-494`

Core matching logic.

**What to test:**
- Two cards with same `dataset.pokemon` → match (cards stay face-up, score increments)
- Two cards with different `dataset.pokemon` → no match (cards flip back after delay)
- Matching all pairs triggers victory
- `matchedPairs` increments correctly
- Board locks during unflip animation (prevents clicking during timeout)

**Why it matters:** This is the entire memory game. A match detection bug makes the game unplayable.

---

#### 7. `initGame()` — `script.js:391-423`

Game initialization.

**What to test:**
- Creates exactly 40 cards (20 pairs)
- Each Pokemon appears exactly twice
- Score resets to 0
- `matchedPairs` resets to 0
- `flippedCards` array is empty
- Previous game state is fully cleared
- All cards start face-down

**Why it matters:** Leftover state from a previous game (e.g., `matchedPairs` not reset) causes immediate victory or broken scoring on restart.

---

### Priority 3 — Progression & Persistence

#### 8. `loadProgress()` / `saveProgress()` — `script.js:304-331`

localStorage read/write with defaults.

**What to test:**
- Returns `DEFAULT_PROGRESS` when localStorage is empty
- Correctly parses valid saved data
- Merges saved data with defaults (handles schema migration)
- Handles corrupted/invalid JSON gracefully (falls back to defaults)
- `saveProgress()` round-trips through `loadProgress()`
- Handles `localStorage` being unavailable (private browsing)

**Why it matters:** Corrupted progress data could lock the player out of Pokemon they've earned, which would be upsetting for a child.

---

#### 9. `unlockNextPokemon()` / `addSticker()` / `incrementWinStreak()` / `resetWinStreak()` — `script.js:333-371`

Progression mutation functions.

**What to test:**
- `unlockNextPokemon()` unlocks the next Pokemon in `UNLOCK_ORDER`
- `unlockNextPokemon()` is a no-op when all Pokemon are unlocked
- `addSticker()` adds a new sticker ID
- `addSticker()` doesn't duplicate existing stickers
- `incrementWinStreak()` increments by 1
- `resetWinStreak()` sets streak to 0
- Each function persists changes to localStorage

---

### Priority 4 — Battle System (High complexity)

#### 10. `runAutoBattle(attackerSide)` — `script.js:1065-1167`

The most complex function in the codebase (15+ branches).

**What to test:**
- Correct attacker/defender selection based on `attackerSide`
- Damage calculation: `baseDamage + (baseDamage * (multiplier - 1))` for multiplier > 1, `baseDamage * multiplier` for multiplier < 1
- Type advantage is applied correctly
- Pokemon faints when HP ≤ 0
- Battle ends when all Pokemon on one side faint
- Turns alternate between player and CPU
- CPU auto-switches to next alive Pokemon on faint
- Player is prompted to switch on faint (offline)
- Online host sends turn results to guest

**Why it matters:** This function handles the entire battle flow. Bugs here cause softlocks (battle never ends), incorrect damage, or desync in online play.

---

#### 11. `togglePokemonSelection(pokemon)` — `script.js:970-983`

Team picker selection logic.

**What to test:**
- Selecting a Pokemon adds it to the team
- Deselecting a Pokemon removes it from the team
- Cannot select more than 3 Pokemon
- Team counter updates correctly
- "Start Battle" button enables at exactly 3 selections

---

### Priority 5 — Online Protocol (Hard to test, high impact)

#### 12. `onDataReceived(data)` — `script.js:669-690`

Network message router.

**What to test:**
- Each message type dispatches to the correct handler
- Unknown message types are handled gracefully (currently no default case)
- Messages with missing fields don't crash the game

---

#### 13. `handleOpponentTeamReady()` / `startOnlineBattle()` — `script.js:729-762`

Online battle initialization synchronization.

**What to test:**
- Battle starts only when both players' teams are received
- Host runs auto-battle; guest waits
- Team data is correctly mapped for both sides

---

#### 14. `processNextGuestAnimation()` — `script.js:792-854`

Guest-side animation queue processing.

**What to test:**
- Processes queue entries in FIFO order
- Attack results animate damage and HP changes
- Auto-switch results update the correct Pokemon
- Battle victory/loss detected correctly from guest perspective
- Empty queue stops processing

---

## Summary Table

| Priority | Area | Functions | Difficulty | Impact |
|----------|------|-----------|------------|--------|
| **P1** | Pure logic | `getTypeMultiplier`, `shuffleArray`, `cpuPickTeam`, `renderHpBar` | Easy | High |
| **P2** | Game state | `flipCard`, `checkForMatch`, `initGame` | Medium | Critical |
| **P3** | Persistence | `loadProgress`, `saveProgress`, unlock/sticker functions | Easy | Medium |
| **P4** | Battle system | `runAutoBattle`, `togglePokemonSelection` | Hard | High |
| **P5** | Online protocol | `onDataReceived`, `processNextGuestAnimation` | Hard | Medium |

## Refactoring Needed for Testability

The current code structure makes testing difficult because:

1. **No module exports** — All functions are globals in a single file. To unit test, either:
   - Add `module.exports` at the bottom (guarded by `typeof module !== 'undefined'`)
   - Refactor into ES modules with `export`

2. **DOM coupling** — Functions like `flipCard()` and `initGame()` directly manipulate the DOM. Testing requires either jsdom setup or extracting pure logic from DOM operations.

3. **Global mutable state** — Game state (`flippedCards`, `matchedPairs`, `hpBattleState`) is in global variables. Tests need to reset this state between runs.

4. **Audio side effects** — Audio functions create `AudioContext` oscillators on import. The audio context initialization (`line 82`) should be lazy or mockable.

5. **Timer dependencies** — Many functions use `setTimeout` for animations. Tests need `jest.useFakeTimers()` to avoid real delays.

### Minimal refactoring for immediate testability:

```js
// Add to the bottom of script.js:
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getTypeMultiplier,
        shuffleArray,
        cpuPickTeam,
        POKEMON_DATA,
        BATTLE_POKEMON,
        TYPE_CHART,
        UNLOCK_ORDER,
    };
}
```

This allows Node-based test runners to import pure functions without affecting browser behavior.

## Identified Bugs / Risks to Verify with Tests

1. **Confetti memory leak** — `confettiParticles` array may accumulate if victory is triggered multiple times without page reload
2. **No `default` case in `onDataReceived` switch** — Unknown message types are silently dropped
3. **`localStorage` quota** — `saveProgress()` has no try/catch around `setItem` (it does have try/catch, but doesn't handle `QuotaExceededError` specifically)
4. **Double victory trigger** — If `disableCards()` is called rapidly, `showVictory()` could fire twice
5. **CPU team selection with small pool** — If fewer than 3 non-player Pokemon are unlocked, `cpuPickTeam` returns fewer than 3
