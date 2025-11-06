#!/usr/bin/env node

/**
 * 逐个创建缺失的文档 - 更稳定的方式
 * 使用更长的超时时间和重试机制
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 从命令行参数获取要创建的文档类型
const docType = process.argv[2] || 'ziwei';

const docConfigs = {
  ziwei: {
    filename: 'practical-analysis.md',
    dir: 'docs/ziwei',
    title: '紫微斗数实战分析方法：从理论到实践',
    description: '详解紫微斗数的完整分析流程、判断技巧及实战案例，帮助学习者将理论转化为实践能力',
    keywords: ['实战分析', '排盘技巧', '判断流程', '命盘解读', '综合分析', '紫微实践'],
    author: '紫微斗数研究团队',
    prompt: `请撰写一篇4500-5500字的紫微斗数实战分析文章，内容包括：排盘基础、分析流程、命盘解读技巧、各领域分析方法、常见问题处理、3个实战案例、分析注意事项。要求实用性强、步骤清晰、案例详细。`
  },
  ai: {
    filename: 'knowledge-graph.md',
    dir: 'docs/ai',
    title: '命理知识图谱构建：语义网络中的传统智慧',
    description: '系统阐述命理知识图谱的构建方法、技术架构及应用场景，实现传统命理知识的结构化和智能化',
    keywords: ['知识图谱', '语义网络', '本体建模', '关系抽取', '知识推理', '图数据库', 'Neo4j', '命理知识'],
    author: 'AI玄学研究团队',
    prompt: `请撰写一篇4500-5500字的命理知识图谱构建文章，内容包括：知识图谱基础、本体建模、知识抽取、图谱构建技术、知识表示、知识推理、应用场景、技术实现、案例研究、挑战与展望。要求技术方案详细、包含架构图和示例代码。`
  },
  theory: {
    filename: 'heavenly-stems.md',
    dir: 'docs/theory',
    title: '天干详解：十天干的象征与应用',
    description: '全面解析十天干的含义、属性、相互关系及在命理学中的具体应用',
    keywords: ['天干', '十天干', '甲乙丙丁', '天干五行', '天干阴阳', '干支系统', '天干合化'],
    author: '命理理论研究团队',
    prompt: `请撰写一篇5000-6000字的天干详解文章，内容包括：天干概述、十天干详解（每个天干的特性、象征、应用）、天干属性、天干关系、天干组合、在八字和紫微中的应用、性格象征、实践应用、记忆技巧。要求系统全面、实用性强。`
  }
};

async function generateWithRetry(config, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`\n🔄 正在生成: ${config.title}`);
      if (i > 0) console.log(`   (第 ${i + 1} 次尝试)`);
      
      console.log('📡 调用API中...');
      
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是命理学专家，撰写专业学术文章。确保内容准确、结构清晰、实用性强。'
            },
            {
              role: 'user',
              content: config.prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 8000
        },
        {
          headers: {
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 240000  // 4分钟
        }
      );
      
      console.log('✅ API调用成功');
      return response.data.choices[0].message.content;
      
    } catch (error) {
      console.error(`❌ 第 ${i + 1} 次尝试失败: ${error.message}`);
      
      if (i < maxRetries - 1) {
        const waitTime = (i + 1) * 5;
        console.log(`⏳ 等待 ${waitTime} 秒后重试...`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
      } else {
        throw new Error(`所有重试都失败了: ${error.message}`);
      }
    }
  }
}

async function main() {
  const config = docConfigs[docType];
  
  if (!config) {
    console.error('❌ 无效的文档类型。使用方法:');
    console.log('   node create-single-doc.js ziwei    # 创建紫微实战分析');
    console.log('   node create-single-doc.js ai       # 创建知识图谱');
    console.log('   node create-single-doc.js theory   # 创建天干详解');
    process.exit(1);
  }

  if (!DEEPSEEK_API_KEY) {
    console.error('❌ 未找到DEEPSEEK_API_KEY环境变量');
    process.exit(1);
  }

  console.log(`\n📝 开始创建文档: ${config.filename}\n`);

  try {
    const content = await generateWithRetry(config);
    
    const frontMatter = `---
layout: default
title: ${config.title}
description: ${config.description}
keywords: [${config.keywords.join(', ')}]
author: ${config.author}
date: ${new Date().toISOString().split('T')[0]}
---

`;

    const relatedLinks = `

---

## 📚 相关阅读

- [返回首页](../index.md)
- [八字命理](../bazi/index.md)
- [紫微斗数](../ziwei/index.md)
- [AI与传统玄学](../ai/ai-introduction.md)
`;

    const fullContent = frontMatter + content + relatedLinks;
    const filePath = path.join(__dirname, config.dir, config.filename);
    
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, fullContent, 'utf-8');
    
    console.log(`\n✅ 成功创建: ${config.dir}/${config.filename}`);
    console.log(`\n💡 继续创建其他文档:`);
    console.log('   node create-single-doc.js ziwei');
    console.log('   node create-single-doc.js ai');
    console.log('   node create-single-doc.js theory');
    
  } catch (error) {
    console.error(`\n❌ 创建失败: ${error.message}`);
    console.log('\n💡 建议稍后重试相同命令');
    process.exit(1);
  }
}

main();
