# 🚀 天机爻Wiki专业文档系统 - Node.js版

## ✨ 快速开始

### 1. 环境检查
您的环境已准备就绪：
- ✅ Node.js v22.14.0
- ✅ npm v10.9.2
- ✅ 依赖包已安装

### 2. 设置API密钥

```bash
# 设置DeepSeek API密钥
export DEEPSEEK_API_KEY="your_deepseek_api_key_here"
```

### 3. 基本使用

#### 📊 分析现有文档
```bash
npm run analyze
# 或
node analyze-docs.js
```

#### 🧪 测试API连接
```bash
npm run test
# 或
DEEPSEEK_API_KEY="your_key" node test-enhance.js
```

#### 📝 交互式创建新文档
```bash
DEEPSEEK_API_KEY="your_key" node create-doc.js
```

#### 🔧 增强现有文档
```bash
# 查看帮助
node enhance-docs.js --help

# 增强所有文档
node enhance-docs.js enhance -k $DEEPSEEK_API_KEY

# 创建新文档
node enhance-docs.js create \
  -k $DEEPSEEK_API_KEY \
  -t "五行生克详解" \
  --type "八字命理" \
  -o "docs/bazi/wuxing-detail.md"
```

## 📋 当前文档状态

根据刚才的分析报告：

### ✅ 优势
- 文档结构清晰，7个核心文档
- 内部链接丰富，19个内部链接
- 无断链问题

### ⚠️ 需要改进
- 3个文档缺少YAML front matter
- SEO元数据需要优化
- 2个孤立文档需要建立链接

## 🎯 建议的优化步骤

### 第一步：修复现有文档
```bash
# 先测试API
DEEPSEEK_API_KEY="your_key" node test-enhance.js

# 然后增强现有文档
node enhance-docs.js enhance -k $DEEPSEEK_API_KEY
```

### 第二步：创建缺失内容
推荐创建以下文档：
- 五行理论详解
- 大运流年分析
- 紫微宫位详解  
- AI算法原理

```bash
# 交互式创建
DEEPSEEK_API_KEY="your_key" node create-doc.js
```

### 第三步：建立链接关系
- 在主要文档中添加指向索引页的链接
- 完善面包屑导航
- 建立相关文章推荐

## 🎨 特色功能

### 智能提示词系统
- 针对八字、紫微、AI玄学的专业提示词
- 自动引用权威典籍和学术机构
- 支持维基百科、百度百科等可信来源

### 质量控制系统
- 自动备份原文件
- SEO元数据优化
- 内容结构标准化

### 分析报告系统
- 文档质量评估
- SEO优化建议
- 结构关系分析

## 📞 如需帮助

1. **查看详细帮助**：`node enhance-docs.js --help`
2. **运行测试**：`npm run test`
3. **分析文档**：`npm run analyze`

## 🎉 开始使用

现在您可以：

1. **设置API密钥**：`export DEEPSEEK_API_KEY="your_key"`
2. **测试功能**：`npm run test`
3. **开始增强文档**：`node enhance-docs.js enhance -k $DEEPSEEK_API_KEY`

---

*专业、权威、有深度的Wiki内容，从这里开始！*