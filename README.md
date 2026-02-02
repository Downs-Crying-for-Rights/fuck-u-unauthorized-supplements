# 学生举报补课模拟器

> [!WARNING]
> 本项目仅供娱乐目的，**严禁模仿其中内容以用于任何形式的非法活动或恶意举报**。游戏中的内容和情节均为虚构，不代表任何真实事件或人物。玩家应理性对待游戏内容，不应该将游戏中的行为直接应用于现实生活，在现实生活中遇到类似情况时，请咨询专业人士。**开发者对任何因使用本项目而造成的直接或间接后果不承担任何责任！**

> [!IMPORTANT]
> 本项目大部分内容使用氛围编程（Vibe Coding）实现。
---

## 项目简介

这是一个关于识别和处理学校违规补课的互动小游戏，使用 React + TypeScript + Vite 构建。本项目旨在通过游戏化的方式，帮助玩家了解如何识别和应对违规补课，提高学生和家长的合法权益保护意识。游戏包含多个难度级别，玩家需要收集证据、分析情况并做出正确的决策。

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- React Hook Form
- Zod
- GSAP (动画)

## 项目结构

```
src/
├── components/
│   ├── ui/           # UI 组件库
│   └── Changelog.tsx # 变更日志组件
├── hooks/
│   ├── use-mobile.ts    # 移动端检测钩子
│   └── useGameLogic.ts  # 游戏逻辑钩子
├── lib/
│   └── utils.ts     # 工具函数
├── sections/
│   ├── HeroSection.tsx  # 游戏开始界面
│   ├── GameSection.tsx  # 游戏主界面
│   └── EndSection.tsx   # 游戏结束界面
├── types/
│   └── game.ts      # 游戏类型定义
├── App.tsx          # 主应用组件
├── main.tsx         # 应用入口
└── index.css        # 全局样式
```

## 游戏功能

- **多个难度级别**：根据玩家的经验水平选择合适的挑战
- **证据收集**：在游戏过程中收集有关补课的证据
- **AI 辅助**：获取 AI 提供的策略、证据和渠道建议
- **时间管理**：通过"等待一天"功能推进游戏进程
- **报告提交**：根据收集的证据提交分析报告
- **游戏状态跟踪**：实时显示游戏状态和进度

## 开始游戏

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 游戏玩法

1. **开始游戏**：在主界面选择难度级别并启用/禁用 AI 辅助
2. **收集证据**：点击相关区域收集证据
3. **分析情况**：根据收集的证据分析补课的合法性
4. **获取建议**：使用 AI 辅助功能获取策略建议
5. **提交报告**：根据分析结果提交报告
6. **等待结果**：点击"等待一天"查看报告结果
7. **完成游戏**：根据最终结果查看游戏结束界面

## 贡献指南

欢迎提交问题和改进建议！请确保遵循以下步骤：

1. Fork 本仓库
2. 创建新分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 联系方式

如果您有任何建议，或需要反馈问题，请提交 Issue ，或填写 DCR 的[反馈表单](https://downscryingforrights.feishu.cn/share/base/form/shrcnMoalsQV228hJ2WLOvuKutb)
---

**注意**：本游戏仅用于娱乐目的，不构成法律建议。在现实生活中遇到类似情况时，请咨询专业人士。