# Robotics Foundations (Go2) Resources

## Knowledge

### PD/PID control (Lesson 4)

- [Video: "What Is PID Control? | Understanding PID Control, Part 1" — Brian Douglas, MATLAB Tech Talks](https://www.mathworks.com/videos/understanding-pid-control-part-1-what-is-pid-control--1527089264373.html)
  Explicitly skips the math and builds intuition for proportional / integral
  / derivative from scratch. Use for: the absolute-beginner rundown of what
  the P and D terms physically *do*, and (on a second pass) the I term now
  that the real script uses one too.

- [Thesis: "Low Cost, High Performance Actuators for Dynamic Robots" — Benjamin Katz, MIT (2018)](https://dspace.mit.edu/bitstream/handle/1721.1/105580/964525489-MIT.pdf)
  Originates the joint-level "position gain (Kp) + velocity gain (Kd) +
  feedforward torque" convention
  (`torque = Kp*(q_des - q) + Kd*(dq_des - dq) + tau_ff`) used by MIT
  Cheetah-style quasi-direct-drive actuators, which Unitree's own `LowCmd`
  interface follows.

- [`unitree_sdk2`: `example/go2/go2_stand_example.cpp`](https://github.com/unitreerobotics/unitree_sdk2/blob/main/example/go2/go2_stand_example.cpp)
  Unitree's own official "stand up" example — uses the identical
  `Kp = 60.0, Kd = 5.0` that the source project's script started from.

- The source project's `scripts/run_stand_mission.py` (private repo — read its docstring directly)
  The script itself documents its own tuning history in prose (KI=0 droop →
  KI=20 makes things worse → KI=6 verified over 3 runs), including a real
  "one clean run isn't evidence" incident.

### Coordinate frames & orientation (Lesson 1)

- [Quaternions and 3D rotation, explained interactively — 3Blue1Brown & Ben Eater](https://eater.net/quaternions)
  Interactive, beginner-friendly primary source for what a quaternion
  actually represents.
- [MuJoCo docs — Modeling](https://mujoco.readthedocs.io/en/stable/modeling.html)
  Confirms MuJoCo's scalar-first quaternion convention (identity `"1 0 0 0"`).
- [ROS2 `geometry_msgs/Quaternion.msg`](https://github.com/ros2/common_interfaces/blob/rolling/geometry_msgs/msg/Quaternion.msg)
  Confirms ROS2's scalar-*last* convention (`x,y,z,w`) — the real mismatch
  this lesson's "spot the bug" exercise is built on.

### DDS pub/sub & ROS2 (Lesson 2)

- ["Understanding ROS 2 topics" — official ROS 2 docs](https://docs.ros.org/en/humble/Tutorials/Topics/Understanding-ROS2-Topics.html)
  Primary source for topics/pub-sub as ROS2 presents them.
- ["ROS on DDS" — ROS2 design docs](https://design.ros2.org/articles/ros_on_dds.html)
  Confirms ROS2's transport is itself built on DDS.
- [Cyclone DDS — DDSI concepts (domains)](https://cyclonedds.io/docs/cyclonedds/0.10.2/config/ddsi_concepts.html)
  Confirms domain-ID isolation.

### Robot kinematics (Lesson 3)

- [Modern Robotics §2.2, "Degrees of Freedom of a Robot" — Lynch & Park, Northwestern (free)](https://modernrobotics.northwestern.edu/nu-gm-book-resource/2-2-degrees-of-freedom-of-a-robot/)
  Primary source for DOF-counting; the Go2's 18-DOF figure (12 actuated + 6
  floating-base) is derived from this rule, applied directly to the
  robot's real joint list.
- [MIT Underactuated Robotics — Tedrake](https://underactuated.csail.mit.edu/index.html)
  Floating-base framing.

### Sensors & state estimation (Lesson 5)

- ["Estimate Orientation with a Complementary Filter and IMU Data" — MathWorks](https://www.mathworks.com/help/fusion/ug/estimate-orientation-with-a-complementary-filter-and-imu-data.html)
  Primary source for sensor fusion basics.
- ["The Case of the Misguided Gyro" — Analog Devices](https://www.analog.com/en/resources/analog-dialogue/raqs/raq-issue-139.html)
  Gyro integration drift, explained plainly.
- ["EMA Low Pass and High Pass Filter" — Luis Llamas](https://www.luisllamas.es/en/arduino-exponential-low-pass/)
  The noise-vs-lag filtering trade-off the lesson's interactive demo shows.

### Locomotion & balance (Lesson 6)

- [MIT Underactuated Robotics, Ch. 5 "Highly-Articulated Legged Robots" — Tedrake](https://underactuated.mit.edu/humanoids.html)
  Frames stability via ZMP/center-of-pressure rather than plain
  center-of-mass.
- [Li, Xie, Luo & Li (2021), open access — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7916107/)
  Linear inverted pendulum model (LIPM), the standard first teaching model
  for legged balance.

### Sim-to-real gap (Lesson 7)

- [Zhao, Peña Queralta & Westerlund, "Sim-to-Real Transfer in Deep RL for Robotics: a Survey" (arXiv:2009.13303)](https://arxiv.org/abs/2009.13303)
  Primary source for the sim-to-real gap as a named, studied problem.
- The source project's own architecture and telemetry-contract docs (private repo)
  Quoted directly — that project's own stated verification thesis.

## Gaps

- No single clean, fetchable, truly-introductory source for
  center-of-mass/support-polygon stability was found for Lesson 6 — it's
  stated in the lesson's own words, cross-checked across the two sources
  above rather than quoted from one.
- No community identified yet for wisdom/troubleshooting (see below).

## Wisdom (Communities)

Not yet explored — none proposed to the user so far. Candidates to
evaluate in a future session: r/robotics, a Unitree developer
forum/Discord if one exists. Confirm interest with the user before
recommending; do not assume they want a community.
