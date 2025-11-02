# NeoTerminal 终极部署指南 v2.0

<sub>⚠️ **部署方式说明**：NeoTerminal 专注于 Nginx 部署，已针对 XBoard 后端的 API 和 CORS 配置进行优化。暂不提供 Docker 部署方案，如需容器化部署，请自行配置。</sub>

---

## 🎯 概述

NeoTerminal 提供**终极保姆级**的一键部署脚本，可以从**零生产环境**开始，自动完成所有配置和部署工作。

*终端美学，极客之选 - Terminal Aesthetics, Geek's Choice*

### ✨ 全新特性 v2.0

#### 1. **零环境部署**
- ✅ 自动检测并安装系统基础依赖 (curl, wget, git, gnupg等)
- ✅ 自动检测并安装/升级 Node.js (LTS版本)
- ✅ 自动安装 Nginx
- ✅ 自动安装 Certbot (SSL证书管理)

#### 2. **智能环境检测**
- ✅ 系统资源检查 (内存、磁盘空间、CPU)
- ✅ 网络连接测试
- ✅ 低内存自动创建 Swap
- ✅ 操作系统自动识别 (Ubuntu/Debian/CentOS/RHEL/Fedora)

#### 3. **系统自动优化**
- ✅ 时区自动配置 (Asia/Shanghai)
- ✅ 文件描述符限制优化
- ✅ 防火墙自动配置 (UFW/firewalld)
- ✅ 端口自动开放 (80, 443)

#### 4. **完整的部署流程**
- ✅ 自动构建项目 (npm install + build)
- ✅ Nginx 配置自动生成
- ✅ HTTPS 自动配置 (Let's Encrypt)
- ✅ 多域名支持
- ✅ SSL 证书自动续期

#### 5. **部署后验证**
- ✅ 健康检查 (5项检测)
  - Nginx 服务状态
  - Nginx 配置验证
  - 端口监听检查
  - 本地访问测试
  - 域名访问测试
- ✅ 自动生成部署报告
- ✅ 详细的系统信息汇总

#### 6. **维护功能**
- ✅ 一键卸载功能
- ✅ 部署信息查看
- ✅ 配置文件备份
- ✅ 详细的操作日志

---

## 🚀 快速开始

### 最简单的使用方式

```bash
# 1. 进入项目目录
cd /path/to/NeoTerminal

# 2. 给脚本添加执行权限
chmod +x deploy.sh

# 3. 运行脚本（推荐使用 root 或 sudo）
sudo ./deploy.sh
```

**就这么简单！** 脚本会自动完成以下所有工作：

1. ✅ 检查系统环境和资源
2. ✅ 安装所有必需的依赖
3. ✅ 配置系统优化
4. ✅ 安装和配置防火墙
5. ✅ 构建项目
6. ✅ 配置 Nginx
7. ✅ 申请 SSL 证书
8. ✅ 执行健康检查
9. ✅ 生成部署报告

---

## 📋 部署流程详解

### 阶段 1: 系统环境检查 (自动)

```
🔍 第一阶段: 系统环境检查
进度: [██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 20% - 检查运行权限
进度: [████████████████████░░░░░░░░░░░░░░░░░░░░] 40% - 检测操作系统
进度: [██████████████████████████████░░░░░░░░░░] 60% - 检查系统资源
进度: [████████████████████████████████████████] 80% - 检查网络连接
```

**脚本会自动检测：**
- 操作系统类型和版本
- CPU 核心数
- 内存大小和可用量
- 磁盘空间
- 网络连接状态
- Swap 空间（不足时自动创建）

### 阶段 2: 安装基础依赖 (自动)

```
📦 第二阶段: 安装基础依赖
✓ curl - 网络请求工具
✓ wget - 文件下载工具
✓ git - 版本控制
✓ dnsutils/bind-utils - DNS 工具
✓ ca-certificates - SSL 证书
✓ gnupg - 密钥管理
✓ build-essential - 编译工具
```

### 阶段 3: 系统配置优化 (自动)

```
⚙️  第三阶段: 系统配置优化
✓ 时区设置: Asia/Shanghai
✓ 文件描述符: 65535
✓ 进程数限制: 65535
✓ 防火墙配置: UFW/firewalld
✓ 端口开放: 80, 443
```

### 阶段 4: 项目构建准备 (自动)

```
🏗️  第四阶段: 项目构建准备
✓ Node.js 版本检查/安装
✓ npm 依赖安装
✓ 项目构建 (npm run build)
✓ 构建产物验证
```

### 阶段 5: 选择部署方式 (交互)

```
请选择操作:

  1) 全自动部署 (Nginx + HTTPS) [推荐]
  2) Docker 部署
  3) 简单部署 (仅复制文件)
  4) 查看部署信息
  5) 卸载 NeoTerminal
  6) 退出
```

### 阶段 6: Nginx 部署配置 (交互)

**您需要提供以下信息：**

1. **前端访问域名**
   ```
   单个域名: example.com
   多个域名: example.com www.example.com (用空格分隔)
   本地测试: localhost
   ```

2. **前端文件部署目录**
   ```
   默认: /var/www/xboard
   说明: 这是前端静态文件（HTML/CSS/JS）的存放位置
   ```

3. **后端 API 地址**
   ```
   默认: http://localhost:7001
   说明: 这是后端 API 服务的访问地址（XBoard 后端）
   ```

4. **HTTPS 配置**（可选）
   - 如果使用真实域名，会询问是否配置 HTTPS
   - 需要提供邮箱地址用于 SSL 证书通知
   - 自动申请 Let's Encrypt 免费证书
   - 自动配置证书续期

### 阶段 7: 部署后验证 (自动)

```
执行部署后健康检查...

[1/5] 检查 Nginx 服务状态...
  ✓ Nginx 服务正在运行

[2/5] 检查 Nginx 配置...
  ✓ Nginx 配置有效

[3/5] 检查端口监听...
  ✓ 端口 80 正在监听
  ✓ 端口 443 正在监听

[4/5] 测试本地访问...
  ✓ 本地访问正常 (HTTP 200)

[5/5] 测试域名访问...
  ✓ 域名访问正常 (https://example.com/)

健康检查结果: 5/5 通过
✓ 所有检查通过！部署成功！
```

### 阶段 8: 生成部署报告 (自动)

脚本会自动生成详细的部署报告，包含：

- 系统信息（OS、内存、磁盘、CPU）
- 部署配置（域名、路径、API地址）
- 已安装组件版本
- 配置文件位置
- 访问信息
- 管理命令
- 重要提示

报告文件: `deployment-report-YYYYMMDD-HHMMSS.txt`

---

## 💻 命令行参数

```bash
# 查看帮助
./deploy.sh --help

# 查看版本
./deploy.sh --version

# 一键卸载
./deploy.sh --uninstall
```

---

## 🔧 高级功能

### 1. 多域名配置

支持为一个站点配置多个域名（SAN证书）：

```
请输入前端访问域名: example.com www.example.com api.example.com
```

所有域名将：
- 共享同一个 Nginx 配置
- 使用同一个 SSL 证书
- 指向相同的网站目录

### 2. 自动 Swap 创建

如果系统内存 < 512MB 且 Swap < 1GB，脚本会提示创建 2GB Swap：

```
系统内存较低 (< 512MB)，可能影响编译速度
Swap 空间不足 (< 1GB)
是否自动创建 2GB Swap？ [Y/n]: y

创建 2GB Swap 空间...
✓ Swap 创建完成
```

### 3. 防火墙自动配置

脚本会自动检测并配置防火墙：

**UFW (Ubuntu/Debian):**
```bash
ufw allow 22/tcp comment "SSH"
ufw allow 80/tcp comment "XBoard Frontend"
ufw allow 443/tcp comment "XBoard Frontend"
ufw enable
```

**firewalld (CentOS/RHEL):**
```bash
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload
```

### 4. 一键卸载

```bash
sudo ./deploy.sh --uninstall
```

卸载向导会询问是否删除：
- Nginx 配置文件 ✓
- 网站文件 (可选)
- 备份文件 (可选)
- SSL 证书 (可选)

**注意：** 不会卸载 Nginx、Node.js 等系统软件

---

## 📊 部署报告示例

```
═══════════════════════════════════════════════════════════════════════
  NeoTerminal 部署报告
═══════════════════════════════════════════════════════════════════════

生成时间: 2025-11-02 15:30:45 CST
部署耗时: 8分32秒

─────────────────────────────────────────────────────────────────────
📋 系统信息
─────────────────────────────────────────────────────────────────────

操作系统: ubuntu 22.04
内核版本: 5.15.0-72-generic
主机名: xboard-server
CPU 核心: 4
总内存: 8.0G
可用内存: 5.2G
磁盘空间: 45G 可用

─────────────────────────────────────────────────────────────────────
🚀 部署配置
─────────────────────────────────────────────────────────────────────

访问域名: example.com www.example.com
网站根目录: /var/www/xboard
后端API: https://api.example.com
HTTPS: 已启用

─────────────────────────────────────────────────────────────────────
📦 已安装组件
─────────────────────────────────────────────────────────────────────

Node.js: v20.10.0
npm: 10.2.3
Nginx: 1.24.0
Certbot: certbot 2.7.4
Git: 2.34.1

─────────────────────────────────────────────────────────────────────
🌐 访问信息
─────────────────────────────────────────────────────────────────────

前端访问: https://example.com
API 代理: https://example.com/api/

─────────────────────────────────────────────────────────────────────
📝 重要提示
─────────────────────────────────────────────────────────────────────

1. 确保后端服务运行在: https://api.example.com
   测试命令: curl https://api.example.com/api/v1/guest/comm/config

2. SSL 证书自动续期已配置
   测试续期: sudo certbot renew --dry-run

3. 管理命令:
   重启 Nginx:   sudo systemctl restart nginx
   查看状态:     sudo systemctl status nginx
   测试配置:     sudo nginx -t
   卸载前端:     /path/to/deploy.sh --uninstall
```

---

## 🛠️ 故障排除

### 问题 1: 脚本执行失败

**解决方案:**
```bash
# 1. 检查权限
ls -l deploy.sh

# 2. 添加执行权限
chmod +x deploy.sh

# 3. 使用 root 或 sudo 运行
sudo ./deploy.sh

# 4. 查看错误日志
cat deploy.log
```

### 问题 2: Node.js 版本过低

**脚本会自动处理，无需手动操作。**

如果自动升级失败：
```bash
# 手动安装 Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 问题 3: 构建失败

**可能原因:**
- 磁盘空间不足
- 内存不足
- 网络问题

**解决方案:**
```bash
# 1. 清理磁盘
sudo apt-get clean
sudo apt-get autoremove

# 2. 创建 Swap (如果内存不足)
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 3. 手动构建
cd /path/to/frontend
npm install
npm run build
```

### 问题 4: SSL 证书申请失败

**可能原因:**
- 域名未解析到服务器
- 80 端口未开放
- 防火墙阻止

**解决方案:**
```bash
# 1. 验证域名解析
dig +short yourdomain.com

# 2. 检查 80 端口
sudo netstat -tuln | grep :80

# 3. 测试防火墙
sudo ufw status
# 或
sudo firewall-cmd --list-all

# 4. 手动申请证书
sudo certbot certonly --webroot -w /var/www/xboard \
  -d yourdomain.com -d www.yourdomain.com \
  --email your@email.com --agree-tos
```

### 问题 5: 部署后无法访问

**检查清单:**

1. **Nginx 服务状态**
   ```bash
   sudo systemctl status nginx
   ```

2. **Nginx 配置**
   ```bash
   sudo nginx -t
   ```

3. **端口监听**
   ```bash
   sudo netstat -tuln | grep -E ':(80|443)'
   ```

4. **防火墙规则**
   ```bash
   sudo ufw status
   ```

5. **测试本地访问**
   ```bash
   curl -I http://localhost/
   ```

6. **查看错误日志**
   ```bash
   sudo tail -f /var/log/nginx/xboard-error.log
   ```

---

## 📞 技术支持

### 日志文件位置

- **部署日志:** `./deploy.log`
- **Nginx 访问日志:** `/var/log/nginx/xboard-access.log`
- **Nginx 错误日志:** `/var/log/nginx/xboard-error.log`

### 常用命令

```bash
# 查看 Nginx 状态
sudo systemctl status nginx

# 重启 Nginx
sudo systemctl restart nginx

# 测试 Nginx 配置
sudo nginx -t

# 查看 Nginx 配置
cat /etc/nginx/sites-available/xboard
# 或
cat /etc/nginx/conf.d/xboard.conf

# 查看实时访问日志
sudo tail -f /var/log/nginx/xboard-access.log

# 查看实时错误日志
sudo tail -f /var/log/nginx/xboard-error.log

# 测试 SSL 证书续期
sudo certbot renew --dry-run

# 查看已安装的证书
sudo certbot certificates
```

---

## 🎉 总结

这个终极保姆级部署脚本可以：

✅ **零配置** - 从全新系统开始，无需任何准备
✅ **全自动** - 自动安装依赖、配置系统、部署应用
✅ **智能化** - 自动检测环境、优化配置、处理异常
✅ **专业级** - HTTPS、多域名、健康检查、部署报告
✅ **易维护** - 一键卸载、详细日志、完整文档

**真正实现"一键部署"！** 🚀

---

## 📝 更新日志

### v2.0.0 (2025-11-02)

**重大更新：**
- ✨ 全新的零环境部署能力
- ✨ 智能环境检测和资源管理
- ✨ 系统自动优化和防火墙配置
- ✨ 部署后健康检查
- ✨ 自动生成部署报告
- ✨ 一键卸载功能
- ✨ 进度条显示
- ✨ 命令行参数支持

**改进：**
- 📈 更好的错误处理
- 📈 更详细的日志记录
- 📈 更友好的交互界面
- 📈 更完善的文档

### v1.0.0 (2025-10-28)

- 🎉 初始版本发布
- ✅ 基础部署功能
- ✅ Nginx 配置
- ✅ SSL 证书支持
- ✅ 多域名支持

---

**享受您的 NeoTerminal 部署之旅！** 🎊  
*终端美学，极客之选 - Terminal Aesthetics, Geek's Choice*

