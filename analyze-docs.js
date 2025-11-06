#!/usr/bin/env node

/**
 * 文档结构分析工具
 */

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const yaml = require('yaml');

class DocumentAnalyzer {
    constructor(docsPath = 'docs') {
        this.docsPath = docsPath;
    }

    /**
     * 分析文档元数据
     */
    analyzeMetadata(content) {
        const metadata = {
            hasYamlFrontMatter: false,
            title: null,
            description: null,
            keywords: [],
            breadcrumbs: [],
            wordCount: content.length,
            charCount: content.replace(/\s/g, '').length,
            headings: [],
            links: [],
            images: []
        };

        // 解析YAML front matter
        if (content.startsWith('---')) {
            try {
                const endMarker = content.indexOf('---', 3);
                if (endMarker !== -1) {
                    const yamlContent = content.substring(3, endMarker);
                    const yamlData = yaml.parse(yamlContent);
                    
                    metadata.hasYamlFrontMatter = true;
                    metadata.title = yamlData.title || null;
                    metadata.description = yamlData.description || null;
                    metadata.keywords = yamlData.keywords || [];
                    metadata.breadcrumbs = yamlData.breadcrumbs || [];
                }
            } catch (error) {
                // YAML解析失败
            }
        }

        // 分析标题结构
        const lines = content.split('\n');
        for (const line of lines) {
            const match = line.match(/^(#{1,6})\s+(.+)$/);
            if (match) {
                metadata.headings.push({
                    level: match[1].length,
                    text: match[2].trim()
                });
            }
        }

        // 分析链接
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let linkMatch;
        while ((linkMatch = linkRegex.exec(content)) !== null) {
            metadata.links.push({
                text: linkMatch[1],
                url: linkMatch[2],
                isInternal: !linkMatch[2].startsWith('http')
            });
        }

        // 分析图片
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
        let imageMatch;
        while ((imageMatch = imageRegex.exec(content)) !== null) {
            metadata.images.push({
                alt: imageMatch[1],
                src: imageMatch[2]
            });
        }

        return metadata;
    }

    /**
     * 分析单个文档
     */
    async analyzeDocument(filePath) {
        const content = await fs.readFile(filePath, 'utf8');
        const relativePath = path.relative(this.docsPath, filePath);
        const metadata = this.analyzeMetadata(content);

        return {
            path: relativePath,
            fullPath: filePath,
            ...metadata
        };
    }

    /**
     * 生成详细分析报告
     */
    async generateReport() {
        console.log(chalk.blue('📊 天机爻Wiki文档分析报告'));
        console.log('=' * 50);

        // 查找所有markdown文件
        const files = glob.sync(path.join(this.docsPath, '**/*.md'));
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

        console.log(chalk.cyan(`📁 总文档数: ${filteredFiles.length}`));

        // 分析每个文档
        const analyses = [];
        for (const file of filteredFiles) {
            const analysis = await this.analyzeDocument(file);
            analyses.push(analysis);
        }

        // 统计信息
        this.generateStatistics(analyses);
        
        // 质量检查
        this.generateQualityReport(analyses);
        
        // SEO分析
        this.generateSEOReport(analyses);
        
        // 结构分析
        this.generateStructureReport(analyses);

        return analyses;
    }

    /**
     * 生成统计信息
     */
    generateStatistics(analyses) {
        console.log(chalk.blue('\n📈 统计信息'));
        console.log('-' * 30);

        // 按目录分类
        const dirStats = {};
        analyses.forEach(doc => {
            const dir = path.dirname(doc.path);
            dirStats[dir] = (dirStats[dir] || 0) + 1;
        });

        console.log(chalk.yellow('按目录分布:'));
        Object.entries(dirStats)
            .sort(([,a], [,b]) => b - a)
            .forEach(([dir, count]) => {
                console.log(`  ${dir}: ${count} 个文档`);
            });

        // 文档大小统计
        const sizes = analyses.map(doc => doc.charCount);
        const avgSize = sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
        const maxSize = Math.max(...sizes);
        const minSize = Math.min(...sizes);

        console.log(chalk.yellow('\n文档大小统计:'));
        console.log(`  平均大小: ${Math.round(avgSize)} 字符`);
        console.log(`  最大文档: ${maxSize} 字符`);
        console.log(`  最小文档: ${minSize} 字符`);

        // 标题统计
        const headingCounts = analyses.map(doc => doc.headings.length);
        const avgHeadings = headingCounts.reduce((sum, count) => sum + count, 0) / headingCounts.length;

        console.log(chalk.yellow('\n标题结构统计:'));
        console.log(`  平均标题数: ${Math.round(avgHeadings)}`);
    }

    /**
     * 生成质量报告
     */
    generateQualityReport(analyses) {
        console.log(chalk.blue('\n🎯 质量分析'));
        console.log('-' * 30);

        let issues = [];

        analyses.forEach(doc => {
            const docIssues = [];

            // 检查YAML front matter
            if (!doc.hasYamlFrontMatter) {
                docIssues.push('缺少YAML front matter');
            }

            // 检查标题
            if (!doc.title) {
                docIssues.push('缺少标题');
            }

            // 检查描述
            if (!doc.description) {
                docIssues.push('缺少描述');
            }

            // 检查关键词
            if (doc.keywords.length === 0) {
                docIssues.push('缺少关键词');
            }

            // 检查内容长度
            if (doc.charCount < 500) {
                docIssues.push('内容过短');
            }

            // 检查标题结构
            if (doc.headings.length === 0) {
                docIssues.push('缺少标题结构');
            }

            if (docIssues.length > 0) {
                issues.push({
                    path: doc.path,
                    issues: docIssues
                });
            }
        });

        if (issues.length === 0) {
            console.log(chalk.green('✅ 所有文档质量良好！'));
        } else {
            console.log(chalk.red(`❌ 发现 ${issues.length} 个文档存在问题:`));
            issues.forEach(item => {
                console.log(chalk.yellow(`\n📄 ${item.path}:`));
                item.issues.forEach(issue => {
                    console.log(chalk.red(`  - ${issue}`));
                });
            });
        }
    }

    /**
     * 生成SEO报告
     */
    generateSEOReport(analyses) {
        console.log(chalk.blue('\n🔍 SEO分析'));
        console.log('-' * 30);

        const seoIssues = [];

        analyses.forEach(doc => {
            const issues = [];

            // 检查标题长度
            if (doc.title && (doc.title.length < 10 || doc.title.length > 60)) {
                issues.push('标题长度不合适 (建议10-60字符)');
            }

            // 检查描述长度
            if (doc.description && (doc.description.length < 50 || doc.description.length > 160)) {
                issues.push('描述长度不合适 (建议50-160字符)');
            }

            // 检查关键词数量
            if (doc.keywords.length < 3 || doc.keywords.length > 10) {
                issues.push('关键词数量不合适 (建议3-10个)');
            }

            // 检查H1标题
            const h1Count = doc.headings.filter(h => h.level === 1).length;
            if (h1Count !== 1) {
                issues.push('H1标题数量不正确 (应该有且仅有1个)');
            }

            // 检查内部链接
            const internalLinks = doc.links.filter(link => link.isInternal).length;
            if (internalLinks < 2) {
                issues.push('内部链接过少 (建议至少2个)');
            }

            if (issues.length > 0) {
                seoIssues.push({
                    path: doc.path,
                    issues: issues
                });
            }
        });

        if (seoIssues.length === 0) {
            console.log(chalk.green('✅ SEO配置良好！'));
        } else {
            console.log(chalk.yellow(`⚠️  ${seoIssues.length} 个文档需要SEO优化:`));
            seoIssues.slice(0, 5).forEach(item => {
                console.log(chalk.cyan(`\n📄 ${item.path}:`));
                item.issues.forEach(issue => {
                    console.log(chalk.yellow(`  - ${issue}`));
                });
            });

            if (seoIssues.length > 5) {
                console.log(chalk.gray(`\n... 还有 ${seoIssues.length - 5} 个文档存在类似问题`));
            }
        }
    }

    /**
     * 生成结构分析
     */
    generateStructureReport(analyses) {
        console.log(chalk.blue('\n🏗️  结构分析'));
        console.log('-' * 30);

        // 链接分析
        const allLinks = analyses.flatMap(doc => 
            doc.links.map(link => ({
                source: doc.path,
                ...link
            }))
        );

        const internalLinks = allLinks.filter(link => link.isInternal);
        const externalLinks = allLinks.filter(link => !link.isInternal);

        console.log(chalk.yellow('链接统计:'));
        console.log(`  内部链接: ${internalLinks.length}`);
        console.log(`  外部链接: ${externalLinks.length}`);

        // 检查断链
        const brokenLinks = [];
        for (const link of internalLinks) {
            const targetPath = path.resolve(path.dirname(path.join(this.docsPath, link.source)), link.url);
            if (!fs.existsSync(targetPath)) {
                brokenLinks.push(link);
            }
        }

        if (brokenLinks.length > 0) {
            console.log(chalk.red(`\n❌ 发现 ${brokenLinks.length} 个断链:`));
            brokenLinks.slice(0, 5).forEach(link => {
                console.log(chalk.red(`  ${link.source} -> ${link.url}`));
            });
        } else {
            console.log(chalk.green('\n✅ 未发现断链'));
        }

        // 孤立文档检查
        const linkedDocs = new Set(internalLinks.map(link => {
            const targetPath = path.resolve(path.dirname(path.join(this.docsPath, link.source)), link.url);
            return path.relative(this.docsPath, targetPath);
        }));

        const orphanDocs = analyses.filter(doc => !linkedDocs.has(doc.path) && doc.path !== 'index.md');

        if (orphanDocs.length > 0) {
            console.log(chalk.yellow(`\n⚠️  发现 ${orphanDocs.length} 个孤立文档:`));
            orphanDocs.forEach(doc => {
                console.log(chalk.yellow(`  ${doc.path}`));
            });
        } else {
            console.log(chalk.green('\n✅ 所有文档都有链接关联'));
        }
    }
}

// 运行分析
async function runAnalysis() {
    const analyzer = new DocumentAnalyzer('docs');
    
    try {
        await analyzer.generateReport();
        console.log(chalk.blue('\n✅ 分析完成！'));
    } catch (error) {
        console.error(chalk.red('分析过程出错:'), error);
        process.exit(1);
    }
}

if (require.main === module) {
    runAnalysis();
}

module.exports = DocumentAnalyzer;