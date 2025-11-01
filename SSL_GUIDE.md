# 🔒 XBoard HTTPS (SSL) 自动配置指南

> **一键申请Let's Encrypt免费SSL证书，自动配置HTTPS！**

---

## ✨ 功能特点

✅ **全自动申请** - 无需手动操作  
✅ **免费证书** - Let's Encrypt 提供  
✅ **自动续期** - 90天自动续期  
✅ **域名验证** - 自动检测域名解析  
✅ **HTTP重定向** - HTTP自动跳转HTTPS  
✅ **A+级安全** - 现代TLS配置  

---

## 📋 前置要求

### 必须满足以下条件：

1. **✅ 拥有域名**
   - 已购买域名（例：example.com）
   - 可以是主域名或子域名（www.example.com）

2. **✅ 域名已解析**
   - 域名的 A 记录指向您的服务器 IP
   - DNS 解析已生效（可能需要几分钟到几小时）

3. **✅ 端口已开放**
   - 端口 80 (HTTP) 必须开放
   - 端口 443 (HTTPS) 必须开放
   - 服务器防火墙已配置

4. **✅ 有效邮箱**
   - 用于接收证书到期通知
   - 用于 Let's Encrypt 账户注册

---

## 🚀 快速开始

### 步骤 1: 解析域名

在您的域名管理面板中，添加 A 记录：

```
类型：A
主机记录：@ 或 www
记录值：您的服务器IP地址
TTL：默认或10分钟
```

**验证解析是否生效：**

```bash
# Linux/Mac
dig +short your-domain.com

# Windows
nslookup your-domain.com

# 应该返回您的服务器IP
```

### 步骤 2: 开放防火墙端口

**Ubuntu/Debian:**
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

**CentOS/RHEL:**
```bash
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --add-service=https --permanent
sudo firewall-cmd --reload
```

### 步骤 3: 运行部署脚本

```bash
./deploy.sh
```

### 步骤 4: 按提示操作

#### 1. 选择 Nginx 部署
```
请选择部署方式:
  1) Nginx 部署 (推荐)
  ...
请输入选项 [1-5]: 1
```

#### 2. 输入域名
```
请输入域名 (例: www.example.com 或 localhost): your-domain.com
```
⚠️ **注意**：输入已解析的真实域名，不要用 localhost！

#### 3. 其他配置（可以用默认值）
```
请输入网站根目录 (默认: /var/www/xboard): [直接回车]
请输入后端API地址 (默认: http://localhost:7001): [直接回车]
```

#### 4. SSL 配置
```
检测到您使用了真实域名: your-domain.com
是否配置 HTTPS (SSL证书)？ [Y/n]: y
```

#### 5. 输入邮箱
```
请输入您的邮箱地址 (用于SSL证书通知): your-email@example.com
```

#### 6. 确认配置
```
═══ 部署配置确认 ═══
域名: your-domain.com
网站目录: /var/www/xboard
后端API: http://localhost:7001
HTTPS: 启用
邮箱: your-email@example.com

确认以上配置无误？ [Y/n]: y
```

#### 7. 等待完成
脚本会自动：
- ✅ 复制文件
- ✅ 配置 Nginx
- ✅ 验证域名解析
- ✅ 申请 SSL 证书
- ✅ 配置 HTTPS
- ✅ 设置自动续期

#### 8. 完成！
```
✓ HTTPS 配置完成！
ℹ HTTPS 访问地址: https://your-domain.com
ℹ HTTP 会自动重定向到 HTTPS
```

---

## 🎯 自动完成的配置

脚本会自动配置以下内容：

### 1. SSL 证书申请
- 使用 Let's Encrypt 免费证书
- 有效期 90 天
- 自动验证域名所有权

### 2. Nginx HTTPS 配置
```nginx
# HTTP -> HTTPS 重定向
server {
    listen 80;
    server_name your-domain.com;
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS 服务器
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # 现代 TLS 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256...';
    
    # ... 其他配置
}
```

### 3. 安全头配置
- `Strict-Transport-Security` - 强制 HTTPS
- `X-Frame-Options` - 防止点击劫持
- `X-Content-Type-Options` - 防止 MIME 嗅探
- `X-XSS-Protection` - XSS 防护

### 4. 自动续期
- 系统自动任务（cron）
- 证书到期前自动续期
- 无需手动操作

---

## 🔍 验证 HTTPS 配置

### 1. 浏览器测试
访问 `https://your-domain.com`：
- ✅ 看到绿色小锁图标
- ✅ 地址栏显示"安全"或"已保护"
- ✅ 证书有效

### 2. 命令行测试
```bash
# 测试 HTTPS
curl -I https://your-domain.com

# 测试 HTTP 重定向
curl -I http://your-domain.com
# 应该返回 301 或 302 重定向
```

### 3. SSL 评分测试
访问：https://www.ssllabs.com/ssltest/

输入您的域名，应该获得 **A 或 A+** 评分！

---

## ❓ 常见问题

### Q1: 域名解析未生效怎么办？

**A:** 
DNS 传播需要时间（几分钟到48小时）。

**检查方法：**
```bash
dig +short your-domain.com @8.8.8.8
```

如果返回正确的 IP，解析已生效。否则请等待。

---

### Q2: 证书申请失败

**可能原因：**

1. **域名未解析到服务器**
   ```bash
   # 检查域名解析
   dig +short your-domain.com
   ```

2. **80端口未开放**
   ```bash
   # 检查端口
   sudo netstat -tulpn | grep :80
   sudo ufw status  # Ubuntu
   sudo firewall-cmd --list-all  # CentOS
   ```

3. **Nginx 未运行**
   ```bash
   sudo systemctl status nginx
   ```

4. **已存在其他证书**
   ```bash
   # 删除旧证书
   sudo certbot delete -d your-domain.com
   ```

---

### Q3: HTTP 没有自动跳转 HTTPS

**检查 Nginx 配置：**
```bash
sudo nginx -t
sudo cat /etc/nginx/sites-enabled/xboard  # Ubuntu
sudo cat /etc/nginx/conf.d/xboard.conf    # CentOS
```

应该看到：
```nginx
location / {
    return 301 https://$server_name$request_uri;
}
```

**重启 Nginx：**
```bash
sudo systemctl restart nginx
```

---

### Q4: 证书快到期了怎么办？

**A:** 不用担心！证书会**自动续期**。

**手动测试续期：**
```bash
sudo certbot renew --dry-run
```

**手动强制续期：**
```bash
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

---

### Q5: 如何为多个域名申请证书？

**方法 1: 分别运行脚本**
为每个域名分别运行部署脚本。

**方法 2: 手动添加**
```bash
sudo certbot --nginx -d example.com -d www.example.com
```

---

### Q6: 如何查看证书信息？

```bash
# 列出所有证书
sudo certbot certificates

# 查看证书详情
sudo openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -text -noout
```

---

## 🛠️ 手动操作（如果自动失败）

### 手动申请证书

```bash
# 1. 安装 certbot
sudo apt install certbot python3-certbot-nginx  # Ubuntu
sudo yum install certbot python3-certbot-nginx  # CentOS

# 2. 申请证书
sudo certbot --nginx -d your-domain.com

# 3. 测试自动续期
sudo certbot renew --dry-run
```

### 手动配置 Nginx

1. 编辑配置文件：
   ```bash
   sudo nano /etc/nginx/sites-available/xboard
   ```

2. 添加 HTTPS 配置（参考脚本生成的配置）

3. 测试并重启：
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

---

## 📊 证书管理

### 查看证书状态
```bash
sudo certbot certificates
```

输出示例：
```
Found the following certs:
  Certificate Name: your-domain.com
    Domains: your-domain.com
    Expiry Date: 2025-04-01 12:34:56+00:00 (VALID: 89 days)
    Certificate Path: /etc/letsencrypt/live/your-domain.com/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/your-domain.com/privkey.pem
```

### 撤销证书
```bash
sudo certbot revoke --cert-path /etc/letsencrypt/live/your-domain.com/cert.pem
```

### 删除证书
```bash
sudo certbot delete --cert-name your-domain.com
```

---

## 🔐 安全最佳实践

### 1. 强制 HTTPS
✅ 已自动配置 HTTP -> HTTPS 重定向

### 2. HSTS（HTTP严格传输安全）
✅ 已自动配置：
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

### 3. 现代 TLS 配置
✅ 仅支持 TLS 1.2 和 TLS 1.3
✅ 使用安全的加密套件

### 4. 定期更新
```bash
# 更新 certbot
sudo apt update && sudo apt upgrade certbot  # Ubuntu
sudo yum update certbot  # CentOS
```

---

## 📞 获取帮助

### 查看日志

**Certbot 日志：**
```bash
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

**Nginx 错误日志：**
```bash
sudo tail -f /var/log/nginx/error.log
```

### 常用命令

```bash
# 查看 Nginx 状态
sudo systemctl status nginx

# 测试 Nginx 配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 查看证书列表
sudo certbot certificates

# 手动续期测试
sudo certbot renew --dry-run
```

---

## 🎉 恭喜！

您已成功配置 HTTPS！

现在您的网站：
- ✅ 使用加密连接
- ✅ 获得浏览器信任
- ✅ SEO 排名提升
- ✅ 用户数据安全

**访问：** `https://your-domain.com` 🚀

---

**Let's Encrypt 相关资源：**
- 官网：https://letsencrypt.org/
- 文档：https://letsencrypt.org/docs/
- Certbot：https://certbot.eff.org/

---

**祝您使用愉快！** 🔒✨

