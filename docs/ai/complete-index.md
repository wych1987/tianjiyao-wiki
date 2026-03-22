---
layout: default
title: AI模块完整索引：从机器学习到评估、伦理与协作流程
description: 汇总天机爻 Wiki AI 模块中的概论页、技术方法页、知识库工作流、效果评估、伦理边界与协作流程，建立一张可直接使用的 AI 模块完整索引。
keywords: [ AI模块索引, AI命理, 知识图谱, LLM, 评估框架, AI伦理 ]
author: AI玄学研究团队
date: 2026-03-22
---

# AI模块完整索引

如果你进入 AI 模块后，已经感觉页面不算少，但又不确定该先看总论、先看技术方法，还是先看评估与伦理，那么最省时间的方式不是逐页扫，而是先用这张完整索引把路线整理清楚。

这页把 AI 模块现有内容按“整体理解 → 技术方法 → 系统落地 → 评估与边界 → 回接主模块”的方式重新组织，目标是让你知道每一页在模块里承担什么角色，而不是只把它们当作平铺条目。

## 一、先看哪一类内容

可以先按你的目标进入：

1. 想先知道 AI 命理到底在做什么，看概论页
2. 想看技术方法，看机器学习、NLP、知识图谱和 LLM 页
3. 想知道怎么真正做成系统，看知识库工作流页
4. 想知道是否可靠、边界在哪，看评估和伦理页
5. 想知道真实产品里人和模型怎么分工，看协作流程页

## 二、整体理解页

适合第一次系统进入 AI 模块的人。

1. [AI与传统玄学概论](ai-introduction.md)
2. [大语言模型在传统预测中的应用：提示、推理与风险](llm-traditional-prediction.md)
3. [未来发展趋势](future-trends.md)

## 三、技术方法页

适合已经知道 AI 模块不是“概念展示”，想进一步看技术路径的人。

1. [机器学习与八字](machine-learning-bazi.md)
2. [NLP文本分析](nlp-analysis.md)
3. [命理知识图谱：本体建模、关系抽取与知识推理](knowledge-graph.md)

## 四、系统落地页

这部分最适合已经从“技术概念”走到“怎么做成系统”的读者。

1. [AI命理知识库工作流：从古籍整理到可检索问答](ai-knowledge-base-workflow.md)

## 五、系统设计页

这部分更偏工程视角，适合已经开始考虑如何把 AI 模块做成稳定系统的人。

1. [AI评测集设计：命理问答、规则题与高风险边界如何构造](ai-evaluation-dataset-design.md)
2. [AI知识源分层规范：古籍、规则、案例与站内文档如何分级](ai-source-layering-spec.md)
3. [AI提示词边界设计：怎样让模型更克制、更稳地回答](ai-prompt-boundary-design.md)

## 六、工程模板页

这部分适合已经开始实际搭系统、写评测、做入库和拆 prompt 的人，目标是提供可复用模板而不是原则说明。

1. [AI评测Rubric模板：怎样为命理问答与高风险场景统一打分](ai-evaluation-rubric-template.md)
2. [AI知识源元数据模板：文档入库前至少应补哪些字段](ai-source-metadata-template.md)
3. [AI提示词模板规范：规则题、解释题与高风险题怎样分模板](ai-prompt-template-spec.md)

## 七、评估与边界页

AI 模块真正有价值的地方，不只是能做出系统，而是能不能解释它是否可靠、边界在哪、风险怎么控。

1. [AI命理效果评估：准确性、数据集与验证框架](ai-mingli-evaluation.md)
2. [AI命理伦理与边界：风险、责任与理性使用](ai-mingli-ethics.md)
3. [AI命理协作流程：人工判断与模型辅助如何分工](ai-human-collaboration.md)

## 八、反例训练页

如果你已经看过方法页、工作流页和边界页，下一步最有价值的不是继续看抽象原则，而是训练系统最容易在哪些地方出错。

1. [AI命理问答误判案例：回答流畅却判断失真的常见问题](ai-qa-misjudgment-cases.md)
2. [AI知识库召回失误案例：检索看似命中却仍然答偏的原因](ai-retrieval-failure-cases.md)
3. [AI过度自信案例：什么时候模型最容易把不确定说成确定](ai-overconfidence-cases.md)

## 九、工程失败案例页

如果你已经看过系统设计页，下一步最值得看的不是重复原则，而是这些原则为什么在真实系统里经常落不住。

1. [AI评测集失败案例：分数看起来不错却不能真实反映系统能力](ai-evaluation-dataset-failure-cases.md)
2. [AI知识源污染案例：分层失效后系统为什么会越答越乱](ai-source-contamination-cases.md)
3. [AI提示词边界失败案例：约束写了却仍然压不住模型的原因](ai-prompt-boundary-failure-cases.md)

## 十、按阅读目标进入

### 1. 想先建立整体认知

建议顺序：

1. [AI与传统玄学概论](ai-introduction.md)
2. [大语言模型在传统预测中的应用：提示、推理与风险](llm-traditional-prediction.md)
3. [AI命理知识库工作流：从古籍整理到可检索问答](ai-knowledge-base-workflow.md)
4. [AI评测集设计：命理问答、规则题与高风险边界如何构造](ai-evaluation-dataset-design.md)
5. [AI知识源分层规范：古籍、规则、案例与站内文档如何分级](ai-source-layering-spec.md)
6. [AI提示词边界设计：怎样让模型更克制、更稳地回答](ai-prompt-boundary-design.md)
7. [AI命理效果评估：准确性、数据集与验证框架](ai-mingli-evaluation.md)
8. [AI命理伦理与边界：风险、责任与理性使用](ai-mingli-ethics.md)
9. [AI命理协作流程：人工判断与模型辅助如何分工](ai-human-collaboration.md)
10. [AI命理问答误判案例：回答流畅却判断失真的常见问题](ai-qa-misjudgment-cases.md)

### 2. 想先看偏技术的方法

建议顺序：

1. [机器学习与八字](machine-learning-bazi.md)
2. [NLP文本分析](nlp-analysis.md)
3. [命理知识图谱：本体建模、关系抽取与知识推理](knowledge-graph.md)
4. [AI命理知识库工作流：从古籍整理到可检索问答](ai-knowledge-base-workflow.md)
5. [AI知识源分层规范：古籍、规则、案例与站内文档如何分级](ai-source-layering-spec.md)

### 3. 想先看系统设计与工程控制

建议顺序：

1. [AI评测集设计：命理问答、规则题与高风险边界如何构造](ai-evaluation-dataset-design.md)
2. [AI知识源分层规范：古籍、规则、案例与站内文档如何分级](ai-source-layering-spec.md)
3. [AI提示词边界设计：怎样让模型更克制、更稳地回答](ai-prompt-boundary-design.md)
4. [AI评测Rubric模板：怎样为命理问答与高风险场景统一打分](ai-evaluation-rubric-template.md)
5. [AI知识源元数据模板：文档入库前至少应补哪些字段](ai-source-metadata-template.md)
6. [AI提示词模板规范：规则题、解释题与高风险题怎样分模板](ai-prompt-template-spec.md)
7. [AI命理知识库工作流：从古籍整理到可检索问答](ai-knowledge-base-workflow.md)
8. [AI评测集失败案例：分数看起来不错却不能真实反映系统能力](ai-evaluation-dataset-failure-cases.md)
9. [AI知识源污染案例：分层失效后系统为什么会越答越乱](ai-source-contamination-cases.md)
10. [AI提示词边界失败案例：约束写了却仍然压不住模型的原因](ai-prompt-boundary-failure-cases.md)

### 4. 想先看可靠性和边界

建议顺序：

1. [AI命理效果评估：准确性、数据集与验证框架](ai-mingli-evaluation.md)
2. [AI命理伦理与边界：风险、责任与理性使用](ai-mingli-ethics.md)
3. [AI命理协作流程：人工判断与模型辅助如何分工](ai-human-collaboration.md)
4. [命理的科学性与边界](../practice/scientific-perspective.md)
5. [AI过度自信案例：什么时候模型最容易把不确定说成确定](ai-overconfidence-cases.md)

### 5. 想知道怎么做产品或系统

建议顺序：

1. [命理知识图谱：本体建模、关系抽取与知识推理](knowledge-graph.md)
2. [AI命理知识库工作流：从古籍整理到可检索问答](ai-knowledge-base-workflow.md)
3. [AI评测集设计：命理问答、规则题与高风险边界如何构造](ai-evaluation-dataset-design.md)
4. [AI知识源分层规范：古籍、规则、案例与站内文档如何分级](ai-source-layering-spec.md)
5. [AI提示词边界设计：怎样让模型更克制、更稳地回答](ai-prompt-boundary-design.md)
6. [AI评测Rubric模板：怎样为命理问答与高风险场景统一打分](ai-evaluation-rubric-template.md)
7. [AI知识源元数据模板：文档入库前至少应补哪些字段](ai-source-metadata-template.md)
8. [AI提示词模板规范：规则题、解释题与高风险题怎样分模板](ai-prompt-template-spec.md)
9. [AI命理效果评估：准确性、数据集与验证框架](ai-mingli-evaluation.md)
10. [AI命理协作流程：人工判断与模型辅助如何分工](ai-human-collaboration.md)
11. [AI知识库召回失误案例：检索看似命中却仍然答偏的原因](ai-retrieval-failure-cases.md)
12. [AI评测集失败案例：分数看起来不错却不能真实反映系统能力](ai-evaluation-dataset-failure-cases.md)
13. [AI知识源污染案例：分层失效后系统为什么会越答越乱](ai-source-contamination-cases.md)
14. [AI提示词边界失败案例：约束写了却仍然压不住模型的原因](ai-prompt-boundary-failure-cases.md)

## 十一、和其他模块怎么接

AI 模块不是为了替代八字、紫微和六爻，而是为了帮助你理解这些体系怎样被整理、建模、检索、评估和辅助使用。

1. 想先理解底层知识结构，可以回到 [理论基础完整索引：从阴阳五行到十神、宫位与纳甲方法](../theory/complete-index.md)
2. 想看传统三大体系本身，可以进入 [八字命理学习中心：四柱、十神与命例分析](../bazi/index.md)、[紫微斗数学习中心：星曜、宫位与命例分析](../ziwei/index.md)、[周易六爻学习中心：八卦、断卦与案例](../yijing/index.md)
3. 想看理性边界和现实问题结合，可以回到 [命理实践指南](../practice/index.md)

## 十二、相关阅读

- [AI 命理与传统玄学](index.md)
- [理论基础完整索引：从阴阳五行到十神、宫位与纳甲方法](../theory/complete-index.md)
- [命理实践指南](../practice/index.md)
- [站点首页](../index.md)
