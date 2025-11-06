#!/usr/bin/env node

/**
 * 天机爻Wiki文档增强工具 - Node.js版本
 * 使用DeepSeek API增强文档内容的专业性和深度
 */

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const yaml = require('yaml');
const { Command } = require('commander');
const chalk = require('chalk');
const glob = require('glob');
const envConfig = require('./env-config');

class WikiDocumentEnhancer {
    constructor(apiKey, docsPath = 'docs') {
        this.apiKey = apiKey;
        this.docsPath = docsPath;
        this.baseUrl = 'https://api.deepseek.com/v1/chat/completions';
        
        // 文档配置
        this.docConfig = {
            '八字命理': {
                keywords: ['八字', '四柱', '天干地支', '五行', '十神', '格局', '大运流年', '用神', '忌神', '调候', '通关'],
                references: [
                    '《渊海子平》', '《三命通会》', '《滴天髓》', '《穷通宝鉴》',
                    '《子平真诠》', '《神峰通考》', '《命理探原》', '《星平会海》',
                    '《五行精纪》', '《兰台妙选》', '《命理约言》'
                ],
                academicSources: [
                    '北京大学哲学系', '清华大学国学研究院', '中国人民大学哲学院',
                    '北京师范大学哲学学院', '复旦大学哲学学院', '南京大学哲学系',
                    '中山大学哲学系', '华东师范大学哲学系', '四川大学哲学系',
                    '中国易学文化研究会', '中国周易学会', '国际易学联合会',
                    '中科院自然科学史研究所', '中国社会科学院哲学研究所',
                    '台湾大学哲学系', '香港中文大学哲学系', '新加坡国立大学中文系'
                ],
                journals: [
                    '《周易研究》', '《易学研究》', '《中国哲学史》', '《哲学研究》',
                    '《自然科学史研究》', '《中华文化论坛》', '《国学学刊》'
                ],
                databases: [
                    'Google Scholar (scholar.google.com)',
                    '中国知网 (cnki.net)',
                    '万方数据库 (wanfangdata.com)',
                    '维普数据库 (cqvip.com)',
                    'JSTOR学术数据库',
                    'Academia.edu'
                ]
            },
            '紫微斗数': {
                keywords: ['紫微', '斗数', '星曜', '宫位', '飞星', '化忌', '格局', '十四主星', '辅星', '煞星', '四化'],
                references: [
                    '《紫微斗数全书》', '《斗数宣微》', '《紫微斗数讲义》',
                    '《飞星紫微斗数》', '《紫微斗数精成》', '《斗数骨髓赋》',
                    '《紫微斗数捷径》', '《斗数秘仪》', '《紫微斗数全集》'
                ],
                academicSources: [
                    '台湾大学中文系', '台湾师范大学国文系', '中央大学中文系',
                    '香港中文大学中文系', '香港大学中文学院', '澳门大学中华医药研究院',
                    '新加坡国立大学中文系', '南洋理工大学人文学院',
                    '北京大学中文系', '清华大学人文学院', '中国人民大学文学院',
                    '台湾紫微斗数学会', '香港易学研究中心', '新加坡易经学院',
                    '马来西亚易经学会', '美国国际易学研究会'
                ],
                journals: [
                    '《台湾文献》', '《中华文化复兴月刊》', '《易经研究》',
                    '《中国文哲研究通讯》', '《汉学研究》', '《民俗曲艺》'
                ],
                databases: [
                    'Google Scholar (scholar.google.com)',
                    '台湾华艺数位 (airiti.com)',
                    '中国知网 (cnki.net)',
                    'HyRead台湾学术电子书',
                    '国家图书馆数字资源'
                ]
            },
            'AI玄学': {
                keywords: ['人工智能', '机器学习', '深度学习', '自然语言处理', '知识图谱', '语义分析', '神经网络', 'Transformer', '大语言模型'],
                references: [
                    '《人工智能：一种现代方法》(Stuart Russell)', '《机器学习》(周志华)',
                    '《深度学习》(Ian Goodfellow)', '《自然语言处理综论》(Daniel Jurafsky)',
                    '《模式识别与机器学习》(Christopher Bishop)', '《统计学习方法》(李航)',
                    '《Python机器学习》(Sebastian Raschka)', '《深度学习入门》(斋藤康毅)',
                    '《Attention Is All You Need》(Vaswani et al.)', '《BERT》(Devlin et al.)'
                ],
                academicSources: [
                    'MIT计算机科学与人工智能实验室', 'Stanford AI实验室', 'CMU机器学习系',
                    'UC Berkeley人工智能研究院', 'Google AI Research', 'Microsoft Research',
                    'OpenAI', 'DeepMind', 'Meta AI Research', 'Anthropic',
                    '清华大学AI研究院', '北京大学信息科学技术学院', '中科院计算技术研究所',
                    '中科院自动化研究所', '北京邮电大学', '华中科技大学计算机学院',
                    '上海交通大学人工智能研究院', '浙江大学计算机学院', '南京大学计算机系',
                    '中国人民大学信息学院', '北京理工大学计算机学院'
                ],
                journals: [
                    'Nature Machine Intelligence', 'Science Robotics', 'IEEE TPAMI',
                    'Journal of Machine Learning Research', 'Machine Learning', 'Neural Networks',
                    'Artificial Intelligence', 'ACM Computing Surveys', 'IEEE TNN',
                    '《计算机学报》', '《软件学报》', '《中国科学：信息科学》',
                    '《计算机研究与发展》', '《自动化学报》'
                ],
                databases: [
                    'Google Scholar (scholar.google.com)',
                    'arXiv.org (机器学习预印本)',
                    'Papers With Code',
                    'IEEE Xplore数字图书馆',
                    'ACM数字图书馆',
                    'Springer Link',
                    'ScienceDirect',
                    '中国知网 (cnki.net)',
                    'DBLP计算机科学文献数据库'
                ]
            }
        };
    }

    /**
     * 生成专业的提示词
     */
    generateProfessionalPrompt(docType, currentContent, title, targetLength = 3000) {
        const config = this.docConfig[docType] || {};
        const keywords = config.keywords || [];
        const references = config.references || [];
        const academicSources = config.academicSources || [];
        const journals = config.journals || [];
        const databases = config.databases || [];

        return `
作为一名资深的${docType}学者和研究专家，请帮我完善这篇关于《${title}》的Wiki文档。

## 当前文档内容：
${currentContent}

## 完善要求：

### 1. 学术专业性与权威性
- 确保内容学术严谨，引用权威典籍和现代研究成果
- 重要概念要有准确的定义和解释，体现深厚的学术底蕴
- 添加历史发展脉络和理论演进过程
- 关键术语：${keywords.join(', ')}

### 2. 权威资料引用与学术支撑
**经典文献参考：**
${references.slice(0, 6).join(', ')}等经典著作

**权威学术机构：**
可参考以下知名院校和研究机构的相关研究：
${academicSources.slice(0, 8).join('、')}等

**学术期刊资源：**
${journals.length > 0 ? journals.slice(0, 4).join('、') + '等专业期刊' : '相关专业学术期刊'}

**学术数据库验证：**
${databases.length > 0 ? databases.slice(0, 4).join('、') + '等' : 'Google Scholar等学术数据库'}

- 所有引用必须标注来源，格式：[来源名称](链接或说明)
- 优先引用同行评议的学术论文和权威机构研究
- 可以适当引用维基百科、百度百科等知名百科全书的客观内容

### 3. 内容结构优化
- 使用清晰的层级标题结构
- 添加实例说明和案例分析
- 包含图表说明位置（用文字描述）
- 添加相关词汇表或术语解释
- 确保逻辑清晰，论证充分

### 4. 现代化学术视角
- 结合现代研究成果和科学观点
- 讨论在当代的应用和发展趋势
- 与现代心理学、统计学、数据科学等学科的关联分析
- 保持理性客观的学术态度，避免过于玄学或迷信的表述
- 体现跨学科研究的特色

### 5. SEO和用户体验优化
- 优化关键词密度（自然融入，不堆砌）
- 添加内部链接建议（用markdown格式）
- 创建相关阅读推荐和延伸思考
- 包含FAQ常见问题解答
- 适合不同知识背景的读者群体

### 6. 质量标准与学术规范
- 目标字数：${targetLength}字左右
- 语言风格：学术性但易懂，深入浅出
- 保持中性客观的学术态度
- 强调文化传承和理性学习
- 确保内容的原创性和学术价值

### 7. 格式要求
- 使用标准的Markdown格式
- 包含完整的YAML front matter（title, description, keywords, author, date等）
- 添加面包屑导航路径
- 包含详细的参考资料和延伸阅读部分
- 注明可查证的学术来源

请基于以上要求，生成一篇高质量、专业性强的Wiki文档。确保内容既有深厚的学术底蕴，又具有良好的可读性和实用价值。让读者能够获得权威、可信的专业知识。
`.trim();
    }

    /**
     * 调用DeepSeek API
     */
    async callDeepSeekAPI(prompt, maxTokens = 4000) {
        try {
            const response = await axios.post(this.baseUrl, {
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: maxTokens,
                temperature: 0.7,
                stream: false
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000 // 60秒超时
            });

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error(chalk.red('API调用错误:'), error.message);
            if (error.response) {
                console.error(chalk.red('响应状态:'), error.response.status);
                console.error(chalk.red('响应数据:'), error.response.data);
            }
            return null;
        }
    }

    /**
     * 检测文档类型
     */
    detectDocType(filePath) {
        const pathStr = filePath.toLowerCase();
        
        if (pathStr.includes('bazi') || pathStr.includes('八字')) {
            return '八字命理';
        } else if (pathStr.includes('ziwei') || pathStr.includes('紫微')) {
            return '紫微斗数';
        } else if (pathStr.includes('ai') || pathStr.includes('AI')) {
            return 'AI玄学';
        } else {
            return '传统文化';
        }
    }

    /**
     * 从内容中提取标题
     */
    extractTitleFromContent(content) {
        // 先尝试从YAML front matter提取
        if (content.startsWith('---')) {
            try {
                const endMarker = content.indexOf('---', 3);
                if (endMarker !== -1) {
                    const yamlContent = content.substring(3, endMarker);
                    const yamlData = yaml.parse(yamlContent);
                    if (yamlData && yamlData.title) {
                        return yamlData.title;
                    }
                }
            } catch (error) {
                // 继续尝试其他方法
            }
        }
        
        // 从第一个标题提取
        const lines = content.split('\n');
        for (const line of lines) {
            if (line.startsWith('# ')) {
                return line.substring(2).trim();
            }
        }
        
        return '未知标题';
    }

    /**
     * 增强单个文档
     */
    async enhanceDocument(filePath) {
        try {
            console.log(chalk.blue(`正在处理: ${filePath}`));
            
            // 读取现有内容
            const currentContent = await fs.readFile(filePath, 'utf8');
            
            // 检测文档类型和标题
            const docType = this.detectDocType(filePath);
            const title = this.extractTitleFromContent(currentContent);
            
            console.log(chalk.cyan(`文档类型: ${docType}`));
            console.log(chalk.cyan(`标题: ${title}`));
            
            // 生成提示词
            const prompt = this.generateProfessionalPrompt(docType, currentContent, title);
            
            // 调用API
            console.log(chalk.yellow('正在调用DeepSeek API...'));
            const enhancedContent = await this.callDeepSeekAPI(prompt);
            
            if (enhancedContent) {
                // 备份原文件
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const backupPath = `${filePath}.backup.${timestamp}`;
                await fs.copy(filePath, backupPath);
                
                // 写入增强内容
                await fs.writeFile(filePath, enhancedContent, 'utf8');
                
                console.log(chalk.green(`✅ 成功增强文档: ${filePath}`));
                console.log(chalk.gray(`📁 备份文件: ${backupPath}`));
                return true;
            } else {
                console.log(chalk.red(`❌ 增强失败: ${filePath}`));
                return false;
            }
        } catch (error) {
            console.error(chalk.red(`❌ 处理文档时出错 ${filePath}:`), error.message);
            return false;
        }
    }

    /**
     * 增强所有文档
     */
    async enhanceAllDocuments(filePattern = '**/*.md') {
        const stats = { success: 0, failed: 0, skipped: 0 };
        
        // 查找所有markdown文件
        const files = glob.sync(path.join(this.docsPath, filePattern));
        
        // 过滤掉不需要处理的文件
        const excludePatterns = [
            'README.md',
            'SEO_IMPLEMENTATION_GUIDE.md',
            'PROFESSIONAL_DOCS_SYSTEM.md',
            'README_ENHANCE_TOOL.md'
        ];
        
        const filteredFiles = files.filter(file => {
            const basename = path.basename(file);
            return !excludePatterns.some(pattern => basename.includes(pattern)) &&
                   !basename.startsWith('_') &&
                   !basename.includes('.backup.');
        });
        
        console.log(chalk.blue(`找到 ${filteredFiles.length} 个需要处理的文档`));
        
        for (const filePath of filteredFiles) {
            if (await this.enhanceDocument(filePath)) {
                stats.success++;
            } else {
                stats.failed++;
            }
            
            // 添加延迟避免API限制
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        return stats;
    }

    /**
     * 创建新文档
     */
    async createNewDocument(title, docType, outputPath, targetLength = 3000) {
        // 基础内容模板
        const basicContent = `---
layout: default
title: ${title}
description: ${title}相关知识详解
keywords: []
breadcrumbs: []
---

# ${title}

（这是一个新创建的文档，需要添加具体内容）

## 基本概念

## 历史发展

## 理论基础

## 实际应用

## 现代研究

## 参考资料
`;
        
        // 生成提示词
        const prompt = this.generateProfessionalPrompt(docType, basicContent, title, targetLength);
        
        // 调用API生成内容
        console.log(chalk.yellow('正在生成新文档内容...'));
        const enhancedContent = await this.callDeepSeekAPI(prompt);
        
        if (enhancedContent) {
            // 确保输出目录存在
            await fs.ensureDir(path.dirname(outputPath));
            
            // 写入文件
            await fs.writeFile(outputPath, enhancedContent, 'utf8');
            
            console.log(chalk.green(`✅ 成功创建新文档: ${outputPath}`));
            return true;
        } else {
            console.log(chalk.red(`❌ 创建文档失败: ${title}`));
            return false;
        }
    }

    /**
     * 分析现有文档
     */
    async analyzeDocuments() {
        const files = glob.sync(path.join(this.docsPath, '**/*.md'));
        
        console.log(chalk.blue('📊 文档分析结果:'));
        console.log(`总文档数: ${files.length}`);
        
        const typeStats = {};
        const sizeStats = [];
        
        for (const file of files) {
            const content = await fs.readFile(file, 'utf8');
            const docType = this.detectDocType(file);
            const wordCount = content.length;
            
            typeStats[docType] = (typeStats[docType] || 0) + 1;
            sizeStats.push({
                file: path.relative(this.docsPath, file),
                type: docType,
                size: wordCount
            });
        }
        
        console.log('\n📈 按类型统计:');
        Object.entries(typeStats).forEach(([type, count]) => {
            console.log(`${type}: ${count} 个文档`);
        });
        
        console.log('\n📝 文档大小统计:');
        sizeStats
            .sort((a, b) => b.size - a.size)
            .slice(0, 10)
            .forEach(stat => {
                console.log(`${stat.file}: ${stat.size} 字符 (${stat.type})`);
            });
    }
}

// 命令行接口
const program = new Command();

program
    .name('enhance-docs')
    .description('天机爻Wiki文档增强工具')
    .version('1.0.0');

program
    .command('enhance')
    .description('增强现有文档')
    .option('-k, --api-key <key>', 'DeepSeek API密钥（可从环境变量自动读取）')
    .option('-d, --docs-path <path>', '文档目录路径', 'docs')
    .option('-l, --length <number>', '目标文档长度', '3000')
    .action(async (options) => {
        // 获取API密钥
        const apiKey = options.apiKey || envConfig.getDeepSeekApiKey();
        
        if (!apiKey) {
            console.log(chalk.red('❌ 未找到DeepSeek API密钥'));
            envConfig.showStatus();
            console.log(chalk.yellow('\n💡 解决方法:'));
            console.log('1. 在.env.local文件中设置: DEEPSEEK_API_KEY=your_key');
            console.log('2. 使用命令行参数: --api-key your_key');
            console.log('3. 设置环境变量: export DEEPSEEK_API_KEY=your_key');
            return;
        }

        const enhancer = new WikiDocumentEnhancer(apiKey, options.docsPath);
        
        console.log(chalk.blue('🚀 开始增强现有文档...'));
        envConfig.showStatus();
        
        const stats = await enhancer.enhanceAllDocuments();
        
        console.log(chalk.blue('\n📊 处理结果统计:'));
        console.log(chalk.green(`✅ 成功: ${stats.success}`));
        console.log(chalk.red(`❌ 失败: ${stats.failed}`));
        console.log(chalk.yellow(`⏭️  跳过: ${stats.skipped}`));
    });

program
    .command('create')
    .description('创建新文档')
    .option('-k, --api-key <key>', 'DeepSeek API密钥（可从环境变量自动读取）')
    .requiredOption('-t, --title <title>', '文档标题')
    .requiredOption('--type <type>', '文档类型 (八字命理|紫微斗数|AI玄学)')
    .requiredOption('-o, --output <path>', '输出文件路径')
    .option('-d, --docs-path <path>', '文档目录路径', 'docs')
    .option('-l, --length <number>', '目标文档长度', '3000')
    .action(async (options) => {
        // 获取API密钥
        const apiKey = options.apiKey || envConfig.getDeepSeekApiKey();
        
        if (!apiKey) {
            console.log(chalk.red('❌ 未找到DeepSeek API密钥'));
            envConfig.showStatus();
            return;
        }

        const enhancer = new WikiDocumentEnhancer(apiKey, options.docsPath);
        
        console.log(chalk.blue(`🚀 开始创建新文档: ${options.title}`));
        envConfig.showStatus();
        
        const success = await enhancer.createNewDocument(
            options.title,
            options.type,
            options.output,
            parseInt(options.length)
        );
        
        if (success) {
            console.log(chalk.green('✅ 文档创建成功！'));
        } else {
            console.log(chalk.red('❌ 文档创建失败！'));
        }
    });

program
    .command('analyze')
    .description('分析现有文档结构')
    .option('-d, --docs-path <path>', '文档目录路径', 'docs')
    .action(async (options) => {
        const enhancer = new WikiDocumentEnhancer('', options.docsPath);
        await enhancer.analyzeDocuments();
    });

// 如果没有提供命令，显示帮助
if (process.argv.length === 2) {
    program.help();
}

program.parse();

module.exports = WikiDocumentEnhancer;