# Mission broadened to a full robotics fundamentals curriculum

On 2026-08-25, after completing the PD control lesson, the user requested
a full 8-topic curriculum covering coordinate frames, kinematics, PD
control (already done), sensors, sim-to-real, DDS/ROS2, locomotion/balance,
and navigation/SLAM — explicitly citing the original PD-tuning-only
mission as too narrow now that they're willing to learn the fuller
substrate.

They also self-sequenced: they marked navigation/SLAM ("item 8") as
"later, once the above is solid" in their own request, without being
asked. That's a meaningful signal — they're already reasoning about
zone-of-proximal-development ordering themselves, not just consuming
whatever's handed to them. Treat SLAM as deferred backlog, not skipped;
don't build it until the rest of the curriculum has landed.

**Implication for future sessions:** the mission now covers the whole
robotics substrate the source project's learning path calls for, not just
`stand_up` tuning. The PD-tuning task remains the one concrete, testable
throughline connecting all the theory back to something runnable.
