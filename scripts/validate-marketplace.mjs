#!/usr/bin/env node
/**
 * Validate marketplace manifests, plugin metadata, and skill frontmatter.
 *
 * Usage: node scripts/validate-marketplace.mjs [repo-root]
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const repoRoot = process.argv[2] || process.cwd();
const errors = [];
const warnings = [];

function parseFrontmatter(content) {
  const normalized = content.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return null;
  let closingIndex = normalized.indexOf("\n---\n", 4);
  if (closingIndex === -1) {
    if (normalized.endsWith("\n---")) closingIndex = normalized.length - 4;
    else return null;
  }
  const block = normalized.slice(4, closingIndex);
  const fields = {};
  for (const line of block.split("\n")) {
    const sep = line.indexOf(":");
    if (sep === -1) continue;
    fields[line.slice(0, sep).trim()] = line.slice(sep + 1).trim();
  }
  return fields;
}

const pluginNamePattern = /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;

console.log("Validating marketplace structure...\n");

// 1. Marketplace manifests
for (const [label, mpath] of [
  ["Claude", ".claude-plugin/marketplace.json"],
  ["Cursor", ".cursor-plugin/marketplace.json"],
]) {
  try {
    const raw = await fs.readFile(path.join(repoRoot, mpath), "utf8");
    const m = JSON.parse(raw);
    if (!m.name) errors.push(`${label} marketplace: missing name`);
    if (!m.owner?.name) errors.push(`${label} marketplace: missing owner.name`);
    if (!Array.isArray(m.plugins) || m.plugins.length === 0) {
      errors.push(`${label} marketplace: empty plugins array`);
      continue;
    }
    const seenNames = new Set();
    for (const p of m.plugins) {
      if (!p.name) { errors.push(`${label} marketplace: plugin missing name`); continue; }
      const prevErrors = errors.length;
      if (!pluginNamePattern.test(p.name)) errors.push(`${label} marketplace: "${p.name}" must be lowercase kebab-case`);
      if (seenNames.has(p.name)) errors.push(`${label} marketplace: duplicate plugin "${p.name}"`);
      seenNames.add(p.name);
      if (!p.description) warnings.push(`${label} marketplace: "${p.name}" missing description`);
      if (errors.length === prevErrors) console.log(`  OK  ${label} marketplace: "${p.name}"`);
    }
  } catch (e) {
    errors.push(`${label} marketplace: ${e.message}`);
  }
}

// 2. Discover plugins
let pluginDirs;
try {
  const pluginsRoot = path.join(repoRoot, "plugins");
  const entries = await fs.readdir(pluginsRoot, { withFileTypes: true });
  pluginDirs = entries.filter(e => e.isDirectory() && !e.name.startsWith(".")).map(e => ({
    name: e.name,
    path: path.join(pluginsRoot, e.name),
  }));
} catch {
  errors.push("plugins/ directory not found");
  pluginDirs = [];
}

// 3. Validate each plugin
let totalSkills = 0;

for (const plugin of pluginDirs) {
  for (const [label, ppath] of [
    ["Claude", ".claude-plugin/plugin.json"],
    ["Cursor", ".cursor-plugin/plugin.json"],
  ]) {
    try {
      const raw = await fs.readFile(path.join(plugin.path, ppath), "utf8");
      const p = JSON.parse(raw);
      const prevErrors = errors.length;
      if (!p.name) errors.push(`${plugin.name} ${label} plugin.json: missing name`);
      if (!p.version) errors.push(`${plugin.name} ${label} plugin.json: missing version`);
      if (!p.description) errors.push(`${plugin.name} ${label} plugin.json: missing description`);
      if (p.name && p.name !== plugin.name) {
        errors.push(`${plugin.name} ${label} plugin.json: name "${p.name}" doesn't match directory "${plugin.name}"`);
      }
      if (errors.length === prevErrors) console.log(`  OK  ${plugin.name} ${label} plugin.json: v${p.version || "?"}`);
    } catch (e) {
      errors.push(`${plugin.name} ${label} plugin.json: ${e.message}`);
    }
  }

  const skillsDir = path.join(plugin.path, "skills");
  try {
    const skillEntries = await fs.readdir(skillsDir, { withFileTypes: true });
    for (const entry of skillEntries) {
      if (entry.name.startsWith(".") || !entry.isDirectory()) continue;
      const skill = entry.name;
      const skillPath = path.join(skillsDir, skill);
      totalSkills++;

      const skillMd = path.join(skillPath, "SKILL.md");
      try {
        const content = await fs.readFile(skillMd, "utf8");
        const fm = parseFrontmatter(content);
        if (!fm) {
          errors.push(`${skill}/SKILL.md: missing YAML frontmatter`);
        } else {
          if (!fm.name) errors.push(`${skill}/SKILL.md: missing "name" in frontmatter`);
          if (!fm.description) errors.push(`${skill}/SKILL.md: missing "description" in frontmatter`);
          if (fm.name && fm.description) {
            console.log(`  OK  ${skill}/SKILL.md: name="${fm.name}"`);
          }
        }
      } catch {
        errors.push(`${skill}: missing SKILL.md`);
      }
    }
  } catch {
    warnings.push(`${plugin.name}: no skills/ directory`);
  }
}

// Summary
console.log("");
if (warnings.length > 0) {
  console.log("Warnings:");
  for (const w of warnings) console.log(`  ⚠  ${w}`);
  console.log("");
}
if (errors.length > 0) {
  console.log("FAILED:");
  for (const e of errors) console.log(`  ✗  ${e}`);
  process.exit(1);
} else {
  console.log(`Passed: ${totalSkills} skills, ${pluginDirs.length} plugins, 2 marketplaces, 0 errors.`);
}
