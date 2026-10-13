![Alex Haya. AI evaluation, embedded systems, and applied machine learning.](assets/banner.svg)

# Alex Haya

**AI Evaluation and Security | Embedded Systems | Applied Machine Learning**

I work across AI evaluation, cybersecurity, and embedded systems, with a background in electrical and electronics engineering. I build tools that connect model behavior, software reliability, and physical systems.

My work spans Python APIs, evaluation infrastructure, microcontroller firmware, and intelligent control. I focus on clear evaluation criteria, failure analysis, and implementations that can be inspected and tested.

[Public projects](#selected-public-projects) · [Current work](#current-work-rl-gym) · [Technical focus](#technical-focus) · [LinkedIn](https://ke.linkedin.com/in/alex-haya)

## Current work: RL Gym

I am developing **RL Gym**, a Python platform for reinforcement learning, machine learning workflows, and AI agent evaluation.

The platform brings together experiment tracking, dataset management, model evaluation, and background job processing. My current focus includes repeated-run evaluation, evaluator-controlled scoring, adversarial testing, and reliable execution.

**Technologies:** Python, FastAPI, PostgreSQL, Redis, Docker, PyTorch, Gymnasium, and scikit-learn.

![Conceptual RL Gym workflow: FastAPI records a run in PostgreSQL and queues work through Redis. An arq worker runs the evaluation harness, which stores results in PostgreSQL.](assets/rl-gym-workflow.gif)

*Architecture illustration of the main queued path. Animation shows execution order, not live activity or measured performance. [View the static diagram](assets/rl-gym-workflow.png).*

The source repository is private. The projects below provide public examples of my implementation work.

## Selected public projects

![Three implementation sketches: TinyML model to C assets to MCU project; speed reference through a controller to a motor; CAN frame through decoding and a queue to an LVGL gauge.](assets/projects.svg)

The sketches summarize the implementations linked below.

### TinyML Deployer

**Preparing machine learning models for embedded targets.**

A Python command-line tool for analyzing TensorFlow Lite models, generating C model assets and inference wrappers, and preparing project scaffolds for ESP32 and STM32 targets.

- Model inspection and memory estimates for constrained devices.
- ONNX conversion support and quantization workflows.
- Separate modules for analysis, code generation, deployment, and performance estimation, with automated tests.

**Stack:** Python, TensorFlow Lite, C, ESP-IDF, Click, pytest.

[Repository](https://github.com/alexhaya4/tinyml-deployer) · [Code generation](https://github.com/alexhaya4/tinyml-deployer/blob/main/tinyml_deployer/codegen.py) · [Tests](https://github.com/alexhaya4/tinyml-deployer/tree/main/tests)

### Neuro-Fuzzy DC Motor Control

**Comparing conventional and adaptive control approaches.**

A Raspberry Pi motor-control project with PI, PID, fuzzy logic, and neural-tuned fuzzy controllers. It combines control algorithms with a desktop interface, sensor feedback, plotting, and data export.

- PI/PID implementations with anti-windup and derivative filtering.
- Neural networks used to tune the scaling factors of a Mamdani fuzzy controller.
- Controller comparison through recorded responses and performance metrics.

**Stack:** Python, Raspberry Pi, TensorFlow/Keras, NumPy, GPIO, PWM.

[Repository](https://github.com/alexhaya4/dc-motor-neuro-fuzzy) · [PI/PID implementation](https://github.com/alexhaya4/dc-motor-neuro-fuzzy/blob/main/conventional_controllers.py) · [Neural-tuned controller](https://github.com/alexhaya4/dc-motor-neuro-fuzzy/blob/main/neural_tuned_fuzzy_controller.py)

### ESP32 CAN Display

**Turning CAN bus signals into an embedded gauge interface.**

An ESP-IDF firmware project that receives CAN frames through the TWAI driver, decodes a signal, and updates an LVGL gauge.

- Separate FreeRTOS tasks for CAN reception and display updates.
- Queue-based transfer of decoded values to the interface.
- Signal scaling, range checks, numeric readout, and threshold-based colors.

**Stack:** C, ESP32-S3, ESP-IDF, FreeRTOS, CAN/TWAI, LVGL.

[Repository](https://github.com/alexhaya4/esp32_can_display) · [Firmware](https://github.com/alexhaya4/esp32_can_display/blob/master/main/main.c)

## Technical focus

| Area | Focus |
| --- | --- |
| AI evaluation and security | Agent evaluation, adversarial testing, repeated-run analysis, failure investigation |
| Backend engineering | Python, FastAPI, SQLAlchemy, PostgreSQL, Redis, Docker |
| Embedded systems | C/C++, ESP32, STM32, FreeRTOS, CAN/TWAI, LVGL |
| Applied ML and control | TensorFlow/Keras, PyTorch, scikit-learn, PID, fuzzy logic, model deployment |

## Connect

For engineering collaborations and project discussions, connect with me through [GitHub](https://github.com/alexhaya4) or [LinkedIn](https://ke.linkedin.com/in/alex-haya).

<details>
<summary>About the visuals</summary>

Original SVG illustrations and an animated architecture diagram, with visual inspiration from [Beautiful UI](https://www.beautifului.dev/): charcoal surfaces, rounded cards, compact labels, and a dotted workflow canvas. The figures are conceptual diagrams based on the projects, rather than application screenshots. All image assets are stored in this repository.

</details>

