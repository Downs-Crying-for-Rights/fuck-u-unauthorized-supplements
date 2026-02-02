# 学生举报补课模拟器

> [!WARNING]
> 本项目仅供娱乐目的，**严禁模仿其中内容以用于任何形式的非法活动或恶意举报**。游戏中的内容和情节均为虚构，不代表任何真实事件或人物。玩家应理性对待游戏内容，不应该将游戏中的行为直接应用于现实生活，在现实生活中遇到类似情况时，请咨询专业人士。**开发者对任何因使用本项目而造成的直接或间接后果不承担任何责任！**

> [!IMPORTANT]
> 本项目大部分内容使用氛围编程（Vibe Coding）实现。
---

## 项目介绍

这是一个关于识别和处理学校违规补课的互动小游戏，使用 React + TypeScript + Vite 构建。本项目旨在通过游戏化的方式，帮助玩家了解如何识别和应对违规补课，提高学生和家长的合法权益保护意识。游戏包含多个难度级别，玩家需要收集证据、分析情况并做出正确的决策。

### 游戏功能

（有一部分是饼）
- **多个难度级别**：根据玩家的经验水平选择合适的挑战
- **证据收集**：在游戏过程中收集有关补课的证据
- **AI 辅助**：获取 AI 提供的策略、证据和渠道建议
- **时间管理**：通过"等待一天"功能推进游戏进程
- **报告提交**：根据收集的证据提交分析报告
- **游戏状态跟踪**：实时显示游戏状态和进度

### 游戏玩法

1. **开始游戏**：在主界面选择难度级别并启用/禁用 AI 辅助
2. **收集证据**：点击相关区域收集证据
3. **分析情况**：根据收集的证据分析补课的合法性
4. **获取建议**：使用 AI 辅助功能获取策略建议
5. **提交报告**：根据分析结果提交报告
6. **等待结果**：点击"等待一天"查看报告结果
7. **完成游戏**：根据最终结果查看游戏结束界面

## 项目开发
### 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- React Hook Form
- Zod
- GSAP (动画)

### 项目结构

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

## 贡献指南

### 如何提交 Issue

如果您有关于本项目的任何建议、问题或反馈，请通过以下方式提交 Issue：

1. **功能请求**：描述您希望添加的新功能及其用途
2. **Bug 报告**：提供清晰的复现步骤和错误信息
3. **改进建议**：分享您对现有功能的优化建议

**提交 Issue 时的注意事项：**
- 请先搜索现有的 Issue，避免重复
- 提供清晰的标题和详细的描述
- 如果是 Bug，提供复现步骤和环境信息（浏览器、操作系统等）

您也可以选择填写 DCR 的[反馈表单](https://downscryingforrights.feishu.cn/share/base/form/shrcnMoalsQV228hJ2WLOvuKutb)来反馈问题和提供建议！

### 如何提交 Pull Request

我们非常欢迎社区贡献代码！请按照以下步骤提交 PR：

#### 1. Fork 项目
- 点击 GitHub 页面右上角的 "Fork" 按钮
- 将项目克隆到您的本地环境

#### 2. 创建功能分支
```bash
git checkout -b feature/your-feature-name
```

#### 3. 开发和测试
- 遵循项目的代码风格和规范
- 确保所有测试通过
- 运行 `npm run lint` 检查代码质量
- 运行 `npm run build` 确保构建成功

#### 4. 提交代码
```bash
git add .
git commit -m "feat: 添加新功能描述"
```

**提交信息规范（[约定式提交](https://www.conventionalcommits.org/)）：**
- `feat:` - 新功能
- `fix:` - 修复 Bug
- `docs:` - 文档更新
- `style:` - 代码格式调整（不影响功能）
- `refactor:` - 重构
- `perf:` - 性能优化
- `test:` - 测试相关
- `chore:` - 构建过程或辅助工具的变动

#### 5. 推送到远程仓库
```bash
git push origin feature/your-feature-name
```

#### 6. 提交 Pull Request
- 在 GitHub 上创建 Pull Request
- 填写清晰的 PR 标题和描述
- 说明您的更改内容和目的
- 等待代码审查

### 代码规范

#### TypeScript 规范
- 所有文件都应使用 TypeScript
- 遵循 TypeScript 最佳实践
- 使用严格模式（strict mode）

#### React 规范
- 使用函数组件和 Hooks
- 遵循 React 18+ 最佳实践
- 使用 React Hook Form 进行表单处理
- 使用 Zod 进行数据验证

#### 样式规范
- 使用 Tailwind CSS 进行样式开发
- 遵循 Tailwind 最佳实践
- 保持样式类名的一致性

#### 文件命名规范
- 组件文件使用 PascalCase（如 GameSection.tsx）
- 工具函数文件使用 camelCase（如 utils.ts）
- 类型定义文件使用 PascalCase（如 game.ts）

### 开发流程

1. **开发前**：阅读项目文档，了解技术栈和架构
2. **开发中**：遵循代码规范，保持代码整洁
3. **开发后**：运行测试和 lint 检查，确保代码质量
4. **提交前**：确保所有功能正常工作，构建成功

### 我们欢迎的贡献

- 🎮 新游戏功能和玩法
- 🎨 UI/UX 改进
- 📝 文档完善
- 🔧 Bug 修复
- 🚀 性能优化
- 📱 移动端适配
- 🌐 多语言支持（虽然似乎用处不那么大）

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 联系我们

