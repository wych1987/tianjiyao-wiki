#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const axios = require('axios');

// 直接实现增强类，避免引用有命令行解析器的模块
class SimpleDocumentEnhancer {
    constructor() {
        this.apiKey = process.env.DEEPSEEK_API_KEY;
        this.baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
        
        if (!this.apiKey) {
            throw new Error('❌ 未找到DEEPSEEK_API_KEY环境变量！');
        }

        // 完整的学术资源配置（丰富版）
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

    generatePrompt(docType, content, title, targetLength = 3000) {
        const config = this.docConfig[docType] || {};
        const keywords = config.keywords || [];
        const references = config.references || [];
        const academicSources = config.academicSources || [];
        const journals = config.journals || [];
        const databases = config.databases || [];

        return `
作为一名资深的${docType}学者和研究专家，请帮我完善这篇关于《${title}》的Wiki文档。

## 当前文档内容：
${content}

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

    async callAPI(prompt) {
        try {
            const response = await axios.post(this.baseURL + '/chat/completions', {
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 6000,
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('API调用失败:', error.message);
            return null;
        }
    }

    async enhanceDocument(content, docType, title, targetLength = 3000) {
        const prompt = this.generatePrompt(docType, content, title, targetLength);
        return await this.callAPI(prompt);
    }
}

async function enhanceDocumentsOneByOne() {
    console.log(chalk.blue.bold('🚀 逐篇文档增强开始...'));
    console.log('='.repeat(60));
    
    try {
        const enhancer = new SimpleDocumentEnhancer();
        
        // 获取所有需要增强的文档
        const docsToEnhance = [
            { path: 'docs/ziwei/stars.md', type: '紫微斗数', priority: 'high' },
            { path: 'docs/bazi/ten-gods.md', type: '八字命理', priority: 'high' },
            { path: 'docs/ai/ai-introduction.md', type: 'AI玄学', priority: 'high' },
            { path: 'docs/bazi/introduction.md', type: '八字命理', priority: 'medium' },
            { path: 'docs/ziwei/index.md', type: '紫微斗数', priority: 'medium' }
        ];
        
        console.log(chalk.yellow(`📚 待处理文档: ${docsToEnhance.length} 篇`));
        console.log('');
        
        let successCount = 0;
        let failCount = 0;
        
        for (let i = 0; i < docsToEnhance.length; i++) {
            const doc = docsToEnhance[i];
            console.log(chalk.cyan(`\n[${i + 1}/${docsToEnhance.length}] 处理文档: ${doc.path}`));
            console.log(chalk.gray(`类型: ${doc.type} | 优先级: ${doc.priority}`));
            
            try {
                // 检查文件是否存在
                const content = await fs.readFile(doc.path, 'utf-8');
                console.log(chalk.green(`✅ 文件读取成功 (${content.length} 字符)`));
                
                // 提取标题
                const titleMatch = content.match(/^#\s+(.+)$/m);
                const title = titleMatch ? titleMatch[1] : path.basename(doc.path, '.md');
                
                console.log(chalk.blue(`🔄 正在调用AI增强: "${title}"`));
                console.log(chalk.gray('⏳ 预计需要 20-40 秒...'));
                
                // 增强文档
                const enhancedContent = await enhancer.enhanceDocument(
                    content,
                    doc.type,
                    title,
                    3000
                );
                
                if (enhancedContent) {
                    // 创建备份
                    const backupPath = doc.path.replace('.md', '.backup.md');
                    await fs.writeFile(backupPath, content, 'utf-8');
                    
                    // 保存增强后的内容
                    await fs.writeFile(doc.path, enhancedContent, 'utf-8');
                    
                    console.log(chalk.green(`✅ 增强完成!`));
                    console.log(chalk.green(`📄 ${content.length} → ${enhancedContent.length} 字符 (+${Math.round((enhancedContent.length / content.length - 1) * 100)}%)`));
                    console.log(chalk.gray(`💾 备份保存至: ${backupPath}`));
                    
                    successCount++;
                } else {
                    console.log(chalk.red(`❌ 增强失败: API调用失败`));
                    failCount++;
                }
                
            } catch (error) {
                console.log(chalk.red(`❌ 处理失败: ${error.message}`));
                failCount++;
            }
            
            // 在处理下一个文档前稍作休息，避免API限速
            if (i < docsToEnhance.length - 1) {
                console.log(chalk.gray('⏱️  休息 2 秒...'));
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        // 总结
        console.log('\n' + '='.repeat(60));
        console.log(chalk.bold('📊 处理完成统计:'));
        console.log(chalk.green(`✅ 成功: ${successCount} 篇`));
        console.log(chalk.red(`❌ 失败: ${failCount} 篇`));
        console.log(chalk.blue(`📈 成功率: ${Math.round(successCount / docsToEnhance.length * 100)}%`));
        
        if (successCount > 0) {
            console.log(chalk.yellow('\n🎯 建议下一步:'));
            console.log('1. 检查增强后的文档质量');
            console.log('2. 运行 npm run analyze 查看整体改善');
            console.log('3. 提交更改到Git仓库');
        }
        
    } catch (error) {
        console.error(chalk.red('❌ 系统错误:'), error.message);
    }
}

// 运行增强
enhanceDocumentsOneByOne().catch(console.error);