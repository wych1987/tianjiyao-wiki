# 天机爻 Wiki - GitHub Pages 配置指南

本文档提供了如何配置和使用 GitHub Pages 来发布天机爻 Wiki 的详细说明。

## 关于天机爻 Wiki

天机爻 Wiki 是一个系统化的中国传统命理学知识库，包含：

- **八字命理**：四柱八字、十神、格局、大运流年等完整体系
- **紫微斗数**：星曜、宫位、四化、格局组合等系统知识
- **周易八卦**：八卦、六爻、64卦、占卜方法等传统预测术
- **AI应用**：机器学习、NLP、知识图谱在命理学中的创新应用
- **理论基础**：阴阳五行、天干地支、六十甲子等核心理论
- **实践指南**：自学方法、案例分析、常见误区、工具资源

目前共有 **40 篇专业文档**，涵盖传统命理三大支柱（八字、紫微、周易）的完整知识体系。

## 配置 GitHub Pages

## 启用步骤

1. 进入 GitHub 仓库的设置页面（Settings）
2. 在左侧菜单中找到 "Pages" 选项
3. 在 "Source" 部分，选择：
   - **Branch**: 选择你要发布的分支（通常是 `main` 或 `master`）
   - **Folder**: 选择 `/docs` 作为发布目录
4. 点击 "Save" 保存设置
5. GitHub Pages 会自动构建并发布你的网站
6. 网站地址通常为：`https://<用户名>.github.io/<仓库名>/`

## 目录结构

```
/docs/
  ├── index.md              # 首页
  ├── _config.yml           # Jekyll 配置文件
  ├── _layouts/             # 自定义布局
  │   └── default.html      # 默认页面布局
  ├── bazi/                 # 八字命理模块
  │   ├── index.md          # 八字命理概论
  │   ├── introduction.md   # 入门介绍
  │   ├── ten-gods.md       # 十神体系
  │   ├── five-elements.md  # 五行生克
  │   ├── four-pillars.md   # 四柱排盘
  │   ├── pattern-analysis.md # 格局分析
  │   └── luck-cycles.md    # 大运流年
  ├── ziwei/                # 紫微斗数模块
  │   ├── index.md          # 紫微斗数概论
  │   ├── stars.md          # 星曜介绍
  │   ├── palaces.md        # 十二宫位
  │   ├── four-transformations.md # 四化飞星
  │   ├── pattern-combinations.md # 格局组合
  │   ├── practical-analysis.md   # 实战解盘
  │   └── advanced-techniques.md  # 高级技巧
  ├── yijing/               # 周易八卦模块（新增）
  │   ├── index.md          # 周易八卦概论
  │   ├── bagua.md          # 八卦详解
  │   ├── liuyao.md         # 六爻占卜入门
  │   ├── hexagrams.md      # 64卦详解
  │   ├── divination-methods.md # 占卜方法与技巧
  │   ├── interpretation.md # 卦象解读技巧
  │   ├── practical-cases.md # 六爻实战案例
  │   └── ai-application.md # AI在周易中的应用
  ├── ai/                   # AI应用模块
  │   ├── ai-introduction.md      # AI与传统玄学
  │   ├── machine-learning-bazi.md # 机器学习与八字
  │   ├── nlp-analysis.md         # NLP文本分析
  │   ├── knowledge-graph.md      # 知识图谱
  │   ├── llm-traditional-prediction.md # 大模型与预测
  │   └── future-trends.md        # 未来趋势
  ├── theory/               # 理论基础模块
  │   ├── yinyang.md        # 阴阳五行
  │   ├── heavenly-stems.md # 天干详解
  │   ├── earthly-branches.md # 地支详解
  │   └── sixty-jiazi.md    # 六十甲子
  ├── practice/             # 实践指南模块
  │   ├── self-learning.md  # 自学指南
  │   ├── case-studies.md   # 案例研究
  │   ├── common-mistakes.md # 常见误区
  │   └── tools-resources.md # 工具资源
  ├── sitemap.xml           # 网站地图
  └── robots.txt            # 搜索引擎爬虫规则
```

## 本地预览

如果要在本地预览网站，可以安装 Jekyll：

```bash
# 安装 Jekyll
gem install jekyll bundler

# 进入 docs 目录
cd docs

# 启动本地服务器
jekyll serve

# 访问 http://localhost:4000 查看网站
```

## 主题

当前使用的是 GitHub Pages 默认支持的 Cayman 主题。如需更换主题，请修改 `_config.yml` 文件中的 `theme` 配置。

GitHub Pages 支持的主题列表：
- jekyll-theme-cayman
- jekyll-theme-minimal
- jekyll-theme-slate
- jekyll-theme-architect
- jekyll-theme-modernist
- 等等...

## 注意事项

- 确保所有的 Markdown 文件都以 `.md` 结尾
- 确保 `_config.yml` 文件格式正确
- 图片等静态资源可以放在 `docs/assets/` 目录下
- 如果网站没有立即更新，请等待几分钟，GitHub Pages 需要时间构建
