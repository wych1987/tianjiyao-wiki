#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

async function fixDocumentFormats() {
    console.log(chalk.blue.bold('🔧 开始修复文档格式问题...'));
    console.log('='.repeat(60));
    
    // 需要修复的文档列表
    const docsToFix = [
        'docs/bazi/introduction.md',
        'docs/bazi/ten-gods.md', 
        'docs/ziwei/index.md',
        'docs/ziwei/stars.md',
        'docs/ai/ai-introduction.md'
    ];
    
    let fixedCount = 0;
    
    for (const docPath of docsToFix) {
        console.log(chalk.cyan(`\n🔍 检查文档: ${docPath}`));
        
        try {
            let content = await fs.readFile(docPath, 'utf-8');
            let isFixed = false;
            
            // 修复1: 移除包装的markdown代码块
            if (content.startsWith('```markdown\n') && content.endsWith('\n```')) {
                console.log(chalk.yellow('   ⚠️ 发现markdown代码块包装'));
                content = content.replace(/^```markdown\n/, '').replace(/\n```$/, '');
                isFixed = true;
            }
            
            // 修复2: 移除多余的markdown代码块
            if (content.includes('````markdown')) {
                console.log(chalk.yellow('   ⚠️ 发现四重markdown代码块'));
                content = content.replace(/````markdown\n/g, '').replace(/\n````/g, '');
                isFixed = true;
            }
            
            // 修复3: 确保YAML front matter格式正确
            if (!content.startsWith('---\n')) {
                console.log(chalk.yellow('   ⚠️ 缺少YAML front matter开始标记'));
                // 如果有YAML内容但缺少开始标记，添加它
                if (content.includes('title:') && content.includes('description:')) {
                    content = '---\n' + content;
                    isFixed = true;
                }
            }
            
            // 修复4: 检查YAML front matter结束标记
            const lines = content.split('\n');
            let yamlEndIndex = -1;
            for (let i = 1; i < lines.length; i++) {
                if (lines[i] === '---') {
                    yamlEndIndex = i;
                    break;
                }
            }
            
            if (yamlEndIndex === -1 && content.startsWith('---\n')) {
                console.log(chalk.yellow('   ⚠️ 缺少YAML front matter结束标记'));
                // 找到YAML内容的结束位置并添加结束标记
                for (let i = 1; i < lines.length; i++) {
                    if (lines[i].startsWith('#') || lines[i].trim() === '') {
                        lines.splice(i, 0, '---');
                        content = lines.join('\n');
                        isFixed = true;
                        break;
                    }
                }
            }
            
            // 修复5: 清理重复的空行
            content = content.replace(/\n\n\n+/g, '\n\n');
            
            if (isFixed) {
                // 创建备份
                const backupPath = docPath.replace('.md', '.before-fix.md');
                await fs.writeFile(backupPath, await fs.readFile(docPath, 'utf-8'), 'utf-8');
                
                // 保存修复后的文件
                await fs.writeFile(docPath, content, 'utf-8');
                
                console.log(chalk.green('   ✅ 格式已修复'));
                console.log(chalk.gray(`   💾 备份保存至: ${backupPath}`));
                fixedCount++;
            } else {
                console.log(chalk.green('   ✅ 格式正常，无需修复'));
            }
            
        } catch (error) {
            console.log(chalk.red(`   ❌ 修复失败: ${error.message}`));
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(chalk.bold(`📊 修复完成统计:`));
    console.log(chalk.green(`✅ 修复文档: ${fixedCount} 个`));
    console.log(chalk.blue(`📝 检查文档: ${docsToFix.length} 个`));
    
    if (fixedCount > 0) {
        console.log(chalk.yellow('\n🎯 建议下一步:'));
        console.log('1. 运行 npm run analyze 检查修复效果');
        console.log('2. 检查文档是否能正确显示YAML front matter');
        console.log('3. 提交修复后的文档');
    }
}

// 执行修复
fixDocumentFormats().catch(console.error);