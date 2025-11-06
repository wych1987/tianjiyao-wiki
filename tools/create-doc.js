#!/usr/bin/env node

/**
 * 交互式文档创建工具
 */

const WikiDocumentEnhancer = require('./enhance-docs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const path = require('path');
const envConfig = require('./env-config');

async function interactiveCreate() {
    console.log(chalk.blue('📝 天机爻Wiki交互式文档创建工具'));
    console.log('=' * 40);

    // 检查API密钥
    const apiKey = envConfig.getDeepSeekApiKey();
    
    if (!apiKey) {
        console.log(chalk.red('❌ 未找到DeepSeek API密钥'));
        envConfig.showStatus();
        console.log(chalk.yellow('\n💡 请在.env.local文件中设置: DEEPSEEK_API_KEY=your_key'));
        return;
    }

    console.log(chalk.green('✅ API密钥配置正确'));
    envConfig.showStatus();

    // 交互式问题
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: '请输入文档标题:',
            validate: (input) => input.trim() !== '' || '标题不能为空'
        },
        {
            type: 'list',
            name: 'docType',
            message: '请选择文档类型:',
            choices: [
                { name: '八字命理 - 传统四柱八字相关内容', value: '八字命理' },
                { name: '紫微斗数 - 紫微星盘相关内容', value: '紫微斗数' },
                { name: 'AI玄学 - AI技术与传统文化结合', value: 'AI玄学' }
            ]
        },
        {
            type: 'list',
            name: 'category',
            message: '请选择文档分类:',
            choices: (answers) => {
                switch (answers.docType) {
                    case '八字命理':
                        return [
                            { name: '基础理论 - 天干地支、五行等', value: 'basics' },
                            { name: '十神体系 - 比肩、劫财等', value: 'ten-gods' },
                            { name: '格局分析 - 正格、变格等', value: 'patterns' },
                            { name: '大运流年 - 时间分析法', value: 'timing' }
                        ];
                    case '紫微斗数':
                        return [
                            { name: '星曜详解 - 十四主星等', value: 'stars' },
                            { name: '宫位分析 - 十二宫含义', value: 'palaces' },
                            { name: '飞星化忌 - 四化系统', value: 'flying' },
                            { name: '格局论断 - 命盘格局', value: 'patterns' }
                        ];
                    case 'AI玄学':
                        return [
                            { name: 'AI算法 - 技术原理分析', value: 'algorithms' },
                            { name: '数据模型 - 知识表示方法', value: 'models' },
                            { name: '应用案例 - 实际应用示例', value: 'applications' },
                            { name: '伦理思考 - AI与传统文化', value: 'ethics' }
                        ];
                }
            }
        },
        {
            type: 'number',
            name: 'length',
            message: '目标文档长度 (字符数):',
            default: 3000,
            validate: (input) => input > 500 || '文档长度至少500字符'
        },
        {
            type: 'input',
            name: 'filename',
            message: '文件名 (不含扩展名):',
            default: (answers) => {
                // 自动生成文件名
                return answers.title
                    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '-')
                    .toLowerCase()
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
            }
        }
    ]);

    // 生成输出路径
    const typeMap = {
        '八字命理': 'bazi',
        '紫微斗数': 'ziwei',
        'AI玄学': 'ai'
    };
    
    const outputDir = typeMap[answers.docType];
    const outputPath = path.join('docs', outputDir, `${answers.filename}.md`);

    // 显示创建信息
    console.log(chalk.blue('\n📋 文档创建信息:'));
    console.log(`标题: ${chalk.cyan(answers.title)}`);
    console.log(`类型: ${chalk.cyan(answers.docType)}`);
    console.log(`分类: ${chalk.cyan(answers.category)}`);
    console.log(`长度: ${chalk.cyan(answers.length)} 字符`);
    console.log(`输出: ${chalk.cyan(outputPath)}`);

    // 确认创建
    const { confirm } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: '确认创建文档?',
            default: true
        }
    ]);

    if (!confirm) {
        console.log(chalk.yellow('取消创建'));
        return;
    }

    // 创建增强器并生成文档
    const enhancer = new WikiDocumentEnhancer(apiKey, 'docs');
    
    console.log(chalk.blue('\n🚀 开始创建文档...'));
    
    const success = await enhancer.createNewDocument(
        answers.title,
        answers.docType,
        outputPath,
        answers.length
    );

    if (success) {
        console.log(chalk.green('\n✅ 文档创建成功！'));
        console.log(chalk.gray(`📁 文件位置: ${outputPath}`));
        
        // 提供后续操作建议
        console.log(chalk.blue('\n💡 后续操作建议:'));
        console.log(chalk.cyan('1. 检查生成的内容质量'));
        console.log(chalk.cyan('2. 根据需要进行人工调整'));
        console.log(chalk.cyan('3. 添加到导航菜单'));
        console.log(chalk.cyan('4. 提交到Git仓库'));
    } else {
        console.log(chalk.red('\n❌ 文档创建失败！'));
    }
}

// 运行交互式创建
interactiveCreate().catch(error => {
    console.error(chalk.red('创建过程出错:'), error);
    process.exit(1);
});