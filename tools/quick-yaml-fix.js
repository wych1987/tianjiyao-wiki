#!/usr/bin/env node

const fs = require('fs').promises;
const chalk = require('chalk');

async function quickFixYAML() {
    console.log(chalk.blue('🚀 快速修复YAML front matter...'));
    
    const docs = [
        'docs/bazi/ten-gods.md',
        'docs/ziwei/index.md', 
        'docs/ziwei/stars.md',
        'docs/ai/ai-introduction.md'
    ];
    
    for (const doc of docs) {
        try {
            let content = await fs.readFile(doc, 'utf-8');
            
            // 如果不是以---开头，添加它
            if (!content.startsWith('---')) {
                content = '---\n' + content;
                await fs.writeFile(doc, content, 'utf-8');
                console.log(chalk.green(`✅ 修复 ${doc}`));
            } else {
                console.log(chalk.gray(`⚪ ${doc} 已正确`));
            }
        } catch (error) {
            console.log(chalk.red(`❌ ${doc}: ${error.message}`));
        }
    }
    
    console.log(chalk.green('\n✅ YAML front matter修复完成!'));
}

quickFixYAML().catch(console.error);