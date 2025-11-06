# 🔧 缺失文档补完指南

## 📊 当前状态

### ✅ 已完成的文档（27个）

**八字命理模块** (8个) ✅
- introduction.md
- ten-gods.md
- ten-gods-enhanced.md
- index.md
- five-elements.md
- four-pillars.md
- luck-cycles.md
- pattern-analysis.md

**紫微斗数模块** (6/7个)
- index.md
- stars.md
- palaces.md
- four-transformations.md
- pattern-combinations.md
- advanced-techniques.md
- ❌ practical-analysis.md (缺失)

**AI玄学模块** (5/6个)
- ai-introduction.md
- llm-traditional-prediction.md
- machine-learning-bazi.md
- nlp-analysis.md
- future-trends.md
- ❌ knowledge-graph.md (缺失)

**实践应用模块** (4个) ✅
- case-studies.md
- self-learning.md
- common-mistakes.md
- tools-resources.md

**基础理论模块** (3/4个)
- yinyang.md
- earthly-branches.md
- sixty-jiazi.md
- ❌ heavenly-stems.md (缺失)

**其他** (1个) ✅
- index.md

---

## ⚠️ 需要创建的文档（3个）

### 1. 紫微斗数实战分析
```bash
node create-single-doc.js ziwei
```
**文件**: `docs/ziwei/practical-analysis.md`  
**说明**: 紫微斗数的完整分析流程和实战案例

### 2. 命理知识图谱
```bash
node create-single-doc.js ai
```
**文件**: `docs/ai/knowledge-graph.md`  
**说明**: 命理知识图谱的构建方法和技术架构

### 3. 天干详解
```bash
node create-single-doc.js theory
```
**文件**: `docs/theory/heavenly-stems.md`  
**说明**: 十天干的系统理论和应用

---

## 🚀 执行方法

### 方式一：逐个创建（推荐）
更稳定，可以及时处理错误：

```bash
# 1. 创建紫微实战分析
node create-single-doc.js ziwei

# 2. 创建知识图谱
node create-single-doc.js ai

# 3. 创建天干详解
node create-single-doc.js theory
```

### 方式二：批量重试
如果网络稳定，可以使用批量脚本：

```bash
node retry-failed-docs.js
```

---

## ⚡ 特点

- ✅ **超时重试**: 自动重试3次，间隔递增
- ✅ **长超时**: 4分钟超时时间
- ✅ **错误处理**: 完善的错误提示
- ✅ **进度显示**: 清晰的执行状态

---

## 💡 如果遇到问题

### 问题1: API超时
**解决**: 脚本会自动重试，等待完成即可

### 问题2: 网络中断
**解决**: 重新运行相同的命令即可

### 问题3: API配额不足
**解决**: 检查DeepSeek账户余额

---

## 📈 完成后

创建完3个文档后，运行分析检查：

```bash
npm run analyze
```

预期结果：
- 📄 文档总数: 30个
- 🔗 断链: 0个
- ✅ SEO优化: 完整
- 🎯 知识体系: 完整

---

## 🎯 下一步

1. **完成3个缺失文档**
2. **运行质量分析**
3. **人工审阅所有新文档**
4. **优化内部链接**
5. **更新首页导航**
6. **提交到Git仓库**
7. **发布到GitHub Pages**

---

**现在就开始创建缺失的文档吧！** 🚀

```bash
node create-single-doc.js ziwei
```
