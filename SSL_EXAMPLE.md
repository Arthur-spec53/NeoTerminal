# 🔒 HTTPS 配置示例演示

## 📺 完整操作流程演示

### 场景：为 `www.example.com` 配置 HTTPS

---

## 步骤演示

### 1️⃣ 运行部署脚本

```bash
$ cd /path/to/frontend
$ ./deploy.sh
```

输出：
```
═══════════════════════════════════════════════════════════════
  🚀 XBoard 前端一键部署脚本 v1.0.0
═══════════════════════════════════════════════════════════════

ℹ 检测到操作系统: ubuntu 22.04
✓ 前置条件检查通过

请选择部署方式:
  1) Nginx 部署 (推荐) - 自动配置 Nginx
  2) Docker 部署 - 容器化部署
  3) 简单部署 - 仅复制文件
  4) 查看部署信息
  5) 退出

请输入选项 [1-5]: 
```

**输入**: `1` (选择 Nginx 部署)

---

### 2️⃣ 输入域名

```
▶ 开始 Nginx 部署...
请输入域名 (例: www.example.com 或 localhost): 
```

**输入**: `www.example.com`

---

### 3️⃣ 配置路径和API

```
请输入网站根目录 (默认: /var/www/xboard): 
```

**输入**: `[直接回车]` (使用默认值)

```
请输入后端API地址 (默认: http://localhost:7001): 
```

**输入**: `[直接回车]` (使用默认值)

---

### 4️⃣ SSL 配置询问

```
ℹ 检测到您使用了真实域名: www.example.com
是否配置 HTTPS (SSL证书)？ [Y/n]: 
```

**输入**: `y` 或 `[回车]`

```
请输入您的邮箱地址 (用于SSL证书通知): 
```

**输入**: `admin@example.com`

---

### 5️⃣ 确认配置

```
ℹ ═══ 部署配置确认 ═══
域名: www.example.com
网站目录: /var/www/xboard
后端API: http://localhost:7001
HTTPS: 启用
邮箱: admin@example.com

确认以上配置无误？ [Y/n]: 
```

**输入**: `y` 或 `[回车]`

---

### 6️⃣ 自动部署过程

```
▶ 创建网站目录...
✓ 目录创建完成

▶ 复制文件到网站目录...
✓ 文件复制完成

▶ 生成 Nginx 配置...
✓ Nginx 配置文件已生成: nginx-xboard.conf

▶ 应用 Nginx 配置...
✓ 配置已应用

▶ 测试 Nginx 配置...
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
✓ Nginx 配置测试通过

▶ 重启 Nginx 服务...
✓ Nginx 已重启
✓ Nginx 服务运行正常
```

---

### 7️⃣ SSL 证书申请

```
▶ 开始配置 HTTPS...
✓ 检测到 Certbot 已安装
certbot 2.7.4

▶ 申请 SSL 证书...

▶ 验证域名解析...
ℹ 服务器IP: 203.0.113.10
ℹ 域名解析IP: 203.0.113.10
✓ 域名解析验证成功！

ℹ 使用 Let's Encrypt 申请证书...
ℹ 这可能需要几秒钟...

Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator webroot, Installer None
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for www.example.com
Using the webroot path /var/www/xboard for all unmatched domains.
Waiting for verification...
Cleaning up challenges

✓ SSL 证书申请成功！
ℹ 证书位置: /etc/letsencrypt/live/www.example.com/

▶ 生成 HTTPS 配置...
✓ HTTPS Nginx 配置文件已生成: nginx-xboard.conf

nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
✓ HTTPS 配置已应用

▶ 配置 SSL 证书自动续期...
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Processing /etc/letsencrypt/renewal/www.example.com.conf
Account registered.
Simulating renewal of an existing certificate for www.example.com
Congratulations, all renewals succeeded: 
  /etc/letsencrypt/live/www.example.com/fullchain.pem (success)
✓ SSL 证书自动续期配置成功
ℹ 证书将在到期前自动续期

✓ ═══ HTTPS 配置完成！ ═══
ℹ HTTPS 访问地址: https://www.example.com
ℹ HTTP 会自动重定向到 HTTPS
```

---

### 8️⃣ 部署完成

```
✓ ═══ Nginx 部署完成！ =══
ℹ 访问地址: https://www.example.com
ℹ 网站目录: /var/www/xboard
ℹ 配置文件: nginx-xboard.conf

⚠ 重要提示：
  请确保防火墙已开放以下端口：
  - 80 (HTTP)
  - 443 (HTTPS)

  常用命令：
  Ubuntu/Debian: sudo ufw allow 80/tcp && sudo ufw allow 443/tcp
  CentOS/RHEL:   sudo firewall-cmd --add-service=http --permanent
                 sudo firewall-cmd --add-service=https --permanent
                 sudo firewall-cmd --reload

是否继续其他操作？ [y/N]: 
```

**输入**: `n`

```
✓ 感谢使用 XBoard 部署脚本！
```

---

## 🎉 完成！访问测试

### 在浏览器中访问

**1. HTTPS 访问**
```
https://www.example.com
```

结果：
- ✅ 看到绿色小锁 🔒
- ✅ 地址栏显示"安全"
- ✅ 网站正常加载
- ✅ 证书有效

**2. HTTP 访问（自动跳转）**
```
http://www.example.com
```

结果：
- ✅ 自动跳转到 `https://www.example.com`

---

## 📊 验证配置

### 查看证书信息

```bash
$ sudo certbot certificates
```

输出：
```
Found the following certs:
  Certificate Name: www.example.com
    Serial Number: 3fb7d97bc72d820e88c52b9c3fb7d97b
    Key Type: RSA
    Domains: www.example.com
    Expiry Date: 2025-04-01 10:30:45+00:00 (VALID: 89 days)
    Certificate Path: /etc/letsencrypt/live/www.example.com/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/www.example.com/privkey.pem
```

### 测试 SSL 评分

访问：https://www.ssllabs.com/ssltest/

输入 `www.example.com`，结果：

```
Overall Rating: A+

Protocol Support:
✓ TLS 1.3
✓ TLS 1.2
✗ TLS 1.1 (disabled)
✗ TLS 1.0 (disabled)

Certificate:
✓ Valid and trusted
✓ Secure key size (RSA 2048 bits)
✓ Issued by Let's Encrypt

Configuration:
✓ HTTP Strict Transport Security (HSTS) enabled
✓ Certificate Transparency: Yes
✓ 0-RTT: Disabled (Secure)
```

---

## 📁 生成的文件

### Nginx 配置文件
`/etc/nginx/sites-enabled/xboard` (Ubuntu)  
`/etc/nginx/conf.d/xboard.conf` (CentOS)

内容摘要：
```nginx
# HTTP -> HTTPS 重定向
server {
    listen 80;
    server_name www.example.com;
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS 服务器
server {
    listen 443 ssl http2;
    server_name www.example.com;
    
    ssl_certificate /etc/letsencrypt/live/www.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.example.com/privkey.pem;
    
    # ... 其他配置
}
```

### SSL 证书文件
```
/etc/letsencrypt/live/www.example.com/
├── fullchain.pem       # 完整证书链
├── privkey.pem         # 私钥
├── cert.pem            # 证书
└── chain.pem           # 中间证书
```

### 自动续期配置
```
/etc/cron.d/certbot
```

内容：
```
0 */12 * * * root certbot renew --quiet
```

---

## 🔄 后续操作

### 1. 验证自动续期

90天后证书会自动续期，可以手动测试：

```bash
$ sudo certbot renew --dry-run
```

### 2. 监控证书状态

设置提醒，或定期检查：
```bash
$ sudo certbot certificates
```

### 3. 更新网站内容

重新构建并部署：
```bash
$ npm run build
$ ./deploy.sh
```

选择相同的配置，脚本会自动备份并更新文件。

---

## 💡 小贴士

1. **域名解析时间**: DNS 传播可能需要 5分钟 到 48小时
2. **证书申请限制**: Let's Encrypt 每周每域名最多申请 5 次
3. **多域名支持**: 可以为多个域名分别运行脚本
4. **子域名**: 支持子域名（如 `blog.example.com`）
5. **通配符证书**: 需要DNS验证，脚本目前不支持（可手动配置）

---

## 🎊 恭喜！

您已成功配置 HTTPS，现在您的网站：

✅ 使用 SSL/TLS 加密  
✅ 获得浏览器信任标识  
✅ 保护用户隐私数据  
✅ 提升SEO排名  
✅ 增强用户信任  

**总耗时**: 3-5 分钟（域名已解析的情况下）

**访问**: https://www.example.com 🚀

---

**需要帮助？** 查看 [SSL_GUIDE.md](./SSL_GUIDE.md) 完整文档

