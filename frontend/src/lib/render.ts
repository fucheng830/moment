// @/lib/render.ts
// 渲染笔记的metaHtml
// 渲染笔记为HTML,携带参数可以设置是否隐藏strong内容，可以为strong内容占位符

import { Note, NoteType } from '@/types/note_model';
import { convertNoteToMetaHtml } from '@/lib/convert';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import ruby from 'highlight.js/lib/languages/ruby';
import php from 'highlight.js/lib/languages/php';
import swift from 'highlight.js/lib/languages/swift';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import sql from 'highlight.js/lib/languages/sql';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('php', php);
hljs.registerLanguage('swift', swift);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('sql', sql);


//控制笔记的渲染行为
export interface RenderOptions {
    showTags?: boolean;
    enableHighlight?: boolean;//是否启用代码高亮
}

export interface StrippedRenderOptions {
    contentPlaceholder?: string;    // 内容整体挖空的占位符
    strippedPlaceholder?: string;   // 局部挖空的占位符
    showTags?: boolean;            // 是否显示标签
    enableHighlight?: boolean;     // 是否启用代码高亮
}


// 渲染笔记
export function renderNote(
    note: Note,
    renderOptions: RenderOptions = { showTags: true, enableHighlight: true }
): string {
    let metaHtml = convertNoteToMetaHtml(note);
    if (!renderOptions.showTags) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(metaHtml, 'text/html');
        const tagsDiv = doc.querySelector('.tags');
        if (tagsDiv) {
            tagsDiv.remove();
        }
        metaHtml = doc.body.innerHTML;
    }
    return processMetaHtml(metaHtml, renderOptions.enableHighlight);
}



// 添加enableHighlight参数
export function processMetaHtml(metaHtml: string, enableHighlight: boolean = true): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(metaHtml, 'text/html');
    // 处理标签<span>，类名为tag
    doc.querySelectorAll('.tags span').forEach(tag => {
        tag.classList.add('cursor-pointer', 'hover:opacity-80');
    });
    // 处理代码块,类名为code-block
    doc.querySelectorAll('pre code').forEach((block) => {
        const pre = block.parentElement;
        if (!pre) return;
        // 转换 pre 为代码块容器
        pre.className = 'code-block';
        // 获取语言类名
        const langClass = Array.from(block.classList)
            .find(className => className.startsWith('language-'));
        const language = langClass ? langClass.replace('language-', '') : 'text';
        // 创建代码块头部
        const header = doc.createElement('div');
        header.className = 'code-header';
        // 语言标识
        const langSpan = doc.createElement('span');
        langSpan.className = 'language text-code-comment';
        langSpan.textContent = `// ${language}`;
        header.appendChild(langSpan);
        // 复制按钮容器
        const copyButton = doc.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<span class="copy-text">copy</span>';
        header.appendChild(copyButton);
        pre.insertBefore(header, block);
        // 启用代码高亮
        if (enableHighlight) {
            hljs.highlightElement(block as HTMLElement);
        }
    });
    return doc.body.innerHTML;
}

