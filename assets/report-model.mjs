const hashPattern = /^[a-f0-9]{64}$/;
function demand(condition, message) {
  if (!condition) throw new Error(message);
}
export function validateReport(data) {
  demand(data && data.measurement_kind === "emulator", "Expected an emulator report.");
  demand(data.hardware_validation === "not_run" && data.hardware_timing_valid === false, "Hardware status conflicts with the archived emulator evidence.");
  const v = data.validation;
  demand(v && v.measurement_kind === "emulator" && v.target === "esp32s3", "Unexpected validation target.");
  demand(hashPattern.test(v.model_sha256) && hashPattern.test(v.dataset_sha256), "Missing model or dataset identity.");
  demand(Number.isInteger(v.observations) && v.observations > 0, "Invalid observation count.");
  demand(Number.isFinite(v.max_allowed_error) && v.max_allowed_error >= 0, "Invalid error limit.");
  demand(Array.isArray(v.records) && v.records.length === v.observations + 2, "Incomplete record stream.");
  const begin = v.records[0];
  const done = v.records.at(-1);
  demand(begin.event === "begin" && done.event === "done" && typeof begin.run_id === "string" && begin.run_id.length > 0, "Missing run boundaries.");
  demand(begin.model_sha256 === v.model_sha256 && begin.dataset_sha256 === v.dataset_sha256, "Model or dataset identity mismatch.");
  demand(begin.target === v.target, "Record target mismatch.");
  const records = v.records.slice(1, -1);
  const identities = new Set();
  let maximumError = 0;
  for (const row of v.records) demand(row.run_id === begin.run_id, "Mixed run identities.");
  for (const row of records) {
    demand(row.event === "sample", "Unexpected record event.");
    for (const field of ["sample", "repetition", "latency_us", "arena_used_bytes", "min_free_heap_bytes"]) {
      demand(Number.isInteger(row[field]) && row[field] >= 0, "Invalid " + field + ".");
    }
    demand(Number.isFinite(row.max_abs_error) && row.max_abs_error >= 0, "Invalid prediction error.");
    const identity = row.sample + ":" + row.repetition;
    demand(!identities.has(identity), "Duplicate sample and repetition.");
    identities.add(identity);
    maximumError = Math.max(maximumError, row.max_abs_error);
  }
  const sampleIds = [...new Set(records.map(r => r.sample))].sort((a, b) => a - b);
  const repetitionIds = [...new Set(records.map(r => r.repetition))].sort((a, b) => a - b);
  demand(sampleIds.every((value, index) => value === index), "Noncontiguous sample identities.");
  demand(repetitionIds.every((value, index) => value === index), "Noncontiguous repetition identities.");
  demand(sampleIds.length * repetitionIds.length === records.length, "Incomplete sample repetitions.");
  demand(Number.isFinite(v.max_absolute_error) && Math.abs(v.max_absolute_error - maximumError) <= 1e-12 * Math.max(1, maximumError), "Aggregate prediction error mismatch.");
  const passed = maximumError <= v.max_allowed_error;
  demand(v.prediction_agreement_passed === passed, "Prediction agreement status mismatch.");
  demand(Array.isArray(data.firmware_files) && data.firmware_files.length > 0, "Firmware identities missing.");
  for (const file of data.firmware_files) demand(typeof file.path === "string" && hashPattern.test(file.sha256) && Number.isInteger(file.size_bytes) && file.size_bytes > 0, "Invalid firmware identity.");
  return Object.freeze({
    records: Object.freeze(records.map(row => Object.freeze({ ...row }))),
    samples: sampleIds.length,
    repetitions: repetitionIds.length,
    maximumError,
    passed,
    validation: Object.freeze({ ...v, records: undefined }),
    report: data
  });
}
export function sortRecords(records, key = "sample", direction = 1) {
  demand(["sample", "repetition", "max_abs_error", "latency_us", "arena_used_bytes"].includes(key), "Unsupported sort column.");
  demand(direction === 1 || direction === -1, "Unsupported sort direction.");
  return [...records].sort((a, b) => direction * (a[key] - b[key]) || a.sample - b.sample || a.repetition - b.repetition);
}
export function filterRecords(records, sample = "all") {
  if (sample === "all") return [...records];
  demand(/^\d+$/.test(String(sample)), "Invalid sample filter.");
  return records.filter(row => row.sample === Number(sample));
}
export async function verifySha256(bytes, expected, cryptoProvider = globalThis.crypto) {
  demand(hashPattern.test(expected), "Invalid expected checksum.");
  demand(cryptoProvider?.subtle, "Secure checksum verification is unavailable.");
  const digest = await cryptoProvider.subtle.digest("SHA-256", bytes);
  const actual = [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, "0")).join("");
  demand(actual === expected, "Archived report checksum mismatch.");
  return actual;
}
