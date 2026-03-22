#!/usr/bin/env node

/**
 * 生成sitemap.xml
 * 用于搜索引擎优化
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const SITE_URL = 'https://wiki.tianjiyao.com';
const DOCS_DIR = path.join(__dirname, 'docs');

// 获取所有markdown文件
const files = glob.sync('**/*.md', {
  cwd: DOCS_DIR,
  ignore: ['**/README.md', '**/SEO_*.md', '_layouts/**']
}).sort();

// 生成sitemap条目
const urlEntries = files.map(file => {
  const htmlPath = file.replace(/\.md$/, '.html');
  const url = htmlPath === 'index.html'
    ? ''
    : htmlPath.replace(/\/index\.html$/, '/');
  const filePath = path.join(DOCS_DIR, file);
  const stats = fs.statSync(filePath);
  const lastmod = stats.mtime.toISOString().split('T')[0];
  
  // 根据文件路径判断优先级
  let priority = '0.5';
  let changefreq = 'monthly';
  
  if (file === 'index.md') {
    priority = '1.0';
    changefreq = 'weekly';
  } else if (file.includes('/index.md')) {
    priority = '0.8';
    changefreq = 'weekly';
  } else if (file.startsWith('practice/')) {
    priority = '0.8';
    changefreq = 'weekly';
  } else if (file.startsWith('theory/')) {
    priority = '0.7';
    changefreq = 'monthly';
  } else if (file.startsWith('yijing/')) {
    priority = '0.7';
    changefreq = 'monthly';
  } else if (file.startsWith('ai/')) {
    priority = '0.6';
    changefreq = 'monthly';
  } else if (file.startsWith('bazi/') || file.startsWith('ziwei/')) {
    priority = '0.7';
    changefreq = 'monthly';
  }
  
  return `  <url>
    <loc>${SITE_URL}/${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join('\n');

// 生成完整的sitemap.xml
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

// 写入文件
const outputPath = path.join(DOCS_DIR, 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap, 'utf-8');

console.log('✅ sitemap.xml 生成成功！');
console.log(`📄 包含 ${files.length} 个页面`);
console.log(`📁 位置: ${outputPath}`);
console.log('\n💡 下一步：');
console.log('   1. 提交到Git');
console.log('   2. 推送到GitHub');
console.log('   3. 在Google Search Console提交sitemap');
