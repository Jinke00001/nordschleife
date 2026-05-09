# Nordschleife Project Workbench

这个文件夹用于把对话中完成的工作沉淀成可继续维护的项目资料。

它不参与网站构建，不会影响 `src/` 里的页面、样式或数据。它的用途是：

- 快速理解项目结构
- 记录当前内容状态
- 规划下一阶段工作
- 给 Codex / Claude Code / 人工协作者提供交接上下文
- 保存本地运行、构建、部署命令

## 推荐阅读顺序

1. `project-overview.md`：项目目标、技术栈、页面结构
2. `content-status.md`：弯角、品牌、车型内容现状
3. `workflow.md`：本地开发、构建、部署和协作流程
4. `next-steps.md`：后续优先级
5. `handoff-prompt.md`：给其他 AI 工具接手时使用的提示词

## 快速开始

```bash
cd ~/Desktop/纽北赛道
npm run dev
```

浏览器打开 http://127.0.0.1:5173/ 即可查看。

构建检查：

```bash
npm run build
```

