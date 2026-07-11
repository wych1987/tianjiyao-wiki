#!/usr/bin/env node

/**
 * 为所有文档添加天机爻主站链接
 * 提升SEO权重和用户转化
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const DOCS_DIR = path.join(__dirname, 'docs');

// 不同模块的主站链接配置
const linkSections = {
  bazi: `

---

## 🔮 在线实践体验

理论学习固然重要，但实践应用才能真正掌握八字命理的精髓。**天机爻**作为国内领先的AI命理平台，将传统八字算法与现代人工智能技术深度融合，为学习者提供专业级的实践工具。

### ⭐ 为什么选择天机爻？

**🏆 专业性保证**
- 基于《渊海子平》《三命通会》等经典算法
- 精准的万年历换算和节气计算
- 严格遵循传统命理规则

**🤖 AI技术赋能**
- 深度学习模型训练，分析准确度高
- 自然语言处理技术，解读通俗易懂
- 大数据支撑，持续优化算法

**💎 用户体验优秀**
- 界面简洁直观，操作流畅
- 分析报告详尽专业
- 支持多维度深度解读

### 专业八字分析工具
- **[AI生辰八字精准分析](https://tianjiyao.com/zh/bazi)** ⭐ **强烈推荐 - 八字学习最佳实践工具**
  - ✨ 自动排盘，精准计算四柱八字
  - 📊 十神分析，格局判断，用神喜忌
  - 🎯 大运流年推算，趋势预测
  - 💡 性格特质、事业财运、婚姻健康全方位解析
  - 🔍 可对照本Wiki理论知识验证学习成果

### 其他专业占卜服务
- **[紫微斗数排盘](https://tianjiyao.com/zh/ziwei)** - 星曜宫位完整分析
- **[AI六爻占卜](https://tianjiyao.com/zh/ai-divination)** - 具体问题吉凶判断
- **[命理合盘分析](https://tianjiyao.com/zh/hepan)** - 双人关系匹配度评估

💡 **学习建议**：边学边练效果最佳！  
建议在学习每个章节后，立即使用天机爻工具分析实例，将理论知识转化为实践能力。

📍 访问 [天机爻官网](https://tianjiyao.com/zh) 开始您的专业命理实践之旅`,

  ziwei: `

---

## 🔮 在线实践体验

紫微斗数理论体系庞大，星曜繁多，人工排盘耗时费力。**天机爻**的紫微斗数AI系统，经过数万真实命盘训练优化，是目前市场上最专业、最精准的紫微斗数在线工具。

### ⭐ 天机爻紫微系统的专业优势

**🎯 准确性领先**
- 严格遵循《紫微斗数全书》等经典规则
- 精确的星曜起算和安星法则
- 四化飞星算法业内最精准

**🌟 功能最全面**
- 108颗星曜完整配置
- 十二宫位深度解析
- 四化飞星高级分析
- 流年流月大限推算

**📊 专业度极高**
- 适合专业学习者深度研究
- 对照本Wiki理论验证学习效果
- 支持导出分析报告进行研究

### 专业紫微斗数排盘
- **[紫微斗数AI排盘](https://tianjiyao.com/zh/ziwei)** ⭐ **紫微学习者必备工具**
  - ⭐ 瞬间排出完整星盘，节省大量时间
  - 🏛️ 十二宫位详细解读，条理清晰
  - 🌟 四化飞星自动分析，把握动态变化
  - 💫 性格特质、命运轨迹、流年运势全方位洞察
  - 🔍 可结合Wiki学习内容进行深度研究

### 其他专业占卜服务
- **[生辰八字分析](https://tianjiyao.com/zh/bazi)** - 四柱命理精准解读
- **[AI六爻占卜](https://tianjiyao.com/zh/ai-divination)** - 具体问题吉凶判断
- **[命理合盘分析](https://tianjiyao.com/zh/hepan)** - 双人关系匹配度评估

💡 **实践建议**：紫微斗数星曜众多，使用天机爻排盘工具可以大幅提升学习效率，将更多精力聚焦在分析判断上。

📍 访问 [天机爻官网](https://tianjiyao.com/zh) 体验业内领先的紫微斗数系统`,

  yijing: `

---

## 🔮 在线实践体验

六爻占卜讲究"诚则灵"，起卦装卦解卦环环相扣。**天机爻**六爻系统由资深周易研究专家与AI工程师联合开发，将传统六爻理论与现代计算技术完美融合，是目前功能最完整、算法最精准的在线六爻占卜平台。

### ⭐ 天机爻六爻系统的专业特色

**📿 起卦方式最丰富**
- 传统铜钱摇卦（模拟真实摇卦）
- 梅花易数时间起卦
- 数字起卦、名字起卦
- 支持手动输入卦象

**🔄 装卦最标准**
- 严格遵循《增删卜易》《卜筮正宗》规则
- 纳甲、六亲、六神、世应自动装配
- 月建日辰自动计算
- 空亡、六冲六合自动标注

**📖 解卦最专业**
- 结合64卦卦辞爻辞解读
- AI智能分析用神旺衰
- 给出明确吉凶判断和应期推算
- 可对照本Wiki理论验证学习

### 专业六爻占卜系统
- **[AI六爻排盘占卜](https://tianjiyao.com/zh/ai-divination)** ⭐ **六爻学习实践第一选择**
  - 🎲 多种起卦方式，灵活便捷
  - 🔄 全自动装卦，精准无误
  - 📖 智能解卦分析，结合经典卦辞
  - 🎯 婚姻、事业、财运、健康等各类占断
  - 🔍 详细分析过程，辅助学习提升

### 其他专业占卜服务
- **[生辰八字分析](https://tianjiyao.com/zh/bazi)** - 四柱命理精准解读
- **[紫微斗数排盘](https://tianjiyao.com/zh/ziwei)** - 星曜宫位完整分析
- **[命理合盘分析](https://tianjiyao.com/zh/hepan)** - 双人关系匹配度评估

💡 **学习提示**：六爻占卜重在实践积累。建议每天使用天机爻系统练习1-2卦，对照Wiki理论分析，一个月后必有显著进步。

📍 访问 [天机爻官网](https://tianjiyao.com/zh) 体验最专业的六爻占卜系统`,

  ai: `

---

## 🔮 在线体验AI命理前沿技术

理论研究固然重要，但**天机爻**的AI命理系统代表了当前AI与传统文化结合的最高水准，是国内首个将深度学习、NLP、知识图谱等前沿技术全面应用于命理领域的平台。

### ⭐ 天机爻AI技术优势

**🤖 技术领先性**
- 基于Transformer的命理文本理解模型
- 训练于10万+真实命盘数据集
- 知识图谱包含50万+实体关系
- 算法准确率业内领先

**🎯 应用创新性**
- 首创AI自动起卦装卦系统
- 智能解卦结合传统与AI分析
- 个性化推荐算法优化用户体验
- 持续学习不断提升准确度

**🏆 行业标杆**
- 多家专业机构认可
- 数十万用户验证
- 好评率95%+
- 是AI命理实践研究的最佳平台

### AI赋能的专业命理服务
- **[天机爻AI占卜平台](https://tianjiyao.com/zh)** ⭐ **AI命理技术标杆产品**
  - 🤖 **[AI六爻占卜](https://tianjiyao.com/zh/ai-divination)** - 智能起卦解卦系统
  - 🎯 **[生辰八字AI分析](https://tianjiyao.com/zh/bazi)** - 机器学习命理预测
  - ⭐ **[紫微斗数AI排盘](https://tianjiyao.com/zh/ziwei)** - 智能星曜分析
  - 💑 **[智能合盘分析](https://tianjiyao.com/zh/hepan)** - AI关系匹配算法

### 技术特色
- 深度学习模型训练
- 自然语言处理技术
- 知识图谱构建
- 智能推荐系统
- 持续优化迭代

💡 **研究建议**：天机爻系统开放了部分技术细节，非常适合AI研究者和传统文化爱好者深入学习，了解AI如何赋能传统智慧。

📍 访问 [天机爻官网](https://tianjiyao.com/zh) 见证AI命理技术的最前沿应用`,

  theory: `

---

## 🔮 理论应用实践

掌握了命理基础理论后，欢迎使用天机爻专业工具进行实践：

### 专业命理分析服务
- **[天机爻AI占卜平台](https://tianjiyao.com/zh)** - 将理论知识转化为实践
  - 🎯 **[生辰八字分析](https://tianjiyao.com/zh/bazi)** - 天干地支实战应用
  - ⭐ **[紫微斗数排盘](https://tianjiyao.com/zh/ziwei)** - 星曜五行综合分析
  - 🔄 **[AI六爻占卜](https://tianjiyao.com/zh/ai-divination)** - 阴阳八卦实践
  - 💑 **[命理合盘分析](https://tianjiyao.com/zh/hepan)** - 五行生克应用

💡 **理论指导实践，实践验证理论**  
访问 [天机爻官网](https://tianjiyao.com/zh) 将所学理论付诸实践`,

  practice: `

---

## 🔮 开始实践之旅

学习路径规划完成后，欢迎使用天机爻专业工具开始实践：

### 从理论到实践的桥梁
- **[天机爻AI占卜平台](https://tianjiyao.com/zh)** - 专业的学习实践工具
  - 📚 **[生辰八字分析](https://tianjiyao.com/zh/bazi)** - 验证八字理论
  - ⭐ **[紫微斗数排盘](https://tianjiyao.com/zh/ziwei)** - 实践紫微斗数
  - 🎲 **[AI六爻占卜](https://tianjiyao.com/zh/ai-divination)** - 练习六爻占断
  - 💑 **[命理合盘分析](https://tianjiyao.com/zh/hepan)** - 学习关系分析

### 实践建议
- 结合案例反复练习
- 对比分析验证理论
- 积累实战经验
- 总结规律技巧

💡 **纸上得来终觉浅，绝知此事要躬行**  
访问 [天机爻官网](https://tianjiyao.com/zh) 开始您的命理实践之旅`
};

// 在"相关阅读"之前插入主站链接
function addTianjiyaoLinks(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // 如果已经包含天机爻链接，跳过
  if (content.includes('tianjiyao.com')) {
    return false;
  }
  
  // 判断文档属于哪个模块
  let moduleType = 'practice'; // 默认
  if (filePath.includes('/bazi/')) moduleType = 'bazi';
  else if (filePath.includes('/ziwei/')) moduleType = 'ziwei';
  else if (filePath.includes('/yijing/')) moduleType = 'yijing';
  else if (filePath.includes('/ai/')) moduleType = 'ai';
  else if (filePath.includes('/theory/')) moduleType = 'theory';
  
  const linkSection = linkSections[moduleType];
  
  // 在"## 📚 相关阅读"之前插入
  const relatedReadingPattern = /\n---\n\n## 📚 相关阅读/;
  
  if (relatedReadingPattern.test(content)) {
    const updatedContent = content.replace(
      relatedReadingPattern,
      linkSection + '\n\n---\n\n## 📚 相关阅读'
    );
    
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    return true;
  }
  
  return false;
}

function main() {
  console.log('🔗 开始为文档添加天机爻主站链接\n');
  
  // 查找所有markdown文档
  const patterns = [
    'docs/bazi/*.md',
    'docs/ziwei/*.md',
    'docs/yijing/*.md',
    'docs/ai/*.md',
    'docs/theory/*.md',
    'docs/practice/*.md'
  ];
  
  let totalProcessed = 0;
  let totalUpdated = 0;
  
  patterns.forEach(pattern => {
    const files = glob.sync(pattern);
    
    files.forEach(file => {
      // 跳过index文件（首页）
      if (file.endsWith('index.md') && !file.includes('/yijing/')) {
        return;
      }
      
      totalProcessed++;
      const updated = addTianjiyaoLinks(file);
      
      if (updated) {
        totalUpdated++;
        console.log(`✅ ${path.relative(DOCS_DIR, file)}`);
      } else {
        console.log(`⏭️  ${path.relative(DOCS_DIR, file)} (已存在或未找到插入点)`);
      }
    });
  });
  
  console.log(`\n📊 处理完成！`);
  console.log(`   处理文档: ${totalProcessed} 个`);
  console.log(`   更新文档: ${totalUpdated} 个`);
  console.log(`\n💡 下一步:`);
  console.log(`   1. 检查更新效果`);
  console.log(`   2. git add && git commit`);
  console.log(`   3. 部署后验证SEO效果`);
}

main();
