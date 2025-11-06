#!/usr/bin/env node

/**
 * 创建缺失的核心文档
 * 使用DeepSeek API生成高质量的学术内容
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 需要创建的文档配置
const missingDocs = [
  {
    filename: 'five-elements.md',
    dir: 'docs/bazi',
    title: '五行生克理论：八字命理的哲学基础',
    description: '深入解析五行理论的起源、相生相克关系、在八字命理中的应用及其哲学内涵',
    keywords: ['五行', '金木水火土', '相生相克', '五行平衡', '八字', '阴阳五行', '天干地支'],
    prompt: `请撰写一篇关于"五行生克理论"的专业学术文章，要求：

1. **理论渊源**：五行理论的历史发展和哲学基础
2. **基本概念**：金、木、水、火、土的基本属性和象征
3. **相生关系**：五行相生的规律和应用（金生水、水生木、木生火、火生土、土生金）
4. **相克关系**：五行相克的规律和应用（金克木、木克土、土克水、水克火、火克金）
5. **在八字中的应用**：如何通过五行分析命局强弱
6. **五行平衡**：五行平衡对命运的影响
7. **实践案例**：具体的分析示例

要求：
- 学术性强，引用权威文献
- 通俗易懂，适合初学者
- 包含实用的分析方法
- 字数3000-4000字`
  },
  {
    filename: 'four-pillars.md',
    dir: 'docs/bazi',
    title: '四柱排盘方法：八字命理的技术基础',
    description: '系统讲解四柱八字的排盘方法、天干地支的推算规则、节气判断等核心技术',
    keywords: ['四柱', '排盘', '天干地支', '节气', '时辰', '万年历', '八字排盘'],
    prompt: `请撰写一篇关于"四柱排盘方法"的专业教程文章，要求：

1. **四柱基础**：年柱、月柱、日柱、时柱的概念
2. **排盘步骤**：详细的排盘流程和方法
3. **年柱推算**：如何根据出生年份推算年柱
4. **月柱推算**：节气与月柱的关系
5. **日柱推算**：万年历的使用和日柱查找
6. **时柱推算**：根据出生时辰确定时柱
7. **特殊情况**：跨年、跨月、跨日的处理
8. **现代工具**：软件排盘与手工排盘的对比
9. **实践练习**：提供排盘练习示例

要求：
- 操作步骤清晰
- 包含图表说明
- 提供查询表格
- 字数3000-4000字`
  },
  {
    filename: 'luck-cycles.md',
    dir: 'docs/bazi',
    title: '大运流年详解：命运轨迹的时间解码',
    description: '深入分析大运、流年的推算方法、作用规律及在命理预测中的实际应用',
    keywords: ['大运', '流年', '运程', '岁运并临', '命运周期', '时间因素'],
    prompt: `请撰写一篇关于"大运流年"的专业分析文章，要求：

1. **大运基础**：大运的概念、起运时间、排列规则
2. **流年理论**：流年的作用机制和分析方法
3. **大运推算**：如何计算起运岁数和大运干支
4. **运程分析**：大运对命局的影响规律
5. **流年判断**：流年吉凶的判断方法
6. **岁运并临**：大运与流年的相互作用
7. **实践应用**：如何运用大运流年进行预测
8. **特殊情况**：童限、空亡等特殊运程
9. **案例分析**：实际案例的运程解析

要求：
- 理论与实践结合
- 包含时间计算表格
- 提供分析框架
- 字数3500-4500字`
  },
  {
    filename: 'pattern-analysis.md',
    dir: 'docs/bazi',
    title: '命理格局分析：八字综合判断的艺术',
    description: '系统阐述八字格局的分类体系、判断方法、用神忌神的选取及格局高低的评定标准',
    keywords: ['格局', '用神', '忌神', '正格', '变格', '命局分析', '格局高低'],
    prompt: `请撰写一篇关于"命理格局分析"的高级专业文章，要求：

1. **格局概述**：格局理论的历史和重要性
2. **格局分类**：正格、变格、特殊格局的分类体系
3. **用神理论**：用神的选取原则和方法
4. **忌神判断**：如何识别和分析忌神
5. **格局判断**：综合判断格局高低的标准
6. **常见格局**：正官格、正财格、食神格等详解
7. **特殊格局**：从革、化气等特殊格局分析
8. **格局破损**：格局破损的识别和影响
9. **实战分析**：完整的格局分析案例

要求：
- 系统性强，逻辑清晰
- 理论深度与实用性并重
- 包含判断流程图
- 字数4000-5000字`
  }
];

// 学术资源配置
const academicResources = {
  bazi: [
    '清华大学《中国传统文化研究》',
    '北京大学哲学系《中国哲学史》',
    '中国人民大学《易学研究》',
    '北京师范大学《中国文化研究》',
    '复旦大学《中国古代思想史》',
    'MIT《认知科学与文化研究》',
    'Stanford University《东亚文化研究》',
    '《渊海子平》（宋·徐子平）',
    '《三命通会》（明·万民英）',
    '《滴天髓》（明·刘基）',
    '《穷通宝鉴》（清·余春台）',
    '《子平真诠》（清·沈孝瞻）',
    '《命理探源》（民国·袁树珊）',
    '《易经》系辞传',
    '《黄帝内经》五行理论',
    '《周易参同契》（东汉·魏伯阳）'
  ]
};

async function generateContent(docConfig) {
  console.log(`\n🔄 正在生成: ${docConfig.title}`);
  
  const systemPrompt = `你是一位专业的命理学研究学者，精通中国传统文化和八字命理学。
你的任务是撰写高质量的学术文章，要求：
1. 内容准确、专业，基于经典文献
2. 结构清晰，逻辑严密
3. 既有理论深度，又通俗易懂
4. 包含实用的分析方法和案例
5. 引用权威文献，体现学术性

可参考的权威资源：
${academicResources.bazi.map(r => `- ${r}`).join('\n')}`;

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: docConfig.prompt }
        ],
        temperature: 0.7,
        max_tokens: 8000
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(`❌ API调用失败:`, error.message);
    throw error;
  }
}

function createMarkdownFile(docConfig, content) {
  const frontMatter = `---
layout: default
title: ${docConfig.title}
description: ${docConfig.description}
keywords: [${docConfig.keywords.join(', ')}]
author: 命理学研究团队
date: ${new Date().toISOString().split('T')[0]}
---

`;

  const relatedLinks = `

---

## 📚 相关阅读

- [返回八字命理首页](./index.md)
- [八字入门教程](./introduction.md)
- [十神体系详解](./ten-gods.md)
- [紫微斗数学习](../ziwei/index.md)
`;

  const fullContent = frontMatter + content + relatedLinks;
  const filePath = path.join(__dirname, docConfig.dir, docConfig.filename);
  
  fs.writeFileSync(filePath, fullContent, 'utf-8');
  console.log(`✅ 已创建: ${docConfig.dir}/${docConfig.filename}`);
}

async function main() {
  console.log('📝 开始创建缺失的文档...\n');
  console.log(`📋 计划创建 ${missingDocs.length} 个文档\n`);

  if (!DEEPSEEK_API_KEY) {
    console.error('❌ 错误: 未找到DEEPSEEK_API_KEY环境变量');
    console.log('💡 请在.env文件中设置: DEEPSEEK_API_KEY=your_key_here');
    process.exit(1);
  }

  let successCount = 0;
  let failCount = 0;

  for (const docConfig of missingDocs) {
    try {
      const content = await generateContent(docConfig);
      createMarkdownFile(docConfig, content);
      successCount++;
      
      // 避免API限流
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ 创建 ${docConfig.filename} 失败:`, error.message);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 创建完成统计:');
  console.log(`   ✅ 成功: ${successCount} 个文档`);
  console.log(`   ❌ 失败: ${failCount} 个文档`);
  console.log('='.repeat(60));

  if (successCount > 0) {
    console.log('\n💡 下一步建议:');
    console.log('   1. 运行 npm run analyze 检查文档质量');
    console.log('   2. 审阅生成的内容并进行必要的修改');
    console.log('   3. 提交到Git仓库');
  }
}

main().catch(console.error);
