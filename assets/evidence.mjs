import { validateReport, sortRecords, filterRecords, verifySha256 } from "./report-model.mjs";

const asset = name => new URL(name, import.meta.url);
const get = id => document.getElementById(id);
const tabs = [...document.querySelectorAll("[data-stage]")];
let selectedFixture = "float32";
let sampleFilter = "all";
let sortKey = "sample";
let sortDirection = 1;
let reports;
const fixtureLabels = { float32: "Float32 dense", int8: "INT8 convolutional" };
const headings = { sample: "Sample", repetition: "Repetition", max_abs_error: "Max abs. error", latency_us: "Emulated time (µs)", arena_used_bytes: "Arena used (bytes)" };

async function readAsset(name) {
  const response = await fetch(asset(name), { credentials: "same-origin" });
  if (!response.ok) throw new Error("Could not read " + name + " (HTTP " + response.status + ").");
  return response;
}
function selectStage(name, moveFocus = false) {
  const selected = tabs.find(tab => tab.dataset.stage === name);
  if (!selected) return;
  for (const tab of tabs) {
    const active = tab === selected;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    get(tab.getAttribute("aria-controls")).hidden = !active;
  }
  if (moveFocus) selected.focus();
}
for (const [index, tab] of tabs.entries()) {
  tab.addEventListener("click", () => selectStage(tab.dataset.stage));
  tab.addEventListener("keydown", event => {
    let target;
    if (event.key === "ArrowRight") target = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") target = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = tabs.length - 1;
    if (target !== undefined) {
      event.preventDefault();
      selectStage(tabs[target].dataset.stage, true);
    }
  });
}

async function copyText(button, text) {
  try {
    await navigator.clipboard.writeText(text);
    get("copy-feedback").textContent = "Copied to clipboard.";
  } catch {
    get("copy-feedback").textContent = "Clipboard access is unavailable. Select and copy the displayed text.";
  }
}
get("copy-install").addEventListener("click", event => copyText(event.currentTarget, get("install-code").textContent));
get("copy-source").addEventListener("click", event => copyText(event.currentTarget, get("source-code").textContent));

function buildFirmwareList(verifiedReports) {
  const container = get("firmware-list");
  container.classList.remove("loading");
  container.replaceChildren();
  for (const name of ["float32", "int8"]) {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = fixtureLabels[name] + " fixture";
    details.append(summary);
    for (const file of verifiedReports[name].report.firmware_files) {
      const item = document.createElement("p");
      const label = document.createElement("strong");
      label.textContent = file.path + " / " + file.size_bytes.toLocaleString("en-US") + " bytes";
      const hash = document.createElement("code");
      hash.textContent = file.sha256;
      item.append(label, document.createElement("br"), hash);
      details.append(item);
    }
    container.append(details);
  }
}
function openRecord(row, opener) {
  const verified = reports[selectedFixture];
  get("record-title").textContent = "Sample " + row.sample + " / Repetition " + row.repetition;
  get("record-context").textContent = fixtureLabels[selectedFixture] + " fixture. Archived emulator observation; physical-device timing is not established.";
  get("record-model").textContent = verified.validation.model_sha256;
  get("record-dataset").textContent = verified.validation.dataset_sha256;
  get("record-json").textContent = JSON.stringify(row, null, 2);
  const dialog = get("record-dialog");
  dialog.addEventListener("close", () => opener.focus(), { once: true });
  dialog.showModal();
}
function renderRecords() {
  if (!reports) return;
  const verified = reports[selectedFixture];
  const rows = sortRecords(filterRecords(verified.records, sampleFilter), sortKey, sortDirection);
  const fragment = document.createDocumentFragment();
  for (const row of rows) {
    const tr = document.createElement("tr");
    for (const key of ["sample", "repetition", "max_abs_error", "latency_us", "arena_used_bytes"]) {
      const td = document.createElement("td");
      td.textContent = String(row[key]);
      tr.append(td);
    }
    const td = document.createElement("td");
    const inspect = document.createElement("button");
    inspect.type = "button";
    inspect.textContent = "Inspect →";
    inspect.setAttribute("aria-label", "Inspect sample " + row.sample + ", repetition " + row.repetition);
    inspect.addEventListener("click", () => openRecord(row, inspect));
    td.append(inspect);
    tr.append(td);
    fragment.append(tr);
  }
  get("records-body").replaceChildren(fragment);
  get("record-count").textContent = rows.length + " of " + verified.records.length + " archived observations shown.";
  get("table-caption").textContent = fixtureLabels[selectedFixture] + ": " + verified.samples + " samples × " + verified.repetitions + " repetitions. Maximum absolute error " + verified.maximumError + "; configured limit " + verified.validation.max_allowed_error + ". Prediction agreement " + (verified.passed ? "passed." : "failed.");
  get("download-report").href = asset(selectedFixture + ".json").href;
  for (const button of document.querySelectorAll("[data-sort]")) {
    const active = button.dataset.sort === sortKey;
    button.closest("th").setAttribute("aria-sort", active ? (sortDirection === 1 ? "ascending" : "descending") : "none");
    button.textContent = headings[button.dataset.sort] + (active ? (sortDirection === 1 ? " ↑" : " ↓") : "");
  }
}
function populateSampleFilter() {
  get("sample-filter").replaceChildren(new Option("All samples", "all"));
  const count = reports[selectedFixture].samples;
  for (let i = 0; i < count; i++) get("sample-filter").append(new Option("Sample " + i, String(i)));
  sampleFilter = "all";
  get("sample-filter").value = "all";
}
for (const radio of document.querySelectorAll('input[name="fixture"]')) {
  radio.addEventListener("change", () => {
    if (!radio.checked || !reports) return;
    selectedFixture = radio.value;
    populateSampleFilter();
    renderRecords();
  });
}
get("sample-filter").addEventListener("change", event => {
  sampleFilter = event.target.value;
  renderRecords();
});
for (const button of document.querySelectorAll("[data-sort]")) {
  button.addEventListener("click", () => {
    if (!reports) return;
    const next = button.dataset.sort;
    sortDirection = sortKey === next ? -sortDirection : 1;
    sortKey = next;
    renderRecords();
  });
}

async function loadEvidence() {
  const provenance = await (await readAsset("provenance.json")).json();
  if (provenance.repository !== "alexhaya4/tinyml-deployer" || provenance.run_id !== 38444732537 || provenance.run_conclusion !== "success") {
    throw new Error("Unexpected archived evidence source.");
  }
  const pairs = await Promise.all(["float32", "int8"].map(async name => {
    const expected = provenance.reports.find(report => report.name === name);
    if (!expected || expected.file !== name + ".json") throw new Error("Missing report provenance.");
    const bytes = await (await readAsset(expected.file)).arrayBuffer();
    await verifySha256(bytes, expected.sha256);
    const data = JSON.parse(new TextDecoder().decode(bytes));
    return [name, validateReport(data)];
  }));
  reports = Object.fromEntries(pairs);
  buildFirmwareList(reports);
  get("execution-summary").textContent = pairs.map(([name, report]) => fixtureLabels[name] + ": " + report.records.length + " observations, prediction agreement " + (report.passed ? "passed" : "failed")).join(". ") + ". These are separate graphs, with separate model and dataset identities.";
  get("integrity-status").textContent = "Hashes match";
  get("identity-status").textContent = "Consistent";
  get("observations-status").textContent = pairs.every(([, r]) => r.passed) ? "Complete / passed" : "Complete / gate failed";
  get("fixture-controls").disabled = false;
  get("sample-filter").disabled = false;
  populateSampleFilter();
  renderRecords();
}
async function loadGeneratedArtifacts() {
  const results = await Promise.allSettled([
    (async () => {
      const source = await (await readAsset("inference.cpp")).text();
      if (!source.trim()) throw new Error("The archived source file is empty.");
      get("source-code").textContent = source;
      get("source-loading").hidden = true;
      get("copy-source").disabled = false;
    })(),
    (async () => {
      const report = await (await readAsset("quantization.json")).json();
      const gate = report.evaluation;
      if (!gate || !Number.isFinite(gate.max_absolute_error) || !Number.isFinite(gate.max_allowed_error) || !Number.isInteger(gate.samples) || gate.passed !== (gate.max_absolute_error <= gate.max_allowed_error)) {
        throw new Error("The archived conversion report is inconsistent.");
      }
      get("quantization-summary").textContent = "The recorded sine conversion used " + gate.samples + " validation samples. Maximum absolute error: " + gate.max_absolute_error.toPrecision(9) + " against a " + gate.max_allowed_error + " limit. Gate " + (gate.passed ? "passed" : "failed") + ". Model size changed from " + report.original_size + " to " + report.quantized_size + " bytes; this example did not achieve size savings.";
    })()
  ]);
  if (results[0].status === "rejected") get("source-loading").textContent = "Source file unavailable. Use the repository source link.";
  if (results[1].status === "rejected") get("quantization-summary").textContent = "Conversion summary unavailable. Inspect the archived JSON directly.";
}
loadGeneratedArtifacts();
loadEvidence().catch(error => {
  const warning = get("data-error");
  warning.textContent = "Archived evidence could not be verified. " + error.message + " No observation results are displayed.";
  warning.hidden = false;
  for (const id of ["integrity-status", "identity-status", "observations-status"]) get(id).textContent = "Unavailable";
  get("execution-summary").textContent = "Evidence verification failed. Use the linked original reports to investigate.";
  get("firmware-list").textContent = "Firmware identities unavailable because report verification failed.";
  get("table-caption").textContent = "Archived evidence unavailable. Results are withheld until verification succeeds.";
  get("record-count").textContent = "No verified observations displayed.";
});
