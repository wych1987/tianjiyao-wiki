#!/usr/bin/env node

/**
 * 环境检查和快速启动脚本
 */

const chalk = require('chalk');
const envConfig = require('./env-config');

function showWelcome() {
    console.log(chalk.blue.bold('🚀 天机爻Wiki专业文档生成系统'));
    console.log(chalk.gray('=' * 50));
    console.log(chalk.cyan('专业 • 权威 • 智能 • 易用'));
    console.log('');
}

function showCommands() {
    console.log(chalk.blue('📋 可用命令:'));
    console.log('');
    
    console.log(chalk.green('📊 分析文档'));
    console.log('  npm run analyze');
    console.log('  分析现有文档结构、质量和SEO状态');
    console.log('');
    
    console.log(chalk.green('🧪 测试API'));
    console.log('  npm run test');
    console.log('  测试DeepSeek API连接和功能');
    console.log('');
    
    console.log(chalk.green('📝 创建新文档'));
    console.log('  npm run create');
    console.log('  交互式创建新的专业文档');
    console.log('');
    
    console.log(chalk.green('🔧 增强现有文档'));
    console.log('  npm run enhance');
    console.log('  使用AI增强现有文档内容');
    console.log('');
    
    console.log(chalk.green('❓ 查看帮助'));
    console.log('  npm run help');
    console.log('  查看详细的命令行选项');
    console.log('');
}

function showTips() {
    console.log(chalk.yellow('💡 使用提示:'));
    console.log('');
    
    const apiKey = envConfig.getDeepSeekApiKey();
    if (apiKey) {
        console.log(chalk.green('✅ API密钥已配置，可以直接使用所有功能'));
    } else {
        console.log(chalk.red('❌ 请先配置DeepSeek API密钥'));
        console.log('   在 .env.local 文件中添加:');
        console.log(chalk.cyan('   DEEPSEEK_API_KEY=your_api_key_here'));
    }
    
    console.log('');
    console.log(chalk.cyan('📚 建议的使用流程:'));
    console.log('1. npm run analyze  # 了解当前文档状态');
    console.log('2. npm run test     # 测试API连接');
    console.log('3. npm run enhance  # 增强现有文档');
    console.log('4. npm run create   # 创建新文档');
}

function main() {
    showWelcome();
    
    // 显示环境状态
    envConfig.showStatus();
    console.log('');
    
    showCommands();
    showTips();
    
    console.log('');
    console.log(chalk.gray('=' * 50));
    console.log(chalk.blue('开始您的专业Wiki创作之旅！'));
}

if (require.main === module) {
    main();
}

module.exports = { showWelcome, showCommands, showTips };