// cspell:words vuetifyjs

import { existsSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

// ── Types ────────────────────────────────────────────────────────────────────

export type MatrixKind = "contract" | "capability";

export const VALID_STATUSES = ["equivalent", "combined", "implement", "non-goal"] as const;

export type Status = (typeof VALID_STATUSES)[number];

export interface UpstreamRef {
  name: string;
  package: string;
  version: string;
  documentation: string[];
  source: string[];
}

export interface ElfuiRef {
  package: string;
  version: string;
}

export interface EntryUpstream {
  documentation: string[];
  source: string[];
}

export interface ElfuiOwner {
  current: string[];
  plannedTask: string | null;
}

export interface MatrixEntry {
  id: string;
  name: string;
  upstream: EntryUpstream;
  elfuiOwner: ElfuiOwner;
  status: Status;
  difference: string;
  tests: string[];
  docs: string[];
}

export interface Matrix {
  schemaVersion: number;
  kind: MatrixKind;
  upstream: UpstreamRef;
  elfui: ElfuiRef;
  scope: string;
  entries: MatrixEntry[];
}

export interface ParityMatrixExpectations {
  matrixLabel: string;
  repositoryRoot: string;
  planPath: string;
  kind: MatrixKind;
  upstreamPackage: string;
  upstreamVersion: string;
  elfuiPackage: string;
  elfuiVersion: string;
  idPrefix: string;
  sourceVersionToken: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const LEGACY_STATUSES = new Set(["supported", "missing", "not applicable", "unknown"]);
const ID_RE = /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)*$/;
const HTTPS_RE = /^https:\/\/.+/;
const LEGACY_REF_RE = /\b(EP-|VU-|OP-)/;
const MATRIX_TEST_RE = /^scripts\/.*matrix.*\.test\.ts$/;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isHttpsUrl(value: unknown): value is string {
  return typeof value === "string" && HTTPS_RE.test(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isArrayOfStrings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

/** Validate a repo-relative forward-slash path exists on disk. Returns null or an error string. */
function pathIssue(repoRoot: string, value: string): string | null {
  if (!isNonEmptyString(value)) {
    return "must be a non-empty string";
  }
  if (value.includes("\\")) {
    return "must use forward slashes";
  }
  const segments = value.split("/");
  if (segments.some((s) => s === "" || s === "." || s === "..")) {
    return `must not contain empty, "." or ".." segments: ${value}`;
  }
  const absolute = resolve(repoRoot, value);
  const rel = relative(repoRoot, absolute);
  if (rel.startsWith("..") || rel === "") {
    return `must stay within repository root: ${value}`;
  }
  if (!existsSync(absolute)) {
    return `file not found: ${value}`;
  }
  return null;
}

/** Parse NG-* task names from plan Markdown. Hard-fails if the plan cannot be read. */
function readPlanTasks(repoRoot: string, planPath: string): Set<string> {
  const tasks = new Set<string>();
  const planRaw = readFileSync(resolve(repoRoot, planPath), "utf8");
  const re = /\*\*NG-(\d+)[^*]*\*\*/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(planRaw)) !== null) {
    tasks.add(`NG-${match[1]}`);
  }
  return tasks;
}

// ── Validate ─────────────────────────────────────────────────────────────────

export function validateParityMatrix(
  data: unknown,
  expectations: ParityMatrixExpectations,
): string[] {
  const errors: string[] = [];
  const repo = expectations.repositoryRoot;
  const label = expectations.matrixLabel;
  const prefix = expectations.idPrefix;
  const versionToken = expectations.sourceVersionToken;

  // Read plan (hard fail)
  let planTasks: Set<string>;
  try {
    planTasks = readPlanTasks(repo, expectations.planPath);
  } catch {
    errors.push(`${label}: cannot read plan at ${expectations.planPath}`);
    // Still continue validation; NG task existence check will be skipped
    planTasks = new Set();
  }

  // Top-level
  if (!isPlainObject(data)) {
    errors.push(
      `${label}: matrix data must be a plain object, got ${data === null ? "null" : typeof data}`,
    );
    return errors;
  }
  const m = data;

  // schemaVersion
  if (m.schemaVersion !== 1) {
    errors.push(`${label}: schemaVersion must be 1, got ${JSON.stringify(m.schemaVersion)}`);
  }

  // kind
  if (m.kind !== expectations.kind) {
    errors.push(`${label}: kind must be "${expectations.kind}", got ${JSON.stringify(m.kind)}`);
  }

  // upstream
  const u = m.upstream;
  if (!isPlainObject(u)) {
    errors.push(`${label}: upstream must be a plain object, got ${u === null ? "null" : typeof u}`);
  } else {
    if (!isNonEmptyString(u.name)) {
      errors.push(`${label}: upstream.name must be a non-empty string`);
    }
    if (u.package !== expectations.upstreamPackage) {
      errors.push(
        `${label}: upstream.package must be "${expectations.upstreamPackage}", got ${JSON.stringify(u.package)}`,
      );
    }
    if (u.version !== expectations.upstreamVersion) {
      errors.push(
        `${label}: upstream.version must be "${expectations.upstreamVersion}", got ${JSON.stringify(u.version)}`,
      );
    }
    if (!isArrayOfStrings(u.documentation) || u.documentation.length === 0) {
      errors.push(`${label}: upstream.documentation must be a non-empty array of strings`);
    } else {
      for (let i = 0; i < u.documentation.length; i++) {
        if (!isHttpsUrl(u.documentation[i])) {
          errors.push(`${label}: upstream.documentation[${i}] must be an HTTPS URL`);
        }
      }
    }
    if (!isArrayOfStrings(u.source) || u.source.length === 0) {
      errors.push(`${label}: upstream.source must be a non-empty array of strings`);
    } else {
      for (let i = 0; i < u.source.length; i++) {
        if (!isHttpsUrl(u.source[i])) {
          errors.push(`${label}: upstream.source[${i}] must be an HTTPS URL`);
        }
        if (!u.source[i].includes(versionToken)) {
          errors.push(`${label}: upstream.source[${i}] must contain "${versionToken}"`);
        }
      }
    }
  }

  // elfui
  const e = m.elfui;
  if (!isPlainObject(e)) {
    errors.push(`${label}: elfui must be a plain object, got ${e === null ? "null" : typeof e}`);
  } else {
    if (e.package !== expectations.elfuiPackage) {
      errors.push(
        `${label}: elfui.package must be "${expectations.elfuiPackage}", got ${JSON.stringify(e.package)}`,
      );
    }
    if (e.version !== expectations.elfuiVersion) {
      errors.push(
        `${label}: elfui.version must be "${expectations.elfuiVersion}", got ${JSON.stringify(e.version)}`,
      );
    }
  }

  // scope
  if (!isNonEmptyString(m.scope)) {
    errors.push(`${label}: scope must be a non-empty string`);
  } else if (LEGACY_REF_RE.test(m.scope)) {
    errors.push(`${label}: scope must not contain legacy references (EP-/VU-/OP-)`);
  }

  // entries
  if (!Array.isArray(m.entries) || m.entries.length === 0) {
    errors.push(`${label}: entries must be a non-empty array`);
    return errors;
  }

  const entries = m.entries;
  const seenIds = new Set<string>();

  for (let i = 0; i < entries.length; i++) {
    const raw = entries[i];
    if (!isPlainObject(raw)) {
      errors.push(
        `${label}: entries[${i}] must be a plain object, got ${raw === null ? "null" : typeof raw}`,
      );
      continue;
    }
    const re = raw;
    const entryId = isNonEmptyString(re.id) ? re.id : `entries[${i}]`;

    // id
    if (!isNonEmptyString(re.id)) {
      errors.push(`${label}: ${entryId}: id must be a non-empty string`);
    } else if (!re.id.startsWith(`${prefix}.`)) {
      errors.push(`${label}: ${entryId}: id must start with "${prefix}."`);
    } else if (!ID_RE.test(re.id)) {
      errors.push(`${label}: ${entryId}: id must be kebab-case dotted, got "${re.id}"`);
    } else if (seenIds.has(re.id)) {
      errors.push(`${label}: ${entryId}: duplicate id`);
    } else {
      seenIds.add(re.id);
    }

    // name
    if (!isNonEmptyString(re.name)) {
      errors.push(`${label}: ${entryId}: name must be a non-empty string`);
    }

    // upstream (per-entry)
    if (!isPlainObject(re.upstream)) {
      errors.push(
        `${label}: ${entryId}: upstream must be a plain object, got ${re.upstream === null ? "null" : typeof re.upstream}`,
      );
    } else {
      const eu = re.upstream;
      if (!isArrayOfStrings(eu.documentation) || eu.documentation.length === 0) {
        errors.push(
          `${label}: ${entryId}: upstream.documentation must be a non-empty array of strings`,
        );
      } else {
        for (let j = 0; j < eu.documentation.length; j++) {
          if (!isHttpsUrl(eu.documentation[j])) {
            errors.push(`${label}: ${entryId}: upstream.documentation[${j}] must be an HTTPS URL`);
          }
        }
      }
      if (!isArrayOfStrings(eu.source) || eu.source.length === 0) {
        errors.push(`${label}: ${entryId}: upstream.source must be a non-empty array of strings`);
      } else {
        for (let j = 0; j < eu.source.length; j++) {
          if (!isHttpsUrl(eu.source[j])) {
            errors.push(`${label}: ${entryId}: upstream.source[${j}] must be an HTTPS URL`);
          }
          if (!eu.source[j].includes(versionToken)) {
            errors.push(
              `${label}: ${entryId}: upstream.source[${j}] must contain "${versionToken}"`,
            );
          }
        }
      }
    }

    // elfuiOwner
    if (!isPlainObject(re.elfuiOwner)) {
      errors.push(
        `${label}: ${entryId}: elfuiOwner must be a plain object, got ${re.elfuiOwner === null ? "null" : typeof re.elfuiOwner}`,
      );
    } else {
      const eo = re.elfuiOwner;
      if (!Array.isArray(eo.current)) {
        errors.push(
          `${label}: ${entryId}: elfuiOwner.current must be an array, got ${typeof eo.current}`,
        );
      } else {
        for (let j = 0; j < eo.current.length; j++) {
          const p = eo.current[j];
          if (!isString(p)) {
            errors.push(
              `${label}: ${entryId}: elfuiOwner.current[${j}] must be a string, got ${typeof p}`,
            );
          } else {
            const issue = pathIssue(repo, p);
            if (issue !== null) {
              errors.push(`${label}: ${entryId}: elfuiOwner.current[${j}] ${issue}`);
            }
          }
        }
      }
      if (eo.plannedTask === null) {
        // valid
      } else if (!isString(eo.plannedTask)) {
        errors.push(
          `${label}: ${entryId}: elfuiOwner.plannedTask must be a string or null, got ${typeof eo.plannedTask}`,
        );
      } else if (!/^NG-\d+$/.test(eo.plannedTask)) {
        errors.push(
          `${label}: ${entryId}: elfuiOwner.plannedTask must match NG-<number>, got "${eo.plannedTask}"`,
        );
      } else if (planTasks.size > 0 && !planTasks.has(eo.plannedTask)) {
        errors.push(
          `${label}: ${entryId}: elfuiOwner.plannedTask "${eo.plannedTask}" not found in plan`,
        );
      }
    }

    // status
    const s = re.status;
    if (!isString(s)) {
      errors.push(`${label}: ${entryId}: status must be a string, got ${typeof s}`);
    } else if (LEGACY_STATUSES.has(s)) {
      errors.push(`${label}: ${entryId}: legacy status "${s}" is not allowed`);
    } else if (!VALID_STATUSES.includes(s as Status)) {
      errors.push(
        `${label}: ${entryId}: status must be one of: ${VALID_STATUSES.join(", ")}, got "${s}"`,
      );
    }

    // difference
    if (!isNonEmptyString(re.difference)) {
      errors.push(`${label}: ${entryId}: difference must be a non-empty string`);
    } else if (LEGACY_REF_RE.test(re.difference)) {
      errors.push(
        `${label}: ${entryId}: difference must not contain legacy references (EP-/VU-/OP-)`,
      );
    }

    // tests (non-empty for all statuses)
    if (!Array.isArray(re.tests)) {
      errors.push(`${label}: ${entryId}: tests must be an array, got ${typeof re.tests}`);
    } else if (re.tests.length === 0) {
      errors.push(`${label}: ${entryId}: tests must be a non-empty array`);
    } else {
      for (let j = 0; j < re.tests.length; j++) {
        const p = re.tests[j];
        if (!isString(p)) {
          errors.push(`${label}: ${entryId}: tests[${j}] must be a string, got ${typeof p}`);
        } else {
          const issue = pathIssue(repo, p);
          if (issue !== null) {
            errors.push(`${label}: ${entryId}: tests[${j}] ${issue}`);
          }
        }
      }
    }

    // docs (non-empty for all statuses)
    if (!Array.isArray(re.docs)) {
      errors.push(`${label}: ${entryId}: docs must be an array, got ${typeof re.docs}`);
    } else if (re.docs.length === 0) {
      errors.push(`${label}: ${entryId}: docs must be a non-empty array`);
    } else {
      for (let j = 0; j < re.docs.length; j++) {
        const p = re.docs[j];
        if (!isString(p)) {
          errors.push(`${label}: ${entryId}: docs[${j}] must be a string, got ${typeof p}`);
        } else {
          const issue = pathIssue(repo, p);
          if (issue !== null) {
            errors.push(`${label}: ${entryId}: docs[${j}] ${issue}`);
          }
        }
      }
    }
  }

  // ── Status/owner consistency (post-loop) ───────────────────────────────────

  for (let i = 0; i < entries.length; i++) {
    const raw = entries[i];
    if (!isPlainObject(raw)) continue;
    const re = raw;
    const entryId = isNonEmptyString(re.id) ? re.id : `entries[${i}]`;
    const s = re.status as string;
    if (!isString(s) || !VALID_STATUSES.includes(s as Status)) continue;

    const eo = re.elfuiOwner;
    if (!isPlainObject(eo)) continue;

    if (s === "equivalent" || s === "combined") {
      if (!Array.isArray(eo.current) || eo.current.length === 0) {
        errors.push(`${label}: ${entryId}: status "${s}" requires at least one current owner path`);
      }
      if (eo.plannedTask === null) {
        errors.push(`${label}: ${entryId}: status "${s}" requires a plannedTask for follow-up`);
      }
      // At least one test must be an implementation-focused test (not just the matrix test)
      const hasImplTest =
        Array.isArray(re.tests) && re.tests.some((t) => isString(t) && !MATRIX_TEST_RE.test(t));
      if (!hasImplTest) {
        errors.push(
          `${label}: ${entryId}: status "${s}" requires at least one implementation-focused test path`,
        );
      }
    }

    if (s === "implement") {
      if (eo.plannedTask === null || !isString(eo.plannedTask)) {
        errors.push(`${label}: ${entryId}: status "implement" requires a plannedTask`);
      }
    }

    if (s === "non-goal") {
      if (!isNonEmptyString(re.difference) || (re.difference as string).length < 20) {
        errors.push(
          `${label}: ${entryId}: non-goal difference must explain the rationale (> 20 chars)`,
        );
      }
      if (typeof re.difference === "string" && !re.difference.includes("Web Components")) {
        errors.push(
          `${label}: ${entryId}: non-goal must reference Web Components rationale in difference`,
        );
      }
      if (!Array.isArray(eo.current) || eo.current.length === 0) {
        errors.push(
          `${label}: ${entryId}: non-goal should have a current owner (Kit's own implementation)`,
        );
      }
    }
  }

  return errors;
}

// ── Read ─────────────────────────────────────────────────────────────────────

export function readParityMatrix(filePath: string, expectations: ParityMatrixExpectations): Matrix {
  let raw: string;
  try {
    raw = readFileSync(filePath, "utf8");
  } catch {
    throw new Error(`${expectations.matrixLabel}: cannot read file ${filePath}`);
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`${expectations.matrixLabel}: cannot parse JSON from ${filePath}`);
  }

  const errors = validateParityMatrix(data, expectations);
  if (errors.length > 0) {
    throw new Error(
      `${expectations.matrixLabel}: validation failed (${errors.length} errors)\n${errors.map((line) => `  - ${line}`).join("\n")}`,
    );
  }

  return data as Matrix;
}
