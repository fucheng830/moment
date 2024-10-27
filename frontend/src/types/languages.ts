// @/types/languages.ts
// 翻译框架，默认中文


"use client";

export type Language = {
  code: string;
};

export const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'zh' },
];


export function getClientDefaultLanguage(): Language {
  return   { code: 'zh' };
}