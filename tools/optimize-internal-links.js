#!/usr/bin/env node

/**
 * 优化内部链接系统
 * 为文档增加相关链接，减少孤立文档
 */

const fs = require('fs');
const path = require('path');

const docsDir = path.join(__dirname, 'docs');

// 文档关系映射
const linkRelations = {
  'bazi/index.md': [
    { text: '八字命理入门教程', link: './introduction.md' },
    { text: '十神体系详解', link: './ten-gods.md' },
    { text: '紫微斗数理论', link: '../ziwei/index.md' },
    { text: 'AI与传统玄学', link: '../ai/ai-introduction.md' }
  ],
  'bazi/introduction.md': [
    { text: '返回八字命理首页', link: './index.md' },
    { text: '十神体系深入学习', link: './ten-gods.md' },
    { text: '紫微斗数对比学习', link: '../ziwei/index.md' }
  ],
  'bazi/ten-gods.md': [
    { text: '返回八字命理首页', link: './index.md' },
    { text: '八字入门基础', link: './introduction.md' },
    { text: '十神体系完整版', link: './ten-gods-enhanced.md' }
  ],
  'bazi/ten-gods-enhanced.md': [
    { text: '返回八字命理首页', link: './index.md' },
    { text: '十神基础版本', link: './ten-gods.md' },
    { text: '八字入门教程', link: './introduction.md' }
  ],
  'ziwei/index.md': [
    { text: '紫微斗数星曜详解', link: './stars.md' },
    { text: '八字命理学习', link: '../bazi/index.md' },
    { text: 'AI玄学研究', link: '../ai/ai-introduction.md' },
    { text: '返回首页', link: '../index.md' }
  ],
  'ziwei/stars.md': [
    { text: '返回紫微斗数首页', link: './index.md' },
    { text: '八字命理对比', link: '../bazi/index.md' },
    { text: 'AI辅助分析', link: '../ai/ai-introduction.md' }
  ],
  'ai/ai-introduction.md': [
    { text: 'LLM与传统预测研究', link: './llm-traditional-prediction.md' },
    { text: '八字命理应用', link: '../bazi/index.md' },
    { text: '紫微斗数应用', link: '../ziwei/index.md' },
    { text: '返回首页', link: '../index.md' }
  ],
  'ai/llm-traditional-prediction.md': [
    { text: 'AI与玄学融合概述', link: './ai-introduction.md' },
    { text: '八字命理理论', link: '../bazi/index.md' },
    { text: '紫微斗数理论', link: '../ziwei/index.md' }
  ]
};

function addRelatedLinksSection(filePath, links) {
  const fullPath = path.join(docsDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  文件不存在: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  
  // 检查是否已有相关链接部分
  if (content.includes('## 📚 相关阅读') || content.includes('## 相关文档')) {
    console.log(`✓ ${filePath} 已有相关链接部分`);
    return;
  }

  // 构建相关链接部分
  const relatedSection = `

---

## 📚 相关阅读

${links.map(link => `- [${link.text}](${link.link})`).join('\n')}

`;

  // 在文件末尾添加（在最后一个---之前或文件末尾）
  if (content.trimEnd().endsWith('---')) {
    content = content.trimEnd().slice(0, -3) + relatedSection + '\n---\n';
  } else {
    content = content.trimEnd() + relatedSection;
  }

  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log(`✅ 已为 ${filePath} 添加 ${links.length} 个相关链接`);
}

console.log('🔗 开始优化内部链接系统\n');

let successCount = 0;
let totalCount = 0;

for (const [filePath, links] of Object.entries(linkRelations)) {
  totalCount++;
  try {
    addRelatedLinksSection(filePath, links);
    successCount++;
  } catch (error) {
    console.error(`❌ 处理 ${filePath} 时出错:`, error.message);
  }
}

console.log(`\n✅ 完成！成功处理 ${successCount}/${totalCount} 个文档`);
