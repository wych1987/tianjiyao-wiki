#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const ROOT = process.cwd();
const replacements = [
  {
    from: /\[返回首页\]\(\.\.\/index\.md\)/g,
    to: '[天机爻 Wiki 首页](../index.md)'
  },
  {
    from: /\[返回八字命理首页\]\(\.\/index\.md\)/g,
    to: '[八字命理学习中心](./index.md)'
  },
  {
    from: /\[返回周易首页\]\(\.\/index\.md\)/g,
    to: '[周易六爻学习中心](./index.md)'
  },
  {
    from: /\[返回紫微斗数首页\]\(\.\/index\.md\)/g,
    to: '[紫微斗数学习中心](./index.md)'
  }
];

function processFile(relativePath) {
  const filePath = path.join(ROOT, relativePath);
  const original = fs.readFileSync(filePath, 'utf8');
  let next = original;

  for (const rule of replacements) {
    next = next.replace(rule.from, rule.to);
  }

  if (next !== original) {
    fs.writeFileSync(filePath, next, 'utf8');
    return true;
  }

  return false;
}

function main() {
  const files = glob.sync('docs/**/*.md', { cwd: ROOT, nodir: true });
  let updated = 0;

  for (const relativePath of files) {
    if (processFile(relativePath)) {
      updated += 1;
      console.log(`Updated: ${relativePath}`);
    }
  }

  console.log(`Anchor optimization complete. Updated ${updated} files.`);
}

main();