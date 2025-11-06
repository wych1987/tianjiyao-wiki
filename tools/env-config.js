/**
 * 环境配置管理
 */

const fs = require('fs');
const path = require('path');

class EnvConfig {
    constructor() {
        this.config = {};
        this.loadConfig();
    }

    /**
     * 加载配置文件
     */
    loadConfig() {
        // 尝试加载不同的环境文件
        const envFiles = [
            '.env.local',
            '.env',
            'env.local'
        ];

        for (const envFile of envFiles) {
            const envPath = path.join(process.cwd(), envFile);
            if (fs.existsSync(envPath)) {
                try {
                    const envContent = fs.readFileSync(envPath, 'utf8');
                    this.parseEnvContent(envContent);
                    console.log(`✅ 已加载环境配置: ${envFile}`);
                    break;
                } catch (error) {
                    console.warn(`⚠️ 读取环境文件失败: ${envFile}`, error.message);
                }
            }
        }

        // 同时读取系统环境变量
        Object.assign(this.config, process.env);
    }

    /**
     * 解析环境文件内容
     */
    parseEnvContent(content) {
        const lines = content.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            
            // 跳过空行和注释
            if (!trimmed || trimmed.startsWith('#')) {
                continue;
            }

            // 解析 KEY=VALUE 格式
            const match = trimmed.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                let value = match[2].trim();
                
                // 移除引号
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                this.config[key] = value;
            }
        }
    }

    /**
     * 获取配置值
     */
    get(key, defaultValue = null) {
        return this.config[key] || defaultValue;
    }

    /**
     * 检查配置是否存在
     */
    has(key) {
        return key in this.config && this.config[key] !== '';
    }

    /**
     * 获取DeepSeek API密钥
     */
    getDeepSeekApiKey() {
        const keys = [
            'DEEPSEEK_API_KEY',
            'DEEPSEEK_KEY',
            'API_KEY'
        ];

        for (const key of keys) {
            if (this.has(key)) {
                return this.get(key);
            }
        }

        return null;
    }

    /**
     * 显示配置状态
     */
    showStatus() {
        console.log('\n🔧 环境配置状态:');
        
        const apiKey = this.getDeepSeekApiKey();
        if (apiKey) {
            const maskedKey = apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 4);
            console.log(`✅ DeepSeek API Key: ${maskedKey}`);
        } else {
            console.log('❌ 未找到 DeepSeek API Key');
            console.log('   请检查以下环境变量是否设置:');
            console.log('   - DEEPSEEK_API_KEY');
            console.log('   - DEEPSEEK_KEY');
            console.log('   - API_KEY');
        }
    }
}

// 创建全局配置实例
const envConfig = new EnvConfig();

module.exports = envConfig;