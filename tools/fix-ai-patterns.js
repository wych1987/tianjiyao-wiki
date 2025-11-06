#!/usr/bin/env node

/**
 * 自动修复AI生成内容的常见痕迹
 * 注意：这只是辅助工具，建议人工审阅结果
 */

const fs = require('fs');
const path = require('path');

const fixes = [
  // 修复"既...又..."
  {
    pattern: /既([^又]{2,20})又/g,
    replace: (match, p1) => `${p1.trim()}，同时`,
    description: '替换"既...又..."'
  },
  
  // 修复"具有以下特点"
  {
    pattern: /具有以下特点[：:]/g,
    replace: '主要特点包括：',
    description: '替换"具有以下特点"'
  },
  
  // 修复"随着...的发展"开头
  {
    pattern: /^随着([^，。]{5,30})[的]发展[，。]/m,
    replace: (match, p1) => `${p1.trim()}快速发展，`,
    description: '优化"随着...发展"'
  },
  
  // 修复"数据显示"
  {
    pattern: /数据显示[，：]/g,
    replace: '实践表明，',
    description: '替换"数据显示"'
  },
  
  // 修复"具有重要意义"
  {
    pattern: /具有重要意义/g,
    replace: '非常重要',
    description: '替换"具有重要意义"'
  }
];

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  const changes = [];
  
  fixes.forEach(fix => {
    const before = content;
    content = content.replace(fix.pattern, fix.replace);
    if (content !== before) {
      modified = true;
      const count = (before.match(fix.pattern) || []).length;
      changes.push(`${fix.description} (${count}处)`);
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ ${path.relative('docs', filePath)}`);
    changes.forEach(change => console.log(`   - ${change}`));
    return true;
  }
  
  return false;
}

// 需要修复的文件（优先级高的）
const priorityFiles = [
  'docs/bazi/ten-gods-enhanced.md',
  'docs/ai/llm-traditional-prediction.md',
  'docs/ai/future-trends.md',
  'docs/practice/case-studies.md',
  'docs/ai/ai-introduction.md'
];

console.log('🔧 开始自动修复AI痕迹\n');

let fixed = 0;
priorityFiles.forEach(file => {
  if (fs.existsSync(file)) {
    if (fixFile(file)) fixed++;
  }
});

console.log(`\n📊 修复完成: ${fixed}/${priorityFiles.length} 个文件\n`);
console.log('💡 建议:');
console.log('   1. 运行 node detect-ai-patterns.js 再次检测');
console.log('   2. 人工审阅修改的文件');
console.log('   3. 手动调整段落长度（添加短段落或合并长段落）');
console.log('   4. 修改"首先...其次...最后"等过渡词');
