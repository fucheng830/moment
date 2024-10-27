# Moment

## 项目简介
Moment 是一款基于FSRS算法的闪卡学习工具

## 主要技术栈
 React
 Vite
 TypeScript 
 Tailwind CSS
 Shadcn UI components

## 环境配置

安装依赖包、本地启动与构建
npm install 
npm run dev
npm run build


## 目录说明

### out 存放构建结果,静态页面，入口是index.html


### 核心文件

- App.tsx 单页应用主页
- config.ts 全局配置
- PageContent.tsx  单页应用中控制页面显示的路由，类似于router

### 主要目录

- /styles 存放样式文件
- /pages 存放页面级组件
- /components 存放所有的非页面级组件
- /crossplatform 跨平台API
- /lib 函数仓库
- /context 全局状态管理
- /hooks 自定义hooks
- /types 类型定义文件
- /locales 本地化文件
- /utils 工具函数仓库

### 层级结构，总体分为三级结构，分为是存储层，服务层和上下文，组件直接访问上下文层

存储层
- /storage 存放本地数据,包括localStorage、indexedDB
- /repo 负责数据读写

服务层
- /service 组合repo层的，提供操作数据服务

上下文，
- /context 存放全局状态管理
- /context/notecontext 提供本地所有的笔记相关的数据