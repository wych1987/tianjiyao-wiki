#!/usr/bin/env node

/**
 * 修复SEO描述长度问题
 * 确保所有描述在50-160字符之间
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const DOCS_DIR = path.join(__dirname, 'docs');

// 需要修复的文档列表(从分析报告中提取)
const filesToFix = [
  'ziwei/practical-analysis.md',
  'ziwei/pattern-combinations.md',
  'ziwei/palaces.md',
  'ziwei/four-transformations.md',
  'ziwei/advanced-techniques.md',
  'ai/machine-learning-bazi.md',
  'ai/nlp-analysis.md',
  'ai/knowledge-graph.md',
  'ai/future-trends.md',
  'bazi/five-elements.md',
  'bazi/four-pillars.md',
  'bazi/luck-cycles.md',
  'bazi/pattern-analysis.md',
  'theory/yinyang.md',
  'theory/earthly-branches.md',
  'theory/sixty-jiazi.md',
  'theory/heavenly-stems.md',
  'practice/case-studies.md',
  'practice/common-mistakes.md',
  'practice/self-learning.md',
  'practice/tools-resources.md'
];

function truncateDescription(desc, maxLength = 160) {
  if (!desc) return desc;
  
  // 如果描述太短,保持原样
  if (desc.length < 50) {
    return desc;
  }
  
  // 如果长度合适,保持原样
  if (desc.length >= 50 && desc.length <= maxLength) {
    return desc;
  }
  
  // 如果太长,截断到合适长度
  if (desc.length > maxLength) {
    // 尝试在句号处截断
    const truncated = desc.substring(0, maxLength - 3);
    const lastPeriod = truncated.lastIndexOf('。');
    const lastComma = truncated.lastIndexOf('，');
    const cutPoint = Math.max(lastPeriod, lastComma);
    
    if (cutPoint > 50) {
      return desc.substring(0, cutPoint + 1);
    }
    
    // 否则直接截断并添加省略号
    return truncated + '...';
  }
  
  return desc;
}

function fixFrontMatter(content) {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontMatterRegex);
  
  if (!match) return content;
  
  const frontMatter = match[1];
  let updated = frontMatter;
  
  // 提取description
  const descMatch = frontMatter.match(/description:\s*(.+)/);
  if (descMatch) {
    const oldDesc = descMatch[1].trim();
    const newDesc = truncateDescription(oldDesc);
    
    if (oldDesc !== newDesc) {
      updated = updated.replace(
        /description:\s*.+/,
        `description: ${newDesc}`
      );
      console.log(`  ✓ 优化描述长度: ${oldDesc.length} → ${newDesc.length} 字符`);
    }
  }
  
  return content.replace(frontMatterRegex, `---\n${updated}\n---`);
}

function processFile(filePath) {
  const fullPath = path.join(DOCS_DIR, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  文件不存在: ${filePath}`);
    return;
  }
  
  console.log(`\n📄 处理: ${filePath}`);
  
  const content = fs.readFileSync(fullPath, 'utf-8');
  const updated = fixFrontMatter(content);
  
  if (content !== updated) {
    fs.writeFileSync(fullPath, updated, 'utf-8');
    console.log(`  ✅ 已更新`);
  } else {
    console.log(`  → 无需修改`);
  }
}

function main() {
  console.log('🔧 开始修复SEO描述长度问题\n');
  
  let processed = 0;
  let updated = 0;
  
  filesToFix.forEach(file => {
    const fullPath = path.join(DOCS_DIR, file);
    if (fs.existsSync(fullPath)) {
      const before = fs.readFileSync(fullPath, 'utf-8');
      processFile(file);
      const after = fs.readFileSync(fullPath, 'utf-8');
      
      processed++;
      if (before !== after) updated++;
    }
  });
  
  console.log(`\n✅ 完成！处理 ${processed} 个文件，更新 ${updated} 个文件`);
  console.log(`\n💡 运行 'npm run analyze' 验证修复效果`);
}

main();
