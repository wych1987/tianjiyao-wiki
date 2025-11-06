#!/usr/bin/env node

/**
 * 完善基础理论模块
 * 创建命理学的理论基础文档
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 基础理论模块文档配置
const theoryDocs = [
  {
    filename: 'yinyang.md',
    dir: 'docs/theory',
    title: '阴阳理论基础：中国哲学的核心思想',
    description: '系统阐述阴阳理论的哲学内涵、演变历史及在命理学中的核心应用',
    keywords: ['阴阳', '阴阳五行', '太极', '哲学基础', '中国哲学', '对立统一', '动态平衡'],
    prompt: `请撰写一篇关于"阴阳理论"的学术基础文章，要求：

1. **阴阳起源**：
   - 《易经》中的阴阳思想
   - 先秦哲学中的阴阳概念
   - 阴阳理论的历史演变
   - 现代学术研究视角
2. **核心概念**：
   - 阴阳的定义
   - 太极与阴阳的关系
   - 阴阳的基本属性
   - 阴阳的符号表示
3. **阴阳规律**：
   - 对立统一：阴阳相对
   - 互根互用：阴阳依存
   - 消长平衡：阴阳转化
   - 无限可分：阴阳层次
4. **阴阳分类**：
   - 时间中的阴阳（昼夜、四季）
   - 空间中的阴阳（上下、内外）
   - 物质中的阴阳（动静、刚柔）
   - 人体中的阴阳（脏腑、气血）
5. **在命理学中的应用**：
   - 天干的阴阳
   - 地支的阴阳
   - 五行的阴阳
   - 星曜的阴阳
   - 宫位的阴阳
6. **阴阳平衡**：
   - 平衡的重要性
   - 失衡的表现
   - 调和的方法
   - 养生与命理的结合
7. **现代诠释**：
   - 系统论视角
   - 辩证法对比
   - 科学解读尝试
   - 文化价值反思
8. **实践应用**：
   - 命局阴阳平衡判断
   - 性格分析中的阴阳
   - 人际关系中的阴阳
   - 决策中的阴阳思维
9. **案例分析**：
   - 命理分析中的阴阳应用
   - 具体判断实例

要求：
- 哲学深度与通俗表达并重
- 理论与应用结合
- 字数4000-5000字`
  },
  {
    filename: 'heavenly-stems.md',
    dir: 'docs/theory',
    title: '天干详解：十天干的象征与应用',
    description: '全面解析十天干的含义、属性、相互关系及在命理学中的具体应用',
    keywords: ['天干', '十天干', '甲乙丙丁', '天干五行', '天干阴阳', '干支系统', '天干合化'],
    prompt: `请撰写一篇关于"十天干"的系统理论文章，要求：

1. **天干概述**：
   - 天干的起源和历史
   - 干支历法的形成
   - 天干的文化意义
   - 在命理学中的地位
2. **十天干详解**：
   - 甲木：特性、象征、应用
   - 乙木：特性、象征、应用
   - 丙火：特性、象征、应用
   - 丁火：特性、象征、应用
   - 戊土：特性、象征、应用
   - 己土：特性、象征、应用
   - 庚金：特性、象征、应用
   - 辛金：特性、象征、应用
   - 壬水：特性、象征、应用
   - 癸水：特性、象征、应用
3. **天干属性**：
   - 阴阳属性
   - 五行归属
   - 方位对应
   - 时间对应
   - 季节对应
4. **天干关系**：
   - 天干相合（合化条件、结果、意义）
     * 甲己合化土
     * 乙庚合化金
     * 丙辛合化水
     * 丁壬合化木
     * 戊癸合化火
   - 天干相冲
   - 天干相克
   - 天干相生
5. **天干组合**：
   - 同性组合
   - 异性组合
   - 吉凶组合
   - 特殊组合
6. **在八字中的应用**：
   - 日主天干的判断
   - 天干透出的意义
   - 天干盖头的影响
   - 天干合化的条件
7. **在紫微中的应用**：
   - 天干与星曜的对应
   - 生年天干的作用
   - 四化与天干的关系
8. **性格象征**：
   - 各天干对应的性格特质
   - 天干组合的性格影响
   - 心理分析应用
9. **实践应用**：
   - 天干在命局中的判断
   - 天干组合分析方法
   - 实际案例解析
10. **记忆技巧**：
    - 天干口诀
    - 联想记忆法
    - 实用速查表

要求：
- 系统全面
- 实用性强
- 字数5000-6000字`
  },
  {
    filename: 'earthly-branches.md',
    dir: 'docs/theory',
    title: '地支详解：十二地支的奥秘',
    description: '深入讲解十二地支的内涵、相互关系、藏干理论及命理应用',
    keywords: ['地支', '十二地支', '子丑寅卯', '地支五行', '地支刑冲害合', '地支藏干', '生肖'],
    prompt: `请撰写一篇关于"十二地支"的深度理论文章，要求：

1. **地支概述**：
   - 地支的起源
   - 十二生肖的由来
   - 地支与月令的关系
   - 地支的天文基础
2. **十二地支详解**：
   - 子水：属性、象征、月令、藏干
   - 丑土：属性、象征、月令、藏干
   - 寅木：属性、象征、月令、藏干
   - 卯木：属性、象征、月令、藏干
   - 辰土：属性、象征、月令、藏干
   - 巳火：属性、象征、月令、藏干
   - 午火：属性、象征、月令、藏干
   - 未土：属性、象征、月令、藏干
   - 申金：属性、象征、月令、藏干
   - 酉金：属性、象征、月令、藏干
   - 戌土：属性、象征、月令、藏干
   - 亥水：属性、象征、月令、藏干
3. **地支属性**：
   - 阴阳分类
   - 五行归属
   - 四季分类
   - 方位对应
   - 时辰对应
4. **地支藏干理论**：
   - 藏干的概念和意义
   - 各地支藏干详解
   - 余气、中气、本气
   - 藏干透出的判断
   - 藏干的实际应用
5. **地支关系**：
   - 地支六合：
     * 子丑合化土
     * 寅亥合化木
     * 卯戌合化火
     * 辰酉合化金
     * 巳申合化水
     * 午未合化土
   - 地支三合：
     * 申子辰合水局
     * 寅午戌合火局
     * 亥卯未合木局
     * 巳酉丑合金局
   - 地支三会：
     * 寅卯辰会东方木
     * 巳午未会南方火
     * 申酉戌会西方金
     * 亥子丑会北方水
   - 地支六冲：
     * 子午冲、丑未冲
     * 寅申冲、卯酉冲
     * 辰戌冲、巳亥冲
   - 地支相刑：
     * 寅巳申三刑
     * 丑戌未三刑
     * 子卯相刑
     * 辰午酉亥自刑
   - 地支相害：
     * 六害关系详解
   - 地支相破：
     * 六破关系详解
6. **月令与节气**：
   - 十二月建
   - 节气与地支的对应
   - 月令司权的意义
   - 节气交接的判断
7. **在命理中的应用**：
   - 地支在八字中的作用
   - 地支在紫微中的应用
   - 地支组合的吉凶判断
   - 地支动态变化
8. **实践应用**：
   - 地支关系在命局中的体现
   - 地支刑冲会合的实际影响
   - 案例分析
9. **记忆技巧**：
   - 地支口诀
   - 关系记忆法
   - 实用速查表

要求：
- 内容详尽
- 关系清晰
- 字数6000-7000字`
  },
  {
    filename: 'sixty-jiazi.md',
    dir: 'docs/theory',
    title: '六十甲子体系：干支组合的完整理论',
    description: '系统讲解六十甲子的构成、纳音五行、空亡理论及在命理学中的广泛应用',
    keywords: ['六十甲子', '干支组合', '纳音五行', '空亡', '甲子历', '干支纪年', '命理基础'],
    prompt: `请撰写一篇关于"六十甲子"的完整理论文章，要求：

1. **六十甲子概述**：
   - 六十甲子的由来
   - 干支组合规律
   - 六十年一周期
   - 历史文化意义
2. **六十甲子表**：
   - 完整的六十甲子列表
   - 排列规律解析
   - 记忆方法
3. **纳音五行理论**：
   - 纳音的起源和意义
   - 纳音推算方法
   - 六十甲子纳音表：
     * 海中金（甲子、乙丑）
     * 炉中火（丙寅、丁卯）
     * 大林木（戊辰、己巳）
     * ... （完整列表）
   - 纳音五行的象征意义
   - 纳音在命理中的应用
4. **空亡理论**：
   - 空亡的概念
   - 空亡的推算方法
   - 旬空表
   - 空亡的吉凶判断
   - 空亡在八字中的作用
   - 空亡在紫微中的应用
5. **干支组合分析**：
   - 天干地支配对规律
   - 阴阳配合
   - 五行配合
   - 特殊组合解析
6. **六十甲子的应用**：
   - 纪年法
   - 纪月法
   - 纪日法
   - 纪时法
7. **在八字中的应用**：
   - 年柱甲子的意义
   - 日柱甲子的重要性
   - 纳音配合分析
   - 空亡在命局中的判断
8. **在紫微中的应用**：
   - 生年干支的作用
   - 大限流年的推算
   - 空宫的判断
9. **六十甲子与人生周期**：
   - 甲子年生人的特点
   - 六十年本命年
   - 人生阶段与干支对应
10. **特殊甲子**：
    - 重要甲子年份
    - 历史上的甲子年
    - 甲子文化现象
11. **实践应用**：
    - 快速推算技巧
    - 命理分析中的运用
    - 案例解析
12. **现代意义**：
    - 干支历法的保留
    - 传统文化传承
    - 现代应用场景

要求：
- 系统完整
- 表格清晰
- 实用性强
- 字数5000-6000字`
  }
];

// 学术资源配置
const academicResources = {
  theory: [
    '《周易》哲学思想',
    '《黄帝内经》理论基础',
    '《渊海子平》理论阐述',
    '《三命通会》基础理论',
    '清华大学《中国哲学史》',
    '北京大学《易学研究》',
    '中国人民大学《中国文化研究》',
    '北京师范大学《中国传统文化》',
    '《阴阳五行学说》（学术研究）',
    '《干支历法研究》（现代研究）',
    '《中国古代天文历法》'
  ]
};

async function generateContent(docConfig) {
  console.log(`\n🔄 正在生成: ${docConfig.title}`);
  
  const systemPrompt = `你是一位研究中国传统文化和命理理论的学者。
你的任务是撰写高质量的理论基础文章，要求：
1. 理论准确，基于经典文献
2. 逻辑清晰，系统完整
3. 深入浅出，通俗易懂
4. 理论与应用结合
5. 引用权威文献
6. 尊重传统，理性分析

可参考的权威资源：
${academicResources.theory.map(r => `- ${r}`).join('\n')}

请确保内容的学术性和准确性。`;

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
author: 命理理论研究团队
date: ${new Date().toISOString().split('T')[0]}
categories: [基础理论, 传统文化]
---

`;

  const relatedLinks = `

---

## 📚 相关阅读

- [八字命理学习](../bazi/index.md)
- [紫微斗数学习](../ziwei/index.md)
- [实践应用指南](../practice/self-learning.md)
- [返回首页](../index.md)
`;

  const fullContent = frontMatter + content + relatedLinks;
  const filePath = path.join(__dirname, docConfig.dir, docConfig.filename);
  
  // 确保目录存在
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, fullContent, 'utf-8');
  console.log(`✅ 已创建: ${docConfig.dir}/${docConfig.filename}`);
}

async function main() {
  console.log('📖 开始创建基础理论模块文档...\n');
  console.log(`📋 计划创建 ${theoryDocs.length} 个文档\n`);

  if (!DEEPSEEK_API_KEY) {
    console.error('❌ 错误: 未找到DEEPSEEK_API_KEY环境变量');
    console.log('💡 请在.env文件中设置: DEEPSEEK_API_KEY=your_key_here');
    process.exit(1);
  }

  let successCount = 0;
  let failCount = 0;

  for (const docConfig of theoryDocs) {
    try {
      const content = await generateContent(docConfig);
      createMarkdownFile(docConfig, content);
      successCount++;
      
      // 避免API限流
      console.log('⏳ 等待2秒以避免API限流...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ 创建 ${docConfig.filename} 失败:`, error.message);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 基础理论模块创建完成统计:');
  console.log(`   ✅ 成功: ${successCount} 个文档`);
  console.log(`   ❌ 失败: ${failCount} 个文档`);
  console.log('='.repeat(60));

  if (successCount > 0) {
    console.log('\n💡 下一步建议:');
    console.log('   1. 运行 npm run analyze 检查整体文档质量');
    console.log('   2. 审阅所有生成的内容');
    console.log('   3. 更新首页导航和分类');
    console.log('   4. 提交到Git仓库');
  }
}

main().catch(console.error);
