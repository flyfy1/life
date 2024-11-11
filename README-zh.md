# 笔记同步应用

这是一个基于 React 和 TypeScript 开发的笔记同步应用，支持在线和离线使用。

## 主要功能

- 用户认证登录
- 笔记在线同步
- 离线存储支持
- Markdown 内容渲染
- 按时间范围筛选笔记
- 支持按创建时间/修改时间排序
- 响应式界面设计

## 技术栈

- React 18
- TypeScript 4
- IndexedDB (通过 idb 库实现)
- React Markdown
- CSS3

## 开发环境要求

- Node.js >= 16
- npm >= 8

## 安装和运行

1. 克隆项目并安装依赖：

```bash
git clone [项目地址]
cd [项目目录]
npm install
```

2. 启动开发服务器：

```bash
npm start
```

应用将在 http://localhost:3000 运行

## 项目结构

```
src/
  ├── components/      # React 组件
  ├── services/        # API 和数据库服务
  ├── styles/          # CSS 样式文件
  ├── types/          # TypeScript 类型定义
  ├── utils/          # 工具函数
  └── App.tsx         # 应用入口组件
```

## 主要功能说明

### 用户认证
- 支持用户名密码登录
- JWT token 认证
- 登录状态持久化

### 笔记同步
- 自动定期同步（每5分钟）
- 支持手动触发同步
- 离线优先策略

### 数据存储
- 使用 IndexedDB 实现本地存储
- 支持离线访问和编辑
- 数据同步冲突处理

### 界面功能
- 支持按日期范围筛选笔记
- 支持按创建时间/修改时间排序
- Markdown 内容实时渲染
- 响应式设计，适配移动端

## API 配置

默认 API 地址为 `http://localhost:8080`，可以在 `src/services/api.ts` 中修改 `API_BASE` 配置。

## 构建部署

执行以下命令构建生产版本：

```bash
npm run build
```

构建后的文件将生成在 `build` 目录中，可直接部署到静态服务器。

## 开发相关

### 可用的命令

```bash
npm start      # 启动开发服务器
npm test      # 运行测试
npm run build  # 构建生产版本
npm run eject  # 暴露配置文件
```

### 代码规范

项目使用 TypeScript 严格模式，确保类型安全。

## 许可证

本项目采用 MIT 许可证。