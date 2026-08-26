# Mission: Robotics Foundations for the Go2 Feasibility Framework

## Why
Started narrower (2026-08-25, session 1): understand Kp/Kd well enough to
personally tune `run_stand_mission.py` until a `stand_up` mission converges,
instead of having it done silently. Broadened the same day (session 2), on
request: build genuine first-principles understanding of the robotics
fundamentals underneath every phase of the reference project's learning
path — coordinate frames, kinematics, PD control, sensing, DDS/ROS2
plumbing, locomotion/balance, and (later) sim-to-real verification and
navigation — so that any mission log that project produces can be read and
judged personally, not taken on faith. That project's own stated thesis is
turning "the robot did the job" from an assertion into something
inspectable. The `stand_up` PD-tuning task stays the concrete, testable
throughline; it's no longer the whole mission.

This curriculum is grounded in a real, private robotics project
(a Unitree Go2 feasibility framework) — lessons cite real captured
telemetry, real gains, and real bugs from that project throughout, not
synthetic examples. Links back to that project's source point to
`github.com/dillonroller/robot-feasibility-framework` (private — visible
to the repo owner, not the public).

## Success looks like
- Given a fresh mission log from `run_stand_mission.py`, can explain in
  plain terms *why* the joint tracking error looks the way it does
  (steady-state droop vs. oscillation vs. tracking lag) just from reading
  the numbers.
- Can predict, before re-running the sim, whether raising Kp, raising Kd,
  or adding a feedforward torque term will move a specific failing joint
  closer to its target — and be right most of the time.
- Can state the PD control law
  (`tau = Kp*(q_des - q) + Kd*(dq_des - dq) + tau_ff`) from memory and
  explain why each term exists.
- Can read a raw `imu_quat` value from telemetry and explain what frame
  and scalar convention it's in, and why that convention matters.
- Can point at any of the Go2's 12 `motor_state` indices and name which
  leg/joint it is and how many degrees of freedom that implies.
- Can explain why `rt/lowcmd`/`rt/lowstate` are DDS topics and what
  publisher/subscriber means in that context.
- Can explain why the `stand_up` mission's IMU looked "nearly upright"
  while still failing its own joint-tolerance check — i.e. why raw sensor
  readings aren't the same thing as "the mission succeeded."
- Can articulate, in their own words, why gains/behavior verified only in
  a simulator are not automatically trustworthy on real hardware.

**Not yet met:** editing `KP`/`KD` in `run_stand_mission.py` themselves,
re-running it, and getting `stand_up` to converge. A separate session
tuned the real script to convergence (added an integral term, `KI`
20→9→6) while this curriculum was being built — good case-study material
(used directly in the PD control and locomotion/balance lessons), not
evidence this criterion is satisfied. A real follow-up: re-derive that
tuning, or the `KI=20`-makes-it-worse failure, from scratch.

## Constraints
- Zero prior robotics/controls background across the board (confirmed
  2026-08-25) — every lesson starts from a from-scratch, feel-first
  rundown before any formal/mathematical treatment.
- Comfortable technically (writes Python, works in the source repo
  directly) — analogies can lean on general software/systems intuition
  rather than prior physics.
- Has a working `unitree_mujoco` simulator locally and can re-run scripts
  themselves to test changes against real telemetry — lessons should end
  in something testable against the real sim where possible, not just a
  quiz.

## Out of scope (for now)
- Full gait/walking controller implementation — understanding *why*
  standing balance is already a nontrivial control problem is in scope;
  building a walking gait generator is not.
- Full SLAM/navigation implementation — explicitly deferred by the user
  until the above is solid.
- The source project's Rust backend / queue-intelligence app — separate
  concern entirely, not part of this curriculum.
