# TinyML Deployer

**Validate model predictions, generate ESP-IDF firmware and check ESP32-S3 execution in QEMU without a physical board.**

[Repository](https://github.com/alexhaya4/tinyml-deployer) · [Release v0.2.0-beta.1](https://github.com/alexhaya4/tinyml-deployer/releases/tag/v0.2.0-beta.1) · [Get started](#get-started)

![TinyML Deployer walkthrough poster: original graphs, checked C++ and compiled ESP32-S3 execution.](../../assets/tinyml-poster.png)

[Watch the 54-second walkthrough](https://github.com/alexhaya4/tinyml-deployer/blob/v0.2.0-beta.1/docs/walkthrough/v0.2.0-beta.1/walkthrough.mp4) · [Complete transcript](https://github.com/alexhaya4/tinyml-deployer/blob/v0.2.0-beta.1/docs/walkthrough/v0.2.0-beta.1/transcript.md) · [Recorded commands](https://github.com/alexhaya4/tinyml-deployer/blob/v0.2.0-beta.1/docs/walkthrough/v0.2.0-beta.1/evidence/commands.json)

The video is a captioned, silent edited replay of recorded CLI output. The sine conversion example and the two compiled emulator fixtures are separate. Presentation timing is edited. The generated sine project was not compiled or emulated during this recording.

## Problem and approach

A converted model still needs compatible operators, a defined memory budget, a successful firmware build and execution evidence. TinyML Deployer makes those boundaries explicit.

- Convert original Keras, SavedModel and ONNX graphs with supplied validation data and an explicit prediction-error limit.
- Generate model-specific C++ wrappers, built-in operator registration and input/output checks.
- Define tensor-arena and flash budgets before compilation.
- Run compiled ESP32-S3 firmware in pinned Espressif QEMU with ESP-NN optimizations enabled.
- Validate complete inference records and preserve model and dataset identities in JSON or HTML reports.

![Original graph and supplied data pass numerical gates, firmware generation and compilation, then proceed to QEMU validation or physical-board profiling.](../../assets/tinyml-pipeline.svg)

## Verified execution evidence

The following results come from archived [CI run 38444732537](https://github.com/alexhaya4/tinyml-deployer/actions/runs/38444732537), at commit [71612ef](https://github.com/alexhaya4/tinyml-deployer/commit/71612ef0016fdcc61e271b842777dcd57696a3fd), on 13 October 2026.

| Recorded measure | Float32 dense graph | INT8 convolutional graph |
| --- | ---: | ---: |
| Completed observations | 24 | 24 |
| Samples × repetitions | 8 × 3 | 8 × 3 |
| Maximum absolute prediction error | 8.94069672e-08 | 0 |
| Configured error limit | 0.0001 | 0.02 |
| Prediction agreement | Passed | Passed |
| Physical-board validation | Not run | Not run |

These are different integration-test graphs. Each is compared with desktop execution of its own deployed model. These results do not establish comparative task accuracy, quantization savings or physical-board performance. Zero INT8 difference applies only to the supplied observations.

[Float32 report](../../assets/tinyml-evidence/float32.json) · [INT8 report](../../assets/tinyml-evidence/int8.json) · [Provenance and checksums](../../assets/tinyml-evidence/provenance.json)

The walkthrough has its own recorded run. The table above cites the separately archived CI evidence.

## Get started

Use Python 3.11 or 3.12 and install from the tagged source. The published 0.1 PyPI package has a different interface.

```bash
git clone --branch v0.2.0-beta.1 --depth 1 \
  https://github.com/alexhaya4/tinyml-deployer.git
cd tinyml-deployer
python -m venv .venv

# Linux / WSL / macOS
. .venv/bin/activate

python -m pip install -e '.[emulation]'
tinyml-deployer --help
```

Windows PowerShell activation: `.venv\Scripts\Activate.ps1`. Local emulator execution uses Linux or WSL2.

Firmware builds require the pinned ESP-IDF environment. Follow the complete guides for toolchain setup, separate calibration and validation inputs, error limits, compilation and execution:

- [Sine workflow](https://github.com/alexhaya4/tinyml-deployer/blob/v0.2.0-beta.1/examples/sine_model/README.md)
- [Emulator setup](https://github.com/alexhaya4/tinyml-deployer/blob/v0.2.0-beta.1/docs/emulation.md)
- [Migration from 0.1](https://github.com/alexhaya4/tinyml-deployer/blob/v0.2.0-beta.1/docs/migration-0.2.md)

## Current scope

ESP32-S3 float32 and INT8 firmware fixtures compile and execute in QEMU. Physical-board profiling and application-level validation remain pending. Other ESP32 generation paths require separate validation. STM32F4/H7 profiles support analysis only; firmware generation rejects these targets.

QEMU timing is emulator timing. Static resource estimates cannot prove that a compiled application fits or runs. The version remains a beta, including when GitHub labels it Latest.

## Help validate on a physical board

ESP32-S3 owners can extend the evidence by running the documented workflow and sharing their board configuration, exact source revision, model and dataset details, build output and serial-profile report. Report failed runs as well as successful ones.

[Contribution guide](https://github.com/alexhaya4/tinyml-deployer/blob/v0.2.0-beta.1/CONTRIBUTING.md) · [Project issues](https://github.com/alexhaya4/tinyml-deployer/issues)

**Stack:** Python, TensorFlow Lite Micro, C++, ESP-IDF, ESP-NN, Espressif QEMU, Click and pytest.

[Back to Alex Haya's portfolio](../../README.md)

