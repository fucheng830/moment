// @/lib/parse.ts
// 辅助函数：转义HTML特殊字符

export function escapeHtml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


//从文本的最后一行提取标签，文本的最后一行如果以#开头就认为是标签行，否则返回空数组
export function extractTags(text: string): { text: string; tags: string[] } {
    const lines = text.split('\n');
    const tagSet = new Set<string>(); // 使用 Set 来存储标签
    const lastLine = lines[lines.length - 1].trim();
    if (lastLine.startsWith('#')) {
        const tagMatches = lastLine.match(/#[\w\u4e00-\u9fa5-]+/g);
        if (tagMatches) {
            tagMatches.forEach(tag => tagSet.add(tag.slice(1))); // 移除#符号
            lines.pop();
        }
    }
    while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
        lines.pop();
    }
    return {
        text: lines.join('\n'),
        tags: Array.from(tagSet) // 将 Set 转换回数组
    };
}


