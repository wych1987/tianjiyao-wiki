#!/usr/bin/env node

/**
 * 全站 SEO CTR 健康度与通用模版规范审计工具
 * 用于排查全站页面是否存在"高曝光低点击"的典型通病：
 * 1. 缺少 seo_title 或标题过于学术化（劝退用户）
 * 2. 缺少 FAQPage 结构化问答（错失 Google SERP 展开卡片）
 * 3. 首屏无结构化速查表格（错失 Position 0 精选摘要）
 * 4. Description 过于假大空（无点击勾子）
 * 5. 是否残留内部运营用语（合规检查）
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const yaml = require('yaml');

const ROOT = process.cwd();

const ACADEMIC_WORDS = ['理论研究', '完整理论', '的奥秘', '体系研究', '哲学基础', '源流考'];
const FORBIDDEN_WORDS = ['承接', '分层', '页面职责', '搜索意图', '主词', '导流', '流量承接', '覆盖意图'];

// GSC 重点监控页面（高曝光清单）
const PRIORITY_DOCS = [
  'docs/theory/earthly-branches.md',
  'docs/theory/sixty-jiazi.md',
  'docs/bazi/luck-cycles.md',
  'docs/bazi/pattern-analysis.md',
  'docs/bazi/four-pillars.md',
  'docs/ziwei/index.md',
  'docs/ziwei/four-transformations.md',
  'docs/yijing/divination-methods.md',
  'docs/yijing/liuyao.md',
  'docs/yijing/hexagrams.md'
];

function auditDoc(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(ROOT, filePath).split(path.sep).join('/');
  
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return null;

  const [, rawFrontMatter, body] = match;
  let data = {};
  try {
    data = yaml.parse(rawFrontMatter) || {};
  } catch (e) {
    return { relativePath, error: 'YAML parse error' };
  }

  const title = data.title || '';
  const seoTitle = data.seo_title || '';
  const desc = data.description || '';
  const faqs = Array.isArray(data.faqs) ? data.faqs : [];
  
  // 检查标题是否包含学术泛化词
  const titleHasAcademic = ACADEMIC_WORDS.some(w => title.includes(w) || seoTitle.includes(w));
  
  // 检查首屏（前 120 行）是否有 Markdown 表格
  const first120Lines = body.split('\n').slice(0, 120).join('\n');
  const hasTopTable = /\|.+\|.+\|/.test(first120Lines);

  // 检查 Description 是否有 Hook
  const descHasHook = desc.startsWith('【') || desc.includes('速查') || desc.includes('对照表') || desc.includes('口诀');

  // 检查违规用语
  const forbiddenFound = FORBIDDEN_WORDS.filter(w => content.includes(w));

  // 计算 CTR 优化评分 (0 - 100)
  let score = 100;
  const issues = [];

  if (!seoTitle) {
    score -= 25;
    issues.push('缺少专属 seo_title');
  }
  if (titleHasAcademic) {
    score -= 20;
    issues.push('标题含学术劝退词（如理论研究/奥秘）');
  }
  if (faqs.length === 0) {
    score -= 25;
    issues.push('未配置 FAQPage 结构化问答');
  }
  if (!hasTopTable) {
    score -= 15;
    issues.push('首屏前120行缺少速查大表（错失 Position 0）');
  }
  if (!descHasHook) {
    score -= 15;
    issues.push('Description 缺少点击 Hook（偏陈旧叙述）');
  }
  if (forbiddenFound.length > 0) {
    issues.push(`含内部辞令: ${forbiddenFound.join(',')}`);
  }

  return {
    relativePath,
    title,
    seoTitle,
    score: Math.max(0, score),
    issues,
    hasFaqs: faqs.length > 0,
    hasTopTable,
    isPriority: PRIORITY_DOCS.includes(relativePath)
  };
}

function run() {
  const files = glob.sync('docs/**/*.md', { cwd: ROOT, nodir: true })
    .filter(f => !f.includes('README') && !f.includes('SEO_'));

  const results = files.map(f => auditDoc(path.join(ROOT, f))).filter(Boolean);

  console.log('====================================================');
  console.log('   📊 天机爻 Wiki 全站高曝光高 CTR 通用规范审计报告');
  console.log('====================================================\n');

  // 先看重点监控页面
  console.log('🔥 【GSC 重点高曝光页面健康度】');
  const priorityResults = results.filter(r => r.isPriority);
  priorityResults.forEach(r => {
    const statusIcon = r.score >= 85 ? '✅ 优秀' : r.score >= 60 ? '⚠️ 中等' : '❌ 极差 (0点击高危)';
    console.log(`[${statusIcon}] ${r.score}分 | ${r.relativePath}`);
    if (r.issues.length > 0) {
      console.log(`   ↳ 待优化: ${r.issues.join(' | ')}`);
    }
  });

  console.log('\n----------------------------------------------------');
  const total = results.length;
  const noFaqs = results.filter(r => !r.hasFaqs).length;
  const noTable = results.filter(r => !r.hasTopTable).length;
  const noSeoTitle = results.filter(r => !r.seoTitle).length;
  const avgScore = Math.round(results.reduce((s, r) => s + r.score, 0) / total);

  console.log(`全站文档总计: ${total} 篇 | 全站平均 CTR 评分: ${avgScore} 分`);
  console.log(`  - 缺失 FAQ 结构化数据: ${noFaqs} 篇 (${Math.round(noFaqs/total*100)}%)`);
  console.log(`  - 缺失首屏速查大表: ${noTable} 篇 (${Math.round(noTable/total*100)}%)`);
  console.log(`  - 缺失专属 seo_title: ${noSeoTitle} 篇 (${Math.round(noSeoTitle/total*100)}%)`);
  console.log('====================================================\n');
}

run();
