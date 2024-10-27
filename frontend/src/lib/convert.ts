// @/lib/convert.ts
// 核心代码
// 转换层的函数，用于预将笔记转换成metaHtml，或者将metaHtml转换成编辑器可用的markdown


'use client';

import { Note} from '@/types/note_model';
import DOMPurify from 'dompurify';




// 将笔记的转换成包含元数据的html
export const convertNoteToMetaHtml = (note: Note): string => {
    // 检查note是否存在
    if (!note) return '';
    // 处理标题
    const titleHtml = note.title
        ? `<h2 class="noo-title-text">${DOMPurify.sanitize(note.title)}</h2>`
        : '';
    // 处理内容    
    const contentHtml = note.html_text
        ? `<div class="noo-content">${DOMPurify.sanitize(note.html_text)}</div>`
        : '';
    // 处理标签 - 检查tags是否为数组且存在length属性
    const tagsHtml = Array.isArray(note.tags) && note.tags.length
        ? `<div class="tags">${note.tags.map(tag => `<span>#${tag}</span>`).join('')}</div>`
        : '';
    return `${titleHtml}${contentHtml}${tagsHtml}`.trim();
};




//把纯文本转换成html
export function convertTextToMetaHtml(text: string, title: string): string {
    // 1. 按行分割
    const lines = text.trim().split('\n');
    if (lines.length === 0) return '';
    // 2. 提取标签（最后一行）和内容
    let tags: string[] = [];
    let contentLines = [...lines];
    const lastLine = lines[lines.length - 1].trim();
    if (lastLine.split(/\s+/).every(word => word.startsWith('#'))) {
        tags = lastLine.split(/\s+/);
        contentLines.pop(); // 移除最后一行标签
    }
    // 3. HTML转义
    const escapeHtml = (str: string) => {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };
    // 4. 处理标题和内容
    const escapedTitle = escapeHtml(title);
    const escapedContent = escapeHtml(contentLines.join('\n'));
    // 5. 处理 {{}} 语法
    const processBrackets = (text: string) => {
        return text.replace(/(?:\{\{|\｛\｛)(.+?)(?:\}\}|\｝\｝)/g, '<strong>$1</strong>');
    };
    // 6. 构建HTML结构
    const titleHtml = `<h2 class="noo-title-text">${processBrackets(escapedTitle)}</h2>`;
    const contentHtml = contentLines.length
        ? `<div class="noo-content">${processBrackets(escapedContent).replace(/\n/g, '<br>')}</div>`
        : '';
    const tagsHtml = tags.length
        ? `<div class="tags">${tags.map(tag => `<span>${tag}</span>`).join('')}</div>`
        : '';
    // 7. 组合并返回最终的HTML
    const rawHtml = `
        ${titleHtml}
        ${contentHtml}
        ${tagsHtml}
    `;
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);
    return simplifyHtml(sanitizedHtml);
}




// 将笔记转换为纯文本，用于检索和预览
export function convertNoteToPlainText(note: Note): string {
    if (!note) return '';
    const parts: string[] = [];
    // 添加标题
    if (note.title) {
        parts.push(note.title);
    }
    // 添加内容
    if (note.html_text) {
        // 使用现有的DOMPurify清理HTML
        const sanitizedHtml = DOMPurify.sanitize(note.html_text);
        // 创建临时DOM元素
        const temp = document.createElement('div');
        temp.innerHTML = sanitizedHtml;
        // 替换换行元素为实际换行
        const brs = temp.getElementsByTagName('br');
        for (const br of Array.from(brs)) {
            br.replaceWith('\n');
        }
        // 移除所有HTML标签，保留纯文本
        const content = temp.textContent || temp.innerText || '';
        // 处理{{}}语法，保留其中的文本
        const processedContent = content.replace(
            /(?:\{\{|\｛\｛)(.+?)(?:\}\}|\｝\｝)/g,
            '$1'
        );
        parts.push(processedContent);
    }
    // 添加标签
    if (note.tags && note.tags.length > 0) {
        parts.push(note.tags.map(tag => `#${tag}`).join(' '));
    }
    // 合并所有部分并清理格式
    return parts
        .join('\n')
        .replace(/\n{3,}/g, '\n') // 将连续3个以上换行替换为2个
        .trim();
}




// 辅助函数：清理和简化 HTML
const simplifyHtml = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 保留原格式的标签列表
    const preserveTags = new Set([
        'pre',
        'code',
        'textarea',
        'script',
        'style',
        'kbd',
        'samp',
        'var'
    ]);

    const processNode = (node: Node): void => {
        // 检查是否在需要保留格式的标签内
        const isInPreserveTag = (node: Node): boolean => {
            let parent = node.parentElement;
            while (parent) {
                if (preserveTags.has(parent.tagName.toLowerCase())) {
                    return true;
                }
                parent = parent.parentElement;
            }
            return false;
        };

        // 如果在保留格式的标签内，跳过处理
        if (isInPreserveTag(node)) {
            return;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = node.textContent?.trim() || '';
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // 如果当前元素是保留格式的标签，跳过处理
            if (!preserveTags.has(element.tagName.toLowerCase())) {
                Array.from(element.childNodes).forEach(child => {
                    if (child.nodeType === Node.TEXT_NODE && 
                        child.textContent?.trim() === '') {
                        element.removeChild(child);
                    } else {
                        processNode(child);
                    }
                });

                // 移除空的段落
                if (element.tagName.toLowerCase() === 'p' && 
                    element.innerHTML.trim() === '') {
                    element.parentNode?.removeChild(element);
                }
            }
        }
    };

    processNode(doc.body);
    return doc.body.innerHTML;
};