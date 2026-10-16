# Alex Odhiambo Haya

![HAYA. Python services, AI evaluation and embedded systems. Nairobi, Kenya.](assets/banner.svg)

I'm a backend engineer in Nairobi with a background in electrical and electronics engineering. I build Python APIs and background workers, design evaluations for AI agents, and write firmware for connected devices.

**[Portfolio](https://alexhaya4.github.io/alexhaya4/)** · [Research](https://alexhaya4.github.io/alexhaya4/papers/)

## 01 / TinyML Deployer

**From a model graph to compiled ESP32-S3 firmware.**

A Python CLI for converting models, checking prediction error and generating ESP-IDF C++. The generated application registers the model's operators and checks its input buffers, output buffers and inference results.

Float32 and INT8 test fixtures run in Espressif QEMU. Their archived reports record the model, validation inputs and individual predictions. Physical-board validation remains pending.

[![Signal to Silicon. Watch the 36-second TinyML film.](assets/signal-to-silicon-poster.jpg)](https://alexhaya4.github.io/alexhaya4/tinyml/#film)

**[Watch Signal to Silicon](https://alexhaya4.github.io/alexhaya4/tinyml/#film)** · [Case study](https://alexhaya4.github.io/alexhaya4/tinyml/) · [Source](https://github.com/alexhaya4/tinyml-deployer) · [Execution reports](https://github.com/alexhaya4/tinyml-deployer/tree/main/docs/evidence/qemu-2026-10-13)

<sub>Film and poster: Alex Haya. Board photograph: <a href="https://github.com/espressif/esp-dev-kits/blob/master/docs/_static/esp32-s3-devkitc-1/esp32-s3-devkitc-1-v1.1-isometric.png">Espressif</a>, cropped and animated. Media: <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>.</sub>

## 02 / Rylgam

**AI agent evaluation. Current development, private source.**

I build the Python backend, model API clients and background workers for Rylgam, also called RL Gym. The work includes isolated agent execution, tenant access controls and usage tracking.

FastAPI, PostgreSQL and Redis support the backend; React and TypeScript support the interface. Current development includes retrieval with pgvector and preparation for AWS deployment.

[Project notes](https://alexhaya4.github.io/alexhaya4/#rl-gym)

## 03 / Control, firmware and backend work

| Project | What is in the repository |
| :--- | :--- |
| [Neuro-Fuzzy Control](https://github.com/alexhaya4/dc-motor-neuro-fuzzy) | Raspberry Pi motor-speed control with PI, PID and neural-tuned fuzzy controllers. [Research record](https://zenodo.org/records/20124685). |
| [DC Motor Training Station](https://github.com/alexhaya4/dc_motor_training_station) | A desktop interface for manual and ANFIS control, motor monitoring and session logs. Starts in simulation mode. [Source walkthrough](https://alexhaya4.github.io/alexhaya4/articles/dc-motor-training-station/). |
| [CAN Display](https://github.com/alexhaya4/esp32_can_display) | ESP32-S3 firmware that receives CAN frames, decodes a signal and passes values through a FreeRTOS queue to an LVGL gauge. |
| [tradingsys](https://github.com/alexhaya4/tradingsys) | Domain models, TimescaleDB persistence, a hash-chained audit log and observability. Phase 1 infrastructure; strategies and order placement are not implemented. |

## 04 / Research

**What Resists Relocation** asks whether a benchmark task can be rewritten as a deployment request while preserving its technical substance and exploitable verifier flaw. The unpublished manuscript studies task-pair construction and its measurement limits. The downstream experiment on evaluation framing and reward hacking has not been run.

[Research summary](https://alexhaya4.github.io/alexhaya4/papers/#reward-hacking) · [Motor control, CAN visualization and AI safety papers](https://alexhaya4.github.io/alexhaya4/papers/)

