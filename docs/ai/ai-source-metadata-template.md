---
layout: default
title: AI知识源元数据模板：文档入库前至少应补哪些字段
description: 提供一套可复用的 AI 知识源元数据模板，涵盖来源层级、体系归属、风险标签、场景标签与适用范围，便于知识库稳定入库与检索。
keywords: [ 元数据模板, 知识源模板, AI知识库, 文档入库, RAG元数据, AI工程 ]
author: AI玄学研究团队
date: 2026-03-22
---

# AI知识源元数据模板

AI 命理知识库最容易出问题的，不是文档没有进库，而是文档进库时没有足够元数据。没有元数据，系统就很难知道这篇文档属于规则层还是案例层、适合回答什么问题、在高风险场景里该不该优先召回。

这页提供一套可复用的知识源元数据模板，目标是让“文档入库”从简单收录变成受控治理。

## 一、元数据模板为什么重要

因为元数据决定三件事：

1. 这篇文档属于哪一层
2. 这篇文档更适合被什么问题召回
3. 这篇文档在什么场景下应被降权或升权

## 二、建议至少保留的核心字段

建议至少保留以下字段：

1. 文档标题
2. 来源类型
3. 分层级别
4. 体系归属
5. 场景标签
6. 风险标签
7. 适用任务
8. 是否适合高风险场景

## 三、模板字段示例

### 基础识别字段

1. `title`: 文档标题
2. `source_id`: 唯一标识
3. `source_path`: 文档路径或来源位置

### 分层字段

1. `layer`: 原典层 / 解释层 / 规则层 / 案例层 / 边界层
2. `source_type`: 古籍 / 现代整理 / 规则文档 / 案例文档 / 风险文档

### 任务字段

1. `system_family`: 八字 / 紫微 / 六爻 / 跨体系 / AI工程
2. `task_type`: 规则计算 / 术语解释 / 结构分析 / 问答支持 / 高风险边界
3. `topic_tags`: 婚姻 / 财富 / 健康 / 事业 / 应期 / 伦理 / 评估

### 风险字段

1. `risk_level`: 低 / 中 / 高
2. `needs_human_review`: true / false
3. `high_risk_allowed`: true / false

## 四、一个简化模板示例

```yaml
title: AI命理效果评估：准确性、数据集与验证框架
source_id: ai-evaluation-001
source_path: docs/ai/ai-mingli-evaluation.md
layer: 边界层
source_type: 风险文档
system_family: AI工程
task_type: 高风险边界
topic_tags: [评估, 风险控制, 高风险场景]
risk_level: 中
needs_human_review: true
high_risk_allowed: false
```

## 五、元数据最常见的缺口

1. 只记录标题和路径，不记录层级
2. 不区分规则文档和案例文档
3. 没有风险字段，导致高风险问题也会误召普通文档

## 六、怎么把模板真正用起来

1. 文档入库前先补齐字段
2. 检索排序时优先读取层级和风险字段
3. 高风险问题单独检查 `high_risk_allowed` 和 `needs_human_review`
4. 新增文档时先做元数据审核，再进入主索引

## 七、推荐联读

1. [AI知识源分层规范：古籍、规则、案例与站内文档如何分级](ai-source-layering-spec.md)
2. [AI知识源污染案例：分层失效后系统为什么会越答越乱](ai-source-contamination-cases.md)
3. [AI命理知识库工作流：从古籍整理到可检索问答](ai-knowledge-base-workflow.md)
4. [AI知识库召回失误案例：检索看似命中却仍然答偏的原因](ai-retrieval-failure-cases.md)
