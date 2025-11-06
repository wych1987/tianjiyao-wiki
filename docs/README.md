# 配置 GitHub Pages

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
  ├── bazi/                 # 八字命理
  │   ├── introduction.md   # 入门介绍
  │   └── ten-gods.md       # 十神体系
  ├── ziwei/                # 紫微斗数
  │   └── stars.md          # 星曜介绍
  └── ai/                   # AI 应用
      └── ai-introduction.md # AI 与传统玄学
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
