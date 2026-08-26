---
name: integral-term-added-to-real-script
description: The real run_stand_mission.py evolved past pure PD to a working PID while this curriculum was being authored
---

# The real script moved past pure PD, and now converges

Discovered mid-session (2026-08-25): a separate Claude Code session added
a per-joint integral term (`KI`, tuned down from 20 → 9 → 6) to the source
project's `run_stand_mission.py` while this curriculum was being built.
The mission now reports `mission_completed` with max joint error ≈0.028
rad, verified reproducible over 3 fresh-sim runs — see the script's own
docstring for the full tuning history, which is a genuinely good worked
example of integral windup and of "one successful run isn't evidence."

**Status: confirmed.** A separate session did the tuning largely on its
own, not the user. So this does **not** satisfy the mission's "edits
KP/KD... themselves" success criterion, even though the mission
technically converges now. Treat the integral-term story as excellent
case-study material (used as the worked example in the PD control,
locomotion/balance, and sim-to-real lessons) rather than evidence the user
has mastered it. A good concrete follow-up exercise: have the user
independently re-derive *why* `KI=20` during the ramp made things worse,
or re-tune it themselves from scratch with the integral term removed, so
the understanding is actually theirs.

**Implication either way:** the PD control lesson and its reference sheet
describe both the original PD-only failure and the current PID state,
clearly distinguished — the original failure is still the correct
pedagogical starting point, with an update noting what shipped since.
