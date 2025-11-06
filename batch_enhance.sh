#!/bin/bash
# 天机爻Wiki文档批量增强脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 显示使用说明
show_usage() {
    echo -e "${BLUE}天机爻Wiki文档增强工具${NC}"
    echo ""
    echo "使用方法:"
    echo "  $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -k, --api-key KEY     DeepSeek API密钥"
    echo "  -m, --mode MODE       模式: enhance|create|analyze"
    echo "  -t, --type TYPE       文档类型: bazi|ziwei|ai|all"
    echo "  -l, --length LENGTH   目标文档长度 (默认: 3000)"
    echo "  -d, --docs-path PATH  文档目录 (默认: docs)"
    echo "  -h, --help           显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 -k YOUR_API_KEY -m enhance -t bazi"
    echo "  $0 -k YOUR_API_KEY -m create -t ziwei"
    echo "  $0 -k YOUR_API_KEY -m analyze"
}

# 检查依赖
check_dependencies() {
    echo -e "${BLUE}检查依赖...${NC}"
    
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}错误: 未找到python3${NC}"
        exit 1
    fi
    
    # 检查Python包
    python3 -c "import requests, yaml" 2>/dev/null || {
        echo -e "${YELLOW}安装依赖包...${NC}"
        pip3 install requests pyyaml
    }
    
    echo -e "${GREEN}依赖检查完成${NC}"
}

# 分析现有文档
analyze_docs() {
    local docs_path=$1
    
    echo -e "${BLUE}分析现有文档结构...${NC}"
    
    echo "📊 文档统计:"
    echo "总文档数: $(find $docs_path -name "*.md" | wc -l)"
    echo "八字相关: $(find $docs_path -path "*/bazi/*" -name "*.md" | wc -l)"
    echo "紫微相关: $(find $docs_path -path "*/ziwei/*" -name "*.md" | wc -l)"
    echo "AI相关: $(find $docs_path -path "*/ai/*" -name "*.md" | wc -l)"
    
    echo ""
    echo "📄 现有文档列表:"
    find $docs_path -name "*.md" -not -path "*/.*" | sort
    
    echo ""
    echo "📝 文档字数统计:"
    for file in $(find $docs_path -name "*.md" -not -path "*/.*"); do
        word_count=$(wc -c < "$file")
        echo "$(basename $file): ${word_count} 字符"
    done
}

# 增强特定类型的文档
enhance_by_type() {
    local api_key=$1
    local doc_type=$2
    local docs_path=$3
    local length=$4
    
    echo -e "${BLUE}增强 ${doc_type} 类型文档...${NC}"
    
    case $doc_type in
        "bazi")
            path_pattern="$docs_path/bazi/*.md"
            ;;
        "ziwei")
            path_pattern="$docs_path/ziwei/*.md"
            ;;
        "ai")
            path_pattern="$docs_path/ai/*.md"
            ;;
        "all")
            path_pattern="$docs_path/**/*.md"
            ;;
        *)
            echo -e "${RED}错误: 不支持的文档类型 $doc_type${NC}"
            exit 1
            ;;
    esac
    
    # 获取匹配的文件
    files=$(find $docs_path -name "*.md" | grep -E "(bazi|ziwei|ai)" | head -10)
    
    if [ -z "$files" ]; then
        echo -e "${YELLOW}未找到匹配的文档${NC}"
        return
    fi
    
    echo "准备处理以下文件:"
    echo "$files"
    
    echo ""
    read -p "确认继续? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        echo "取消操作"
        return
    fi
    
    # 调用Python脚本
    python3 enhance_docs.py \
        --api-key "$api_key" \
        --action enhance \
        --docs-path "$docs_path" \
        --length "$length"
}

# 创建新文档的交互式流程
create_interactive() {
    local api_key=$1
    local docs_path=$2
    local length=$3
    
    echo -e "${BLUE}交互式创建新文档${NC}"
    
    # 获取文档标题
    read -p "请输入文档标题: " title
    if [ -z "$title" ]; then
        echo -e "${RED}标题不能为空${NC}"
        exit 1
    fi
    
    # 选择文档类型
    echo "请选择文档类型:"
    echo "1) 八字命理"
    echo "2) 紫微斗数"  
    echo "3) AI玄学"
    read -p "请输入选择 (1-3): " type_choice
    
    case $type_choice in
        1) doc_type="八字命理"; subdir="bazi" ;;
        2) doc_type="紫微斗数"; subdir="ziwei" ;;
        3) doc_type="AI玄学"; subdir="ai" ;;
        *) echo -e "${RED}无效选择${NC}"; exit 1 ;;
    esac
    
    # 生成文件名
    filename=$(echo "$title" | sed 's/[^a-zA-Z0-9\u4e00-\u9fa5]/_/g' | tr '[:upper:]' '[:lower:]').md
    output_path="$docs_path/$subdir/$filename"
    
    echo ""
    echo "文档信息预览:"
    echo "标题: $title"
    echo "类型: $doc_type"
    echo "输出路径: $output_path"
    echo "目标长度: $length 字"
    
    echo ""
    read -p "确认创建? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        echo "取消操作"
        return
    fi
    
    # 调用Python脚本创建文档
    python3 enhance_docs.py \
        --api-key "$api_key" \
        --action create \
        --title "$title" \
        --type "$doc_type" \
        --output "$output_path" \
        --length "$length"
}

# 备份现有文档
backup_docs() {
    local docs_path=$1
    local backup_dir="backup_$(date +%Y%m%d_%H%M%S)"
    
    echo -e "${BLUE}创建文档备份...${NC}"
    
    cp -r "$docs_path" "$backup_dir"
    echo -e "${GREEN}备份完成: $backup_dir${NC}"
}

# 主函数
main() {
    local api_key=""
    local mode="enhance"
    local doc_type="all"
    local length=3000
    local docs_path="docs"
    
    # 解析命令行参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -k|--api-key)
                api_key="$2"
                shift 2
                ;;
            -m|--mode)
                mode="$2"
                shift 2
                ;;
            -t|--type)
                doc_type="$2"
                shift 2
                ;;
            -l|--length)
                length="$2"
                shift 2
                ;;
            -d|--docs-path)
                docs_path="$2"
                shift 2
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                echo -e "${RED}未知选项: $1${NC}"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # 检查必需参数
    if [ -z "$api_key" ] && [ "$mode" != "analyze" ]; then
        echo -e "${RED}错误: 需要提供API密钥${NC}"
        show_usage
        exit 1
    fi
    
    # 检查文档目录
    if [ ! -d "$docs_path" ]; then
        echo -e "${RED}错误: 文档目录不存在 $docs_path${NC}"
        exit 1
    fi
    
    # 检查依赖
    check_dependencies
    
    echo -e "${GREEN}开始执行模式: $mode${NC}"
    
    case $mode in
        "analyze")
            analyze_docs "$docs_path"
            ;;
        "enhance")
            backup_docs "$docs_path"
            enhance_by_type "$api_key" "$doc_type" "$docs_path" "$length"
            ;;
        "create")
            create_interactive "$api_key" "$docs_path" "$length"
            ;;
        *)
            echo -e "${RED}错误: 不支持的模式 $mode${NC}"
            show_usage
            exit 1
            ;;
    esac
    
    echo -e "${GREEN}操作完成!${NC}"
}

# 执行主函数
main "$@"