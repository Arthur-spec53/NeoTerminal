# 📦 NeoTerminal 终极部署脚本 v2.0

<sub>⚠️ **部署说明**：NeoTerminal 推荐使用 Nginx 部署方式，已针对 XBoard 后端进行优化配置。暂不提供 Docker 部署方案。</sub>

---

> **从零生产环境到完整部署 - 真正的一键完成！**  
> *终端美学，极客之选*

## 🎯 核心特性

### ✨ 真正的"零环境"部署

```bash
# 就这三步！
chmod +x deploy.sh
sudo ./deploy.sh
# 坐等完成 ☕
```

**脚本会自动完成以下所有工作：**

| 阶段 | 内容 | 耗时 |
|-----|------|------|
| 🔍 环境检查 | 系统资源、网络、操作系统检测 | ~30秒 |
| 📦 安装依赖 | curl、wget、git、Node.js、Nginx | ~2分钟 |
| ⚙️  系统优化 | 时区、防火墙、文件限制 | ~1分钟 |
| 🏗️  项目构建 | npm install + npm run build | ~3分钟 |
| 🌐 Nginx部署 | 配置生成、SSL证书申请 | ~2分钟 |
| ✅ 健康检查 | 5项服务验证 | ~10秒 |
| 📝 生成报告 | 完整部署信息汇总 | ~5秒 |

**总耗时：约8-10分钟**（取决于网络速度和服务器性能）

---

## 🚀 快速开始

### 方式一：完全自动（推荐）

```bash
cd /path/to/NeoTerminal
chmod +x deploy.sh
sudo ./deploy.sh
```

### 方式二：指定参数（高级）

```bash
# 查看帮助
./deploy.sh --help

# 查看版本
./deploy.sh --version

# 一键卸载
./deploy.sh --uninstall
```

---

## 📋 部署过程示意

```
════════════════════════════════════════════════════════════════
  🚀 NeoTerminal 终极部署脚本 v2.0.0
  📦 从零环境到生产部署 - 全自动
════════════════════════════════════════════════════════════════

🔍 第一阶段: 系统环境检查
进度: [██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 20% - 检查运行权限
✓ 检测到操作系统: ubuntu 22.04
✓ 系统内存: 8192MB (可用: 5234MB)
✓ 可用磁盘空间: 45GB
✓ CPU 核心数: 4
✓ 网络连接正常

📦 第二阶段: 安装基础依赖
✓ curl - 已安装
✓ wget - 已安装
✓ git - 已安装
✓ Node.js v20.10.0 - 已安装
✓ npm 10.2.3 - 已安装

⚙️  第三阶段: 系统配置优化
✓ 时区已设置为 Asia/Shanghai
✓ 文件描述符限制已优化
✓ UFW 防火墙已配置
✓ 已开放端口: 80 (HTTP), 443 (HTTPS)

🏗️  第四阶段: 项目构建准备
✓ package.json - 已找到
✓ npm install - 完成
✓ npm run build - 完成
✓ 构建文件: 245 个，总大小: 3.2M

════════════════════════════════════════════════════════════════

请选择操作:

  1) 全自动部署 (Nginx + HTTPS) [推荐]
  2) Docker 部署
  3) 简单部署 (仅复制文件)
  4) 查看部署信息
  5) 卸载 NeoTerminal
  6) 退出

请输入选项 [1-6]: 1

════════════════════════════════════════════════════════════════
开始 Nginx 部署...
════════════════════════════════════════════════════════════════

═══ 前后端分离架构说明 ═══

本系统采用前后端分离架构:
  • 前端: 静态文件（HTML/CSS/JS）由 Nginx 直接服务
  • 后端: API 服务，通过反向代理访问

域名配置：
  - 单个域名: example.com
  - 多个域名: example.com www.example.com (用空格分隔)
  - 本地测试: localhost

请输入前端访问域名: example.com www.example.com

前端部署目录配置：
  这是前端静态文件（HTML/CSS/JS）的存放位置
  Nginx 会从这个目录读取并服务前端文件

前端文件部署目录 (默认: /var/www/xboard): 

后端 API 配置：
  这是后端 API 服务的访问地址（XBoard 后端）
  Nginx 会将 /api/* 请求代理到此地址

后端 API 地址 (默认: http://localhost:7001): https://api.oddhouses.com

检测到您使用了真实域名: example.com www.example.com
是否配置 HTTPS (SSL证书)？ [Y/n]: y

请输入您的邮箱地址 (用于SSL证书通知): admin@example.com

═══ 部署配置确认 ═══

前端配置:
  访问域名: example.com www.example.com
  部署目录: /var/www/xboard (前端静态文件)

后端配置:
  API 地址: https://api.oddhouses.com (后端服务)
  代理规则: /api/* → https://api.oddhouses.com/api/*

HTTPS: 启用
邮箱: admin@example.com

架构说明:
  • 用户访问 example.com → Nginx 返回前端静态文件
  • 前端调用 /api/* → Nginx 代理到 https://api.oddhouses.com

确认以上配置无误？ [Y/n]: y

▶ 创建网站目录...
✓ 文件复制完成

▶ 生成 Nginx 配置...
✓ Nginx 配置文件已生成: ./nginx-xboard.conf

▶ 应用 Nginx 配置...
▶ 测试 Nginx 配置...
✓ Nginx 配置测试通过

▶ 重启 Nginx 服务...
✓ Nginx 已重启
✓ Nginx 服务运行正常

▶ 开始配置 HTTPS...
✓ Certbot 已安装

▶ 申请 SSL 证书...
ℹ 验证主域名: example.com
✓ 域名解析验证成功！
ℹ 包含域名: example.com
ℹ 包含域名: www.example.com
ℹ 使用 Let's Encrypt 申请证书...
✓ SSL 证书申请成功！
ℹ 证书位置: /etc/letsencrypt/live/example.com/
✓ 证书涵盖以下域名: example.com www.example.com

▶ 生成 HTTPS 配置...
✓ HTTPS 配置已应用

▶ 配置 SSL 证书自动续期...
✓ SSL 证书自动续期配置成功

═══ HTTPS 配置完成！ ═══
ℹ HTTPS 访问地址: https://example.com
ℹ 所有域名: example.com www.example.com
ℹ HTTP 会自动重定向到 HTTPS

════════════════════════════════════════════════════════════════

═══ Nginx 部署完成！ ===

▶ 执行部署后健康检查...

ℹ [1/5] 检查 Nginx 服务状态...
  ✓ Nginx 服务正在运行

ℹ [2/5] 检查 Nginx 配置...
  ✓ Nginx 配置有效

ℹ [3/5] 检查端口监听...
  ✓ 端口 80 正在监听
  ✓ 端口 443 正在监听

ℹ [4/5] 测试本地访问...
  ✓ 本地访问正常 (HTTP 200)

ℹ [5/5] 测试域名访问...
  ✓ 域名访问正常 (https://example.com/)

ℹ 健康检查结果: 5/5 通过
✓ 所有检查通过！部署成功！

▶ 生成部署报告...
✓ 部署报告已生成: deployment-report-20251102-153245.txt

════════════════════════════════════════════════════════════════

✓ 🎉 部署全部完成！

ℹ 快速访问:
  🌐 前端: https://example.com
  🔌 API: https://example.com/api/

ℹ 管理命令:
  查看日志: sudo tail -f /var/log/nginx/xboard-access.log
  重启服务: sudo systemctl restart nginx
  卸载前端: ./deploy.sh --uninstall

════════════════════════════════════════════════════════════════
```

---

## 🌟 v2.0 新特性详解

### 1. 零环境自动安装

**不需要任何前置准备！**

| 组件 | 自动检测 | 自动安装 | 自动升级 |
|------|---------|---------|---------|
| curl | ✅ | ✅ | - |
| wget | ✅ | ✅ | - |
| git | ✅ | ✅ | - |
| Node.js | ✅ | ✅ | ✅ (到LTS) |
| npm | ✅ | ✅ | ✅ |
| Nginx | ✅ | ✅ | - |
| Certbot | ✅ | ✅ | - |
| dnsutils | ✅ | ✅ | - |

### 2. 智能环境检测

```
✅ 系统资源评估
  - 内存: 检查并提示，低内存自动创建Swap
  - 磁盘: 至少2GB可用，推荐5GB+
  - CPU: 显示核心数，优化构建速度

✅ 网络连接测试
  - Google.com
  - GitHub.com
  - npmjs.org

✅ 操作系统识别
  - Ubuntu / Debian
  - CentOS / RHEL
  - Fedora
```

### 3. 系统自动优化

```bash
# 时区配置
timedatectl set-timezone Asia/Shanghai

# 文件描述符优化
* soft nofile 65535
* hard nofile 65535
* soft nproc 65535
* hard nproc 65535

# 防火墙配置 (自动识别 UFW/firewalld)
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

### 4. 部署后健康检查

**5项全面检测：**

1. ✅ Nginx 服务状态
2. ✅ Nginx 配置有效性
3. ✅ 端口监听 (80, 443)
4. ✅ 本地访问测试
5. ✅ 域名访问测试

### 5. 详细部署报告

自动生成包含以下内容的报告：

- 📋 系统信息 (OS、CPU、内存、磁盘)
- 🚀 部署配置 (域名、路径、API)
- 📦 已安装组件版本
- 🔧 配置文件位置
- 🌐 访问信息
- 📝 管理命令
- ⚡ 重要提示

### 6. 一键卸载功能

```bash
./deploy.sh --uninstall
```

安全卸载，可选删除：
- ✅ Nginx 配置文件
- 🔲 网站文件 (可选)
- 🔲 备份文件 (可选)
- 🔲 SSL 证书 (可选)

**不会卸载系统软件 (Nginx、Node.js等)**

---

## 💡 常见使用场景

### 场景 1: 全新 VPS 部署

```bash
# 1. 连接到服务器
ssh root@your-server-ip

# 2. 克隆项目
git clone https://github.com/your/xboard-frontend.git
cd xboard-frontend

# 3. 一键部署
chmod +x deploy.sh
./deploy.sh

# 完成！🎉
```

### 场景 2: 多域名配置

```
请输入前端访问域名: example.com www.example.com api.example.com
```

所有域名将共享：
- 同一个 Nginx 配置
- 同一个 SSL 证书 (SAN)
- 同一个网站目录

### 场景 3: 本地开发测试

```bash
# 使用 localhost
请输入前端访问域名: localhost

# 访问
http://localhost/
```

### 场景 4: 现有项目升级

```bash
# 脚本会自动备份现有文件
# 备份位置: ./backups/backup-YYYYMMDD-HHMMSS/

# 如需回滚
sudo cp -r backups/backup-20251102-153000/* /var/www/xboard/
sudo systemctl restart nginx
```

---

## 🔧 高级配置

### 自定义配置文件位置

**Debian/Ubuntu:**
```
/etc/nginx/sites-available/xboard
/etc/nginx/sites-enabled/xboard -> ../sites-available/xboard
```

**CentOS/RHEL:**
```
/etc/nginx/conf.d/xboard.conf
```

### 手动修改配置

```bash
# 1. 编辑配置
sudo nano /etc/nginx/sites-available/xboard

# 2. 测试配置
sudo nginx -t

# 3. 重启服务
sudo systemctl restart nginx
```

### SSL 证书续期

**自动续期已配置**

测试续期：
```bash
sudo certbot renew --dry-run
```

手动续期：
```bash
sudo certbot renew
sudo systemctl reload nginx
```

---

## ⚠️ 注意事项

### 1. 运行权限

**建议使用 root 或 sudo：**

```bash
# 方式1：使用 sudo
sudo ./deploy.sh

# 方式2：切换到 root
sudo su -
cd /path/to/NeoTerminal
./deploy.sh
```

### 2. 域名解析

**在申请 SSL 证书前：**

1. 确保域名已解析到服务器
2. 等待 DNS 传播 (可能需要几分钟到几小时)
3. 验证解析：`dig +short yourdomain.com`

### 3. 防火墙

**确保以下端口开放：**

- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)

**云服务器**（阿里云、腾讯云等）还需在控制台配置安全组规则。

### 4. 后端 API

**确保后端服务正常运行：**

```bash
# 测试后端 API
curl https://api.oddhouses.com/api/v1/guest/comm/config
```

---

## 📚 更多资源

- [完整部署指南](./DEPLOY_GUIDE.md) - 详细的部署文档和故障排除
- [项目 README](./README.md) - 项目介绍和开发文档
- [部署日志](./deploy.log) - 实时部署日志
- [Nginx 文档](https://nginx.org/en/docs/) - Nginx 官方文档
- [Let's Encrypt](https://letsencrypt.org/) - 免费 SSL 证书

---

## 🎉 总结

### 为什么选择这个脚本？

| 特性 | 传统部署 | 本脚本 |
|------|---------|--------|
| 环境准备 | ❌ 需要手动安装 | ✅ 全自动 |
| 依赖安装 | ❌ 逐个安装 | ✅ 智能检测 |
| 系统配置 | ❌ 手动优化 | ✅ 自动优化 |
| 防火墙 | ❌ 手动配置 | ✅ 自动配置 |
| Nginx | ❌ 手动编写配置 | ✅ 自动生成 |
| SSL | ❌ 手动申请 | ✅ 自动申请 |
| 验证 | ❌ 无 | ✅ 5项检查 |
| 报告 | ❌ 无 | ✅ 详细报告 |
| 卸载 | ❌ 手动清理 | ✅ 一键卸载 |
| 耗时 | ⏱️ 30-60分钟 | ⏱️ 8-10分钟 |

### 适用人群

- ✅ 零基础小白 - 无需任何 Linux 经验
- ✅ 运维人员 - 快速批量部署
- ✅ 开发者 - 专注业务开发
- ✅ 项目经理 - 快速交付演示

---

**🚀 现在就开始您的一键部署之旅吧！**

```bash
chmod +x deploy.sh && sudo ./deploy.sh
```

---

## 📞 获取帮助

遇到问题？

1. 📖 查看 [完整文档](./DEPLOY_GUIDE.md)
2. 📝 检查 [部署日志](./deploy.log)
3. 🔍 查看 [Nginx 日志](/var/log/nginx/xboard-error.log)
4. 💬 提交 Issue 或联系技术支持

**祝您部署顺利！** 🎊

