import { readFileSync, readdirSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";

import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(".");
const kitSourceRoot = join(repositoryRoot, "packages", "kit", "src");
const contractPath = join(
  repositoryRoot,
  "docs",
  "architecture",
  "2026-08-14-native-form-control-contract.md",
);

const associatedControls = [
  "components/Form/Autocomplete",
  "components/Form/Cascader",
  "components/Form/Checkbox",
  "components/Form/CheckboxGroup",
  "components/Form/Input",
  "components/Form/InputNumber",
  "components/Form/InputOtp",
  "components/Form/InputTag",
  "components/Form/Mention",
  "components/Form/Radio",
  "components/Form/RadioGroup",
  "components/Form/Rate",
  "components/Form/Segmented",
  "components/Form/Select",
  "components/Form/Slider",
  "components/Form/Switch",
  "components/Form/Textarea",
  "components/Form/TreeSelect",
  "components/Form/Upload",
  "components/Picker/ColorPicker",
  "components/Picker/DatePicker",
  "components/Picker/DateTimePicker",
  "components/Picker/TimePicker",
  "components/Picker/TimeSelect",
] as const;

const collectTypeScriptFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectTypeScriptFiles(path);
    return path.endsWith(".ts") && !basename(path).includes(".test") ? [path] : [];
  });

const repositoryPath = (path: string): string =>
  relative(repositoryRoot, path).replaceAll("\\", "/");

describe("native form control contract", () => {
  it("keeps every applicable control explicitly associated and bridged through Core", () => {
    const failures = associatedControls.flatMap((component) => {
      const implementation = readFileSync(join(kitSourceRoot, component, "index.ts"), "utf8");
      const types = readFileSync(join(kitSourceRoot, component, "types.ts"), "utf8");
      const missing: string[] = [];

      if (!/defineOptions\(\{\s*formControl:\s*true\s*\}\)/.test(implementation)) {
        missing.push("defineOptions({ formControl: true })");
      }
      if (!/native:\s*(?:true|\{)|useNativeFormControl</.test(implementation)) {
        missing.push("Core native-form bridge");
      }
      for (const prop of ["name", "form", "required"] as const) {
        if (!new RegExp(`${prop}: \\{ type: (?:String|Boolean)`).test(implementation)) {
          missing.push(`${prop} runtime prop`);
        }
        if (!types.includes(`${prop}: ${prop === "required" ? "boolean" : "string"}`)) {
          missing.push(`${prop} public type`);
        }
      }
      return missing.map((item) => `${component}: ${item}`);
    });

    expect(failures).toEqual([]);
  });

  it("keeps ElementInternals platform calls exclusively inside Core", () => {
    const sources = collectTypeScriptFiles(kitSourceRoot);
    const directPlatformOwners = sources
      .filter((path) => {
        const source = readFileSync(path, "utf8");
        return /attachInternals\s*\(|\.setFormValue\s*\(|\.setValidity\s*\(/.test(source);
      })
      .map(repositoryPath);
    const contextConsumers = sources
      .filter((path) => readFileSync(path, "utf8").includes("useFormControlContext"))
      .map(repositoryPath);

    expect(directPlatformOwners).toEqual([]);
    expect(contextConsumers).toEqual(["packages/kit/src/composables/native-form.ts"]);
  });

  it("documents ownership, serialization, state priority and migration", () => {
    const contract = readFileSync(contractPath, "utf8");

    for (const requiredSection of [
      "## Ownership boundary",
      "## Associated controls",
      "## Serialization",
      "## State and priority",
      "## Migration notes",
      "FormData.getAll(name)",
      "disabled-fieldset",
      "useFormControlContext()",
    ]) {
      expect(contract).toContain(requiredSection);
    }
  });
});
