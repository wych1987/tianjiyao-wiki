#!/usr/bin/env node

/**
 * 检测AI生成内容的典型痕迹
 * 帮助识别需要人工润色的地方
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// AI生成内容的典型模式
const aiPatterns = {
  openings: [
    '在当今社会',
    '随着.*的发展',
    '众所周知',
    '本文将详细介绍',
    '让我们深入探讨',
    '首先.*让我们',
  ],
  transitions: [
    '首先.*其次.*最后',
    '首先.*然后.*接着.*最后',
    '一方面.*另一方面',
    '不仅.*而且',
    '既.*又',
  ],
  conclusions: [
    '总的来说',
    '综上所述',
    '通过以上分析.*可以看出',
    '综合考虑各方面因素',
    '希望本文能够为您提供帮助',
    '相信通过.*您一定能够',
  ],
  cliches: [
    '具有重要意义',
    '发挥着关键作用',
    '是.*的重要组成部分',
    '需要我们高度重视',
    '具有以下特点',
    '具体来说',
    '从.*角度来看',
    '值得注意的是',
  ],
  academicPhrases: [
    '根据研究表明',
    '数据显示',
    '经过分析发现',
    '从理论角度',
    '在实践中我们发现',
  ]
};

function detectPatterns(content, filePath) {
  const issues = [];
  
  // 检查各类模式
  Object.keys(aiPatterns).forEach(category => {
    aiPatterns[category].forEach(pattern => {
      const regex = new RegExp(pattern, 'g');
      const matches = content.match(regex);
      if (matches) {
        issues.push({
          category,
          pattern,
          count: matches.length,
          samples: matches.slice(0, 2) // 只显示前两个例子
        });
      }
    });
  });
  
  // 检查结构对称性
  const headings = content.match(/^#{2,3}\s+.+$/gm) || [];
  if (headings.length > 0) {
    const lengths = headings.map(h => h.length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.every(l => Math.abs(l - avgLength) < 5);
    if (variance && headings.length > 5) {
      issues.push({
        category: 'structure',
        pattern: '标题长度过于统一',
        count: headings.length,
        samples: ['可能需要调整标题多样性']
      });
    }
  }
  
  // 检查段落长度统一性
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
  if (paragraphs.length > 5) {
    const lengths = paragraphs.map(p => p.length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const uniformParagraphs = lengths.filter(l => Math.abs(l - avgLength) < 100).length;
    if (uniformParagraphs / lengths.length > 0.8) {
      issues.push({
        category: 'structure',
        pattern: '段落长度过于统一',
        count: paragraphs.length,
        samples: ['建议调整段落长度，增加变化']
      });
    }
  }
  
  return issues;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = detectPatterns(content, filePath);
  
  if (issues.length > 0) {
    console.log(`\n📄 ${path.relative('docs', filePath)}`);
    console.log(`   发现 ${issues.length} 个AI痕迹`);
    
    const grouped = {};
    issues.forEach(issue => {
      if (!grouped[issue.category]) grouped[issue.category] = [];
      grouped[issue.category].push(issue);
    });
    
    Object.keys(grouped).forEach(category => {
      const categoryNames = {
        openings: '开头套路',
        transitions: '过渡词',
        conclusions: '总结语',
        cliches: '套话',
        academicPhrases: '学术化',
        structure: '结构性'
      };
      
      console.log(`\n   ⚠️  ${categoryNames[category] || category}:`);
      grouped[category].forEach(issue => {
        console.log(`      - ${issue.pattern} (${issue.count}次)`);
        if (issue.samples && issue.samples.length > 0) {
          issue.samples.forEach(sample => {
            console.log(`        例: "${sample.substring(0, 50)}..."`);
          });
        }
      });
    });
  }
  
  return issues.length;
}

function main() {
  console.log('🔍 AI生成内容痕迹检测\n');
  console.log('正在扫描文档...\n');
  
  const patterns = [
    'docs/bazi/*.md',
    'docs/ziwei/*.md',
    'docs/yijing/*.md',
    'docs/ai/*.md',
    'docs/theory/*.md',
    'docs/practice/*.md'
  ];
  
  let totalFiles = 0;
  let filesWithIssues = 0;
  let totalIssues = 0;
  
  patterns.forEach(pattern => {
    const files = glob.sync(pattern);
    files.forEach(file => {
      if (file.includes('index.md')) return; // 跳过索引页
      
      totalFiles++;
      const issueCount = analyzeFile(file);
      if (issueCount > 0) {
        filesWithIssues++;
        totalIssues += issueCount;
      }
    });
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 检测总结\n');
  console.log(`   扫描文档: ${totalFiles} 个`);
  console.log(`   发现问题文档: ${filesWithIssues} 个`);
  console.log(`   AI痕迹总数: ${totalIssues} 个`);
  
  if (totalIssues > 0) {
    console.log('\n💡 建议:');
    console.log('   1. 重点关注痕迹较多的文档');
    console.log('   2. 修改开头和结尾段落');
    console.log('   3. 替换套话和过渡词');
    console.log('   4. 增加个性化表达');
    console.log('   5. 打破过于统一的结构');
  } else {
    console.log('\n✅ 未发现明显AI痕迹');
  }
  
  console.log('\n📖 详细修改建议见: 修改后再次运行本脚本验证');
}

main();
