#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const YAML = require('yaml');

const ROOT = process.cwd();
const EXCLUDED = new Set([
  'docs/README.md',
  'docs/SEO_IMPLEMENTATION_GUIDE.md'
]);

const sectionKeywords = {
  ai: ['AI命理', '人工智能', '传统玄学'],
  bazi: ['八字命理', '四柱八字', '十神'],
  ziwei: ['紫微斗数', '星曜', '宫位'],
  yijing: ['周易六爻', '八卦', '断卦'],
  theory: ['阴阳五行', '天干地支', '命理基础'],
  practice: ['命理学习', '案例分析', '实践指南']
};

const descriptionSuffixes = {
  ai: '，适合了解技术方法、应用场景与研究边界。',
  bazi: '，适合入门学习、专题进阶与案例延伸阅读。',
  ziwei: '，适合建立读盘框架、专题理解与实战进阶。',
  yijing: '，适合建立断卦框架、分类占断与实战进阶。',
  theory: '，适合作为八字、紫微斗数与六爻学习的理论基础。',
  practice: '，适合用于专题检索、学习规划与案例延伸。',
  docs: '，适合系统学习、专题检索与延伸阅读。'
};

const overrides = {
  'docs/index.md': {
    title: '天机爻Wiki - 传统命理学知识库',
    seo_title: '八字、紫微、周易与 AI 命理知识库',
    description: '天机爻官方知识库，系统整理八字命理、紫微斗数、周易六爻、阴阳五行与 AI 命理内容，适合入门学习、专题检索与案例延伸。',
    h1: '八字、紫微、周易与 AI 命理知识库'
  },
  'docs/ai/ai-introduction.md': {
    title: 'AI 命理与传统玄学概论：技术、方法与应用',
    seo_title: 'AI 命理概论：技术、方法与应用',
    description: '系统介绍 AI 命理与传统玄学的结合方式，涵盖机器学习、自然语言处理、知识图谱与实际应用场景。',
    h1: 'AI 命理与传统玄学概论'
  },
  'docs/ai/machine-learning-bazi.md': {
    title: '机器学习在八字命理中的应用：特征、模型与分析',
    seo_title: '机器学习在八字命理中的应用',
    description: '系统梳理机器学习在八字命理中的应用，包括特征工程、模型训练、结果解释与分析边界。',
    h1: '机器学习在八字命理中的应用'
  },
  'docs/ai/nlp-analysis.md': {
    title: 'NLP 在命理文本分析中的应用：意图识别与知识抽取',
    seo_title: 'NLP 在命理文本分析中的应用',
    description: '系统介绍自然语言处理在命理文本分析中的应用，包括意图识别、实体抽取、问答系统与语料处理。',
    h1: 'NLP 在命理文本分析中的应用'
  },
  'docs/ai/knowledge-graph.md': {
    title: '命理知识图谱：本体建模、关系抽取与知识推理',
    seo_title: '命理知识图谱：建模、抽取与推理',
    description: '系统介绍命理知识图谱的构建方法，涵盖本体建模、关系抽取、图数据库设计与知识推理应用。',
    h1: '命理知识图谱：本体建模、关系抽取与知识推理'
  },
  'docs/ai/llm-traditional-prediction.md': {
    title: '大语言模型在传统预测中的应用：提示、推理与风险',
    seo_title: '大语言模型在传统预测中的应用',
    description: '讨论大语言模型在传统预测与命理文本场景中的应用，重点关注提示设计、推理链、知识约束与风险控制。',
    h1: '大语言模型在传统预测中的应用'
  },
  'docs/ai/future-trends.md': {
    title: 'AI 命理未来趋势：多模态、大模型与知识系统',
    seo_title: 'AI 命理未来趋势：多模态与大模型',
    description: '分析 AI 命理未来的发展方向，涵盖多模态模型、大语言模型、知识系统与文化应用场景。',
    h1: 'AI 命理未来趋势：多模态、大模型与知识系统'
  },
  'docs/bazi/introduction.md': {
    title: '八字命理入门：天干地支、四柱与十神基础',
    seo_title: '八字命理入门：四柱与十神基础',
    description: '系统介绍八字命理入门知识，包括天干地支、四柱结构、五行生克与十神基础，适合初学者建立框架。',
    h1: '八字命理入门：天干地支、四柱与十神基础'
  },
  'docs/bazi/five-elements.md': {
    title: '五行生克：八字命理中的金木水火土与平衡逻辑',
    seo_title: '五行生克：八字命理中的平衡逻辑',
    description: '系统讲解五行生克在八字命理中的作用，涵盖金木水火土、相生相克、五行失衡与实际判断思路。',
    h1: '五行生克：八字命理中的平衡逻辑'
  },
  'docs/bazi/four-pillars.md': {
    title: '四柱八字排盘推算方法：年月日时柱计算规则与五虎五鼠遁速查表',
    seo_title: '四柱八字排盘计算规则：年月日时柱推算与五虎五鼠遁速查',
    description: '【四柱八字排盘速查】系统讲解年月日时柱精准推算法则：立春换年、二十四节气换月（五虎遁）、万年历日柱换算与五鼠遁日起时表，讲透早晚子时与真太阳时校准，附排盘步骤速查。',
    h1: '四柱八字排盘推算方法：年月日时柱计算规则与五虎五鼠遁速查表'
  },
  'docs/bazi/luck-cycles.md': {
    title: '八字大运流年怎么看：起运年龄计算、十年大运顺逆与流年断法全解',
    seo_title: '八字大运流年怎么看：起运年龄计算与流年吉凶断法速查',
    description: '【大运流年排盘速查】系统讲解八字大运流年看盘法则：起运年龄精准计算公式、阳男阴女顺逆排法、大运流年与原局吉凶互动（岁运并临/天克地冲）及十年阶段断法步骤，附实操案例速查。',
    h1: '八字大运流年怎么看：起运年龄计算、十年大运顺逆与流年断法全解'
  },
  'docs/bazi/pattern-analysis.md': {
    title: '八字格局怎么看：八大正格与特殊变格速查表、取格顺序与用神判断全解',
    seo_title: '八字格局怎么看：正格变格速查表与月令取格顺序全解',
    description: '【八字格局速查全解】系统整理八字月令取格法则：八大正格（正官/七杀/正印/偏印/食神/伤官/财星）与特殊变格（从格/专旺格）判断总表、格局成败救应与喜用神定位步骤，附实操断盘指引。',
    h1: '八字格局怎么看：八大正格与特殊变格速查表、取格顺序与用神判断全解'
  },
  'docs/practice/learning-map.md': {
    title: '命理学习地图：八字、紫微、六爻进阶路线',
    seo_title: '命理学习地图：八字、紫微、六爻路线',
    description: '整理八字、紫微斗数、周易六爻三大体系的学习顺序，帮助读者建立可执行的命理进阶路线。',
    h1: '命理学习地图：八字、紫微、六爻进阶路线'
  },
  'docs/practice/index.md': {
    title: '命理实践指南：学习地图、命例库与专题导航',
    seo_title: '命理实践指南：学习地图、命例库与专题导航',
    description: '提供命理学习地图、命例库索引、专题导航、自学方法与工具资源，帮助读者把八字、紫微与六爻真正用起来。',
    h1: '命理实践指南'
  },
  'docs/practice/self-learning.md': {
    title: '命理自学指南：入门路线、阶段目标与学习方法',
    seo_title: '命理自学指南：入门路线与学习方法',
    description: '提供命理自学路线、阶段目标、学习方法与资源建议，帮助初学者建立可持续的学习节奏。',
    h1: '命理自学指南：入门路线、阶段目标与学习方法'
  },
  'docs/practice/case-studies.md': {
    title: '命理案例分析：八字与紫微的实战学习方法',
    seo_title: '命理案例分析：八字与紫微实战方法',
    description: '通过八字与紫微斗数案例分析，展示从理论到实战的判断流程、证据组织与复盘方法。',
    h1: '命理案例分析：八字与紫微的实战学习方法'
  },
  'docs/practice/common-mistakes.md': {
    title: '命理学习常见误区：入门避坑与纠错方法',
    seo_title: '命理学习常见误区：避坑与纠错',
    description: '梳理命理学习中的常见误区与纠错方法，帮助初学者避免盲点、误判与路径偏移。',
    h1: '命理学习常见误区：入门避坑与纠错方法'
  },
  'docs/practice/tools-resources.md': {
    title: '命理学习工具与资源：排盘工具、书单与资料库',
    seo_title: '命理学习工具与资源：排盘工具与书单',
    description: '汇总命理学习常用的排盘工具、参考书单、资料库与在线资源，帮助读者提高学习效率。',
    h1: '命理学习工具与资源：排盘工具、书单与资料库'
  },
  'docs/theory/yinyang.md': {
    title: '阴阳理论基础：平衡、转化与命理判断框架',
    seo_title: '阴阳理论基础：平衡与转化',
    description: '系统讲解阴阳理论的核心概念、平衡关系、转化逻辑及其在命理判断中的基础作用。',
    h1: '阴阳理论基础：平衡、转化与命理判断框架'
  },
  'docs/theory/earthly-branches.md': {
    title: '十二地支详解：五行生肖时辰对照表与藏干刑冲全解',
    seo_title: '十二地支详解：五行生肖时辰对照表与藏干合冲速查全解',
    description: '【十二地支全解速查】一文查清十二地支（子丑寅卯辰巳午未申酉戌亥）核心要素：五行阴阳、生肖时辰对照表、月令节气、地支藏干歌诀及六合、三合、六冲、相刑害破关系总表，附排盘掌诀与命理应用。',
    h1: '十二地支详解：五行生肖时辰对照与藏干刑冲全解'
  },
  'docs/theory/sixty-jiazi.md': {
    title: '六十甲子表全图：六十花甲纳音五行对照表、记忆口诀与干支年份速查',
    seo_title: '六十甲子表全图：六十花甲纳音五行对照表与记忆口诀速查',
    description: '【六十甲子全图速查】系统整理完整六十甲子表（甲子至癸亥）、三十对纳音五行对照表、经典六十花甲子纳音记忆歌诀与空亡速查掌诀，一文弄懂干支纪年周期与八字纳音取象。',
    h1: '六十甲子表全图：六十花甲纳音五行对照与记忆口诀速查'
  },
  'docs/ziwei/stars.md': {
    title: '紫微斗数星曜详解：十四主星、辅星与判断框架',
    seo_title: '紫微斗数星曜详解：十四主星与辅星',
    description: '系统讲解紫微斗数十四主星、辅星与煞曜的基本特征、落宫差异、判断顺序与读盘框架。',
    h1: '紫微斗数星曜详解：十四主星、辅星与判断框架'
  },
  'docs/ziwei/palaces.md': {
    title: '紫微斗数十二宫位：命宫、财帛宫、夫妻宫等读法',
    seo_title: '紫微斗数十二宫位：命宫财帛宫夫妻宫读法',
    description: '系统讲解紫微斗数十二宫位的含义与读法，包括命宫、财帛宫、夫妻宫、官禄宫等核心宫位。',
    h1: '紫微斗数十二宫位：命宫、财帛宫、夫妻宫等读法'
  },
  'docs/ziwei/four-transformations.md': {
    title: '紫微四化飞星速查表：十天干四化口诀、禄权科忌详解与落盘读法',
    seo_title: '紫微四化飞星速查表：十天干四化口诀与禄权科忌落盘读法',
    description: '【紫微四化飞星速查】一文查清十天干四化口诀表（甲廉破武阳至癸破巨阴贪），详析化禄、化权、化科、化忌的核心含义、十二宫落盘吉凶与生年/大限/流年四化飞星动态推演规则。',
    h1: '紫微四化飞星速查表：十天干四化口诀、禄权科忌落盘读法'
  },
  'docs/ziwei/pattern-combinations.md': {
    title: '紫微斗数星曜组合：格局判断与命盘层次分析',
    seo_title: '紫微斗数星曜组合：格局与命盘层次',
    description: '系统讲解紫微斗数星曜组合与格局判断，帮助读者理解命盘层次、会照结构与组合差异。',
    h1: '紫微斗数星曜组合：格局判断与命盘层次分析'
  },
  'docs/ziwei/practical-analysis.md': {
    title: '紫微斗数实战分析：排盘、断盘与案例切入',
    seo_title: '紫微斗数实战分析：排盘与断盘',
    description: '系统讲解紫微斗数实战分析流程，包括排盘步骤、断盘顺序、切入角度与案例应用方法。',
    h1: '紫微斗数实战分析：排盘、断盘与案例切入'
  },
  'docs/ziwei/advanced-techniques.md': {
    title: '紫微斗数高级技法：流日、小限、神煞与特殊命格',
    seo_title: '紫微斗数高级技法：流日、小限与神煞',
    description: '系统介绍紫微斗数高级技法，包括流日、小限、神煞与特殊命格的判断方法和使用边界。',
    h1: '紫微斗数高级技法：流日、小限、神煞与特殊命格'
  },
  'docs/ziwei/wealth-palace-analysis.md': {
    title: '紫微斗数财帛宫专题：财富结构、赚钱模式与资源掌控的专业读法',
    seo_title: '紫微斗数财帛宫：财富结构与赚钱模式',
    description: '系统讲解紫微斗数财帛宫的分析方法，结合主星、三方四正、对宫、四化与辅煞判断财富结构、赚钱模式与资源管理能力。',
    h1: '紫微斗数财帛宫专题'
  },
  'docs/ziwei/travel-palace-analysis.md': {
    title: '紫微斗数迁移宫专题：外部环境、异地发展与公众场域的专业读法',
    seo_title: '紫微斗数迁移宫：外部环境与异地发展',
    description: '系统讲解紫微斗数迁移宫的分析方法，重点分析外部机会、异地发展、公众表现与命盘内外结构的互动关系。',
    h1: '紫微斗数迁移宫专题'
  },
  'docs/ziwei/sanfang-sizheng.md': {
    title: '紫微斗数三方四正与对宫体系：结构化读盘的核心骨架',
    seo_title: '紫微斗数三方四正：结构化读盘核心骨架',
    description: '系统讲解紫微斗数三方四正、对宫、借星与结构协同关系，帮助读者建立专业读盘的主干框架与判断顺序。',
    h1: '紫微斗数三方四正与对宫体系'
  },
  'docs/ziwei/index.md': {
    title: '紫微斗数怎么入门：先看星曜、宫位还是四化？',
    seo_title: '紫微斗数入门全解：十四主星、十二宫位与三方四正读盘法',
    description: '【紫微斗数自学入门】系统梳理紫微斗数读盘看盘顺序：十四主星庙旺特性、十二人事宫位职责、三方四正格局判断与四化飞星引动机制，附排盘要素与高频问答速查。',
    h1: '紫微斗数学习中心：星曜、宫位与命例分析'
  },
  'docs/yijing/divination-methods.md': {
    title: '六爻占卜断卦方法全解：分类用神取用表、旺衰动爻与应期判断顺序',
    seo_title: '六爻占卜方法速查表：分类用神取用与断卦顺序全解',
    description: '【六爻断卦速查全解】系统整理周易六爻占卜方法：分类用神速查表（感情/事业/财运/健康/升学）、日月旺衰生克判定、动爻变爻与伏神飞神规则，附四步断卦法与应期推算速查。',
    h1: '六爻占卜断卦方法全解：分类用神取用表、旺衰动爻与应期判断顺序'
  },
  'docs/yijing/liuyao.md': {
    title: '六爻入门速查全解：起卦记录、六亲装卦、八宫世应与解卦顺序',
    seo_title: '六爻入门速查表：起卦装卦口诀与世应解卦全解',
    description: '【六爻入门全解速查】系统讲解周易六爻起卦记录法（铜钱少阳/少阴/老阳/老阴）、八宫六亲纳甲装卦口诀、天干安六神表与世应定位法，附用神取用与解卦四步实操流程。',
    h1: '六爻入门速查全解：起卦记录、六亲装卦、八宫世应与解卦顺序'
  },
  'docs/yijing/hexagrams.md': {
    title: '易经64卦全图解速查表：六十四卦卦名、卦象、卦辞爻辞与八宫世应',
    seo_title: '易经64卦速查表：六十四卦卦象、卦辞爻辞与八宫归属全解',
    description: '【易经64卦速查全解】完整收录周易六十四卦卦名卦象对照表、八宫归属（本宫/一至五世/游魂/归魂）、卦辞爻辞精解与上下经记忆口诀，支持按上下卦快速检索推演。',
    h1: '易经64卦全图解速查表：六十四卦卦名、卦象、卦辞爻辞与八宫世应'
  }
};

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function normalizeWrappedText(value) {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/^"|"$/g, '');
}

function inferSection(filePath) {
  const parts = filePath.split('/');
  return parts[1] || 'docs';
}

function inferKeywords(filePath, title) {
  const section = inferSection(filePath);
  const base = sectionKeywords[section] || ['天机爻', '命理学习', '传统文化'];
  const titleText = normalizeWrappedText(title);
  const candidates = [
    ...base,
    titleText.includes('八字') ? '八字命理' : '',
    titleText.includes('紫微') ? '紫微斗数' : '',
    titleText.includes('六爻') ? '六爻占卜' : '',
    titleText.includes('周易') ? '周易' : '',
    titleText.includes('AI') ? 'AI命理' : '',
    titleText.includes('学习地图') ? '学习地图' : '',
    titleText.includes('案例') || titleText.includes('命例') ? '案例分析' : '',
    titleText.includes('合盘') ? '合盘分析' : '',
    titleText.includes('婚姻') ? '婚姻分析' : '',
    titleText.includes('健康') ? '健康分析' : '',
    titleText.includes('财富') ? '财富分析' : '',
    titleText.includes('事业') ? '事业分析' : ''
  ];
  return unique(candidates).slice(0, 8);
}

function ensureSentenceEnding(text) {
  if (!text) return text;
  return /[。！？]$/.test(text) ? text : `${text}。`;
}

function trimDescription(text, maxLength = 160) {
  if (text.length <= maxLength) return text;
  const trimmed = text.slice(0, maxLength - 1).replace(/[，、；：\s]+$/u, '');
  return ensureSentenceEnding(trimmed);
}

function normalizeDescriptionLength(description, filePath, title) {
  const section = inferSection(filePath);
  const suffix = descriptionSuffixes[section] || descriptionSuffixes.docs;
  const fallbackTitle = normalizeWrappedText(title) || '天机爻知识内容整理';
  let next = normalizeWrappedText(description || '');

  if (!next) {
    next = `${fallbackTitle}${suffix}`;
  }

  if (next.length < 50) {
    const base = next.replace(/[。！？]$/u, '');
    const cleanSuffix = suffix.replace(/^，/u, '，');
    next = `${base}${cleanSuffix}`;
  }

  next = ensureSentenceEnding(next);

  if (next.length < 50) {
    next = `${next.replace(/[。！？]$/u, '')}，帮助读者快速建立清晰的理解框架。`;
  }

  return trimDescription(next, 160);
}

function replaceFirstHeading(body, nextHeading) {
  if (!nextHeading) return body;
  if (/^# .+$/m.test(body)) {
    return body.replace(/^# .+$/m, `# ${nextHeading}`);
  }
  return body;
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const match = original.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return false;

  const [, rawFrontMatter, rawBody] = match;
  const doc = YAML.parseDocument(rawFrontMatter);
  const body = rawBody;
  const relativePath = filePath.split(path.sep).join('/').replace(`${ROOT}/`, '');
  const override = overrides[relativePath];

  if (doc.has('title')) doc.set('title', normalizeWrappedText(doc.get('title')));
  if (doc.has('description')) doc.set('description', normalizeWrappedText(doc.get('description')));

  if (override) {
    Object.entries(override).forEach(([key, value]) => {
      if (key !== 'h1') doc.set(key, value);
    });
  }

  doc.set(
    'description',
    normalizeDescriptionLength(doc.get('description'), relativePath, doc.get('title'))
  );

  const keywords = doc.get('keywords');
  if (!keywords || (Array.isArray(keywords) && keywords.length === 0)) {
    doc.set('keywords', inferKeywords(relativePath, doc.get('title')));
  }

  const nextBody = replaceFirstHeading(body, override && override.h1);
  const nextFrontMatter = doc.toString().trimEnd();
  const nextContent = `---\n${nextFrontMatter}\n---\n\n${nextBody.replace(/^\n+/, '')}`;

  if (nextContent !== original) {
    fs.writeFileSync(filePath, nextContent, 'utf8');
    return true;
  }

  return false;
}

function main() {
  const files = glob.sync('docs/**/*.md', { cwd: ROOT, nodir: true })
    .filter((file) => !EXCLUDED.has(file));

  let updated = 0;
  files.forEach((relativePath) => {
    const absolutePath = path.join(ROOT, relativePath);
    if (processFile(absolutePath)) {
      updated += 1;
      console.log(`Updated: ${relativePath}`);
    }
  });

  console.log(`SEO normalization complete. Updated ${updated} files.`);
}

main();