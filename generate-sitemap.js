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
const DOCS_SITEMAP_PATH = path.join(DOCS_DIR, 'sitemap.xml');
const ROOT_SITEMAP_PATH = path.join(__dirname, 'sitemap.xml');

// 获取所有markdown文件
const files = glob.sync('**/*.md', {
  cwd: DOCS_DIR,
  ignore: ['**/README.md', '**/SEO_*.md', '_layouts/**']
}).sort();

const pageEntries = files.map(file => {
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

  return {
    file,
    url,
    lastmod,
    changefreq,
    priority,
  };
});

// 生成docs目录下的sitemap条目
const urlEntries = pageEntries.map(entry => {
  return `  <url>
    <loc>${SITE_URL}/${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
}).join('\n');

const latestLastmod = pageEntries.reduce((latest, entry) => {
  return entry.lastmod > latest ? entry.lastmod : latest;
}, '1970-01-01');

// 生成完整的sitemap.xml
const docsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

const rootSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/docs/sitemap.xml</loc>
    <lastmod>${latestLastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

// 写入文件
fs.writeFileSync(DOCS_SITEMAP_PATH, docsSitemap, 'utf-8');
fs.writeFileSync(ROOT_SITEMAP_PATH, rootSitemap, 'utf-8');

console.log('✅ sitemap.xml 生成成功！');
console.log(`📄 包含 ${files.length} 个页面`);
console.log(`📁 docs sitemap: ${DOCS_SITEMAP_PATH}`);
console.log(`📁 root sitemap: ${ROOT_SITEMAP_PATH}`);
console.log('\n💡 下一步：');
console.log('   1. 提交到Git');
console.log('   2. 推送到GitHub');
console.log('   3. 在Google Search Console提交sitemap');
