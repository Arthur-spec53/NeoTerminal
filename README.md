# 🚀 XBoard 前端 - 黑客风格主题

<div align="center">

![Vue 3](https://img.shields.io/badge/Vue-3.5.22-brightgreen.svg)
![Vite](https://img.shields.io/badge/Vite-7.1.12-646CFF.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

**现代化的 VPN 订阅管理系统前端 | 一键部署 | HTTPS自动配置**

[在线演示](#) | [快速开始](#-快速开始) | [部署文档](#-部署) | [功能特性](#-功能特性)

<sub>⚠️ 本项目仅为前端主题，需配合 [XBoard 后端](https://github.com/cedar2025/Xboard) 使用。推荐使用 Nginx 部署，暂不提供 Docker 部署方案。详见 [DEPLOYMENT_NOTE.md](./DEPLOYMENT_NOTE.md)</sub>

</div>

---

## 📖 简介

XBoard 前端是一个基于 Vue 3 的现代化 VPN 订阅管理系统前端，采用赛博朋克/黑客风格设计，提供完整的用户管理、订阅管理、节点管理等功能。

### ✨ 主要特点

- 🎨 **黑客风格设计** - Matrix 雨背景、CRT 扫描线效果、霓虹绿主题
- 🚀 **一键部署** - 保姆级部署脚本，支持 Linux 和 Windows
- 🔒 **HTTPS 自动配置** - 自动申请 Let's Encrypt 证书，A+ 级 SSL 配置
- ⚡ **极致性能** - 代码分割、Gzip 压缩（75%）、懒加载
- 🛡️ **安全加固** - Token 加密、CSP 策略、API 签名
- 🌐 **完整功能** - 用户认证、订阅管理、流量统计、工单系统

---

## 🎯 功能特性

### 核心功能

- ✅ **用户系统**
  - 登录 / 注册 / 找回密码
  - 个人中心
  - 邮箱验证

- ✅ **订阅管理**
  - 一键订阅（支持 Clash、V2rayN、Sing-Box、Shadowrocket、Surge、Quantumult X）
  - 节点列表
  - 流量统计（7天趋势图）
  - 订单管理

- ✅ **增值功能**
  - 工单系统
  - 邀请管理
  - 系统公告
  - 使用文档

### 技术特性

- 🎨 **黑客风格主题**
  - Matrix 雨动画背景
  - CRT 扫描线效果
  - 终端风格交互
  - 霓虹绿色主题

- 🔒 **企业级安全**
  - 代码混淆和压缩
  - Token 加密存储
  - Content Security Policy (CSP)
  - API 请求签名
  - XSS/CSRF 防护
  - TLS 1.2/1.3

- ⚡ **性能优化**
  - 代码分割（按路由）
  - Tree Shaking
  - Gzip 压缩（75%）
  - 静态资源缓存
  - 懒加载

---

## 🚀 快速开始

### 生产部署（推荐）

**真正的一键部署，无需任何前置条件！** 🎉

```bash
# 克隆仓库
git clone https://github.com/Arthur-spec53/xboard-frontend.git
cd xboard-frontend

# 运行部署脚本（会自动安装所有依赖）
chmod +x deploy.sh
./deploy.sh
```

脚本会自动：
- ✅ 检测并安装 Node.js（如果没有）
- ✅ 安装项目依赖
- ✅ 构建生产版本
- ✅ 安装和配置 Nginx
- ✅ 可选：申请 SSL 证书

### 开发环境

```bash
# 克隆仓库
git clone https://github.com/Arthur-spec53/xboard-frontend.git
cd xboard-frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

---

## 📦 部署

### 方式 1: 一键部署脚本（推荐）⭐

**🎉 无需任何前置条件！脚本会自动安装所有依赖！**

**Linux 用户：**
```bash
# 克隆项目
git clone https://github.com/Arthur-spec53/xboard-frontend.git
cd xboard-frontend

# 运行部署脚本（仅此一步！）
chmod +x deploy.sh && ./deploy.sh
```

**Windows 用户：**
```powershell
# 克隆项目
git clone https://github.com/Arthur-spec53/xboard-frontend.git
cd xboard-frontend

# 以管理员身份运行 PowerShell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\deploy.ps1
```

部署脚本会自动：
- ✅ 检测并安装 Node.js（LTS 版本）
- ✅ 安装项目依赖 (npm install)
- ✅ 构建生产版本 (npm run build)
- ✅ 安装并配置 Nginx/IIS
- ✅ 申请 SSL 证书（可选，Let's Encrypt）
- ✅ 配置 HTTPS 和安全头
- ✅ 设置证书自动续期

**真正的保姆级部署，零门槛！** 🚀

### 方式 2: Docker 部署

```bash
# 使用 Docker Compose
docker-compose up -d
```

### 方式 3: 手动部署

参考 [DEPLOYMENT.md](./DEPLOYMENT.md) 详细文档。

---

## 🔒 HTTPS 配置

### 自动申请 SSL 证书

部署脚本支持自动申请 Let's Encrypt 免费证书：

1. 确保域名已解析到服务器
2. 运行 `./deploy.sh`
3. 选择 Nginx 部署
4. 输入域名并确认配置 HTTPS
5. 输入邮箱地址
6. 等待自动完成！

**结果：**
- 🔒 A+ 级 SSL 配置
- 🔒 HTTP 自动跳转 HTTPS
- 🔒 证书自动续期（90天）

详细说明请查看 [SSL_GUIDE.md](./SSL_GUIDE.md)。

---

## 📚 文档

- 📖 [快速开始指南](./QUICK_START.md) - 新手必读
- 🔒 [HTTPS 配置指南](./SSL_GUIDE.md) - SSL 证书配置
- 📖 [部署文档](./DEPLOYMENT.md) - 详细部署说明
- 📊 [构建信息](./BUILD_INFO.txt) - 技术细节
- 📦 [交付清单](./DELIVERY.md) - 完整功能列表

---

## 🛠️ 技术栈

### 核心框架
- **Vue 3.5.22** - Composition API
- **TypeScript 5.9.3** - 类型安全
- **Vite 7.1.12** - 构建工具
- **Pinia 3.0.3** - 状态管理
- **Vue Router 4.6.3** - 路由管理

### UI 和工具
- **Axios 1.13.1** - HTTP 客户端
- **@vueuse/core 14.0.0** - 组合式工具集
- **dayjs 1.11.18** - 日期处理

### 开发工具
- **Terser** - 代码混淆
- **PostCSS** - CSS 处理
- **Autoprefixer** - CSS 前缀

---

## 📊 项目结构

```
xboard-frontend/
├── src/
│   ├── api/              # API 接口
│   ├── assets/           # 静态资源
│   ├── components/       # 组件
│   │   ├── common/       # 通用组件
│   │   ├── effects/      # 特效组件
│   │   └── layout/       # 布局组件
│   ├── router/           # 路由配置
│   ├── stores/           # 状态管理
│   ├── styles/           # 样式文件
│   ├── types/            # TypeScript 类型
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── public/               # 公共资源
├── deploy.sh             # Linux 部署脚本
├── deploy.ps1            # Windows 部署脚本
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目配置
```

---

## 🎨 主题特色

### 黑客风格设计

- **Matrix 雨背景** - 经典的 Matrix 代码雨动画
- **CRT 扫描线** - 复古 CRT 显示器扫描线效果
- **终端提示符** - 仿 Linux 终端的交互界面
- **霓虹绿主题** - 赛博朋克风格的绿色主题
- **代码风格** - 等宽字体、字符动画

### 视觉效果

```
user@奇库~ $ █

[>] 系统初始化...
[✓] 连接已建立
[!] 数据加载中...
```

---

## 🔧 配置

### API 地址配置

开发环境通过 Vite 代理配置：

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:7001',
      changeOrigin: true
    }
  }
}
```

生产环境通过 Nginx 反向代理。

### 环境变量

创建 `.env.local` 文件（可选）：

```env
VITE_API_BASE_URL=http://localhost:7001
```

---

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

### 开发流程

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 使用 TypeScript
- 遵循 Vue 3 Composition API 风格
- 组件名使用 PascalCase
- 文件名使用 kebab-case

---

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](./LICENSE) 文件。

---

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Let's Encrypt](https://letsencrypt.org/) - 免费 SSL 证书
- [Matrix Digital Rain](https://en.wikipedia.org/wiki/Matrix_digital_rain) - 设计灵感

---

## 📞 支持

- 📖 [文档](./QUICK_START.md)
- 🐛 [问题反馈](https://github.com/your-username/xboard-frontend/issues)
- 💬 [讨论区](https://github.com/your-username/xboard-frontend/discussions)

---

## 🌟 Star History

如果这个项目对您有帮助，请给个 Star ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=your-username/xboard-frontend&type=Date)](https://star-history.com/#your-username/xboard-frontend&Date)

---

<div align="center">

**用 ❤️ 制作 | Powered by Vue 3 & Vite**

[⬆ 回到顶部](#-xboard-前端---黑客风格主题)

</div>
