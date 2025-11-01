# 📘 GitHub 上传指南

> **完整的 GitHub 仓库创建和代码上传教程**

---

## 🎯 准备工作

### 1. 安装 Git

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install git
```

**CentOS/RHEL:**
```bash
sudo yum install git
```

**Windows:**
下载并安装：https://git-scm.com/download/win

**验证安装：**
```bash
git --version
```

### 2. 配置 Git

首次使用需要配置用户信息：

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. 创建 GitHub 账号

如果还没有，访问 https://github.com 注册账号。

---

## 📦 方式 1: 通过 GitHub 网页创建仓库（推荐新手）

### 步骤 1: 在 GitHub 创建新仓库

1. 登录 GitHub
2. 点击右上角 `+` → `New repository`
3. 填写信息：
   - Repository name: `xboard-frontend`
   - Description: `XBoard 前端 - 黑客风格主题`
   - Public/Private: 根据需要选择
   - ❌ **不要**勾选 "Add a README file"
   - ❌ **不要**勾选 "Add .gitignore"
   - ❌ **不要**勾选 "Choose a license"
4. 点击 `Create repository`

### 步骤 2: 在本地初始化 Git

```bash
cd /root/project/frontend

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: XBoard frontend with auto-deploy and HTTPS support"
```

### 步骤 3: 连接到 GitHub

复制 GitHub 上显示的命令，类似：

```bash
# 添加远程仓库
git remote add origin https://github.com/your-username/xboard-frontend.git

# 或使用 SSH（推荐）
git remote add origin git@github.com:your-username/xboard-frontend.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

---

## 🚀 方式 2: 命令行完整流程

### 步骤 1: 本地初始化

```bash
cd /root/project/frontend

# 初始化 Git
git init

# 检查状态
git status

# 添加所有文件
git add .

# 查看将要提交的文件
git status

# 提交
git commit -m "Initial commit: XBoard frontend with auto-deploy and HTTPS support"
```

### 步骤 2: 在 GitHub 创建仓库

使用 GitHub CLI（可选）：

```bash
# 安装 GitHub CLI
# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# 登录
gh auth login

# 创建仓库
gh repo create xboard-frontend --public --source=. --remote=origin --push
```

或手动在 GitHub 网站创建（见方式1）。

### 步骤 3: 推送代码

```bash
# 添加远程仓库
git remote add origin https://github.com/your-username/xboard-frontend.git

# 推送
git branch -M main
git push -u origin main
```

---

## 🔑 SSH 密钥配置（推荐）

使用 SSH 可以避免每次输入密码。

### 步骤 1: 生成 SSH 密钥

```bash
# 生成密钥（使用你的 GitHub 邮箱）
ssh-keygen -t ed25519 -C "your.email@example.com"

# 按回车使用默认路径
# 可以设置密码短语（可选）

# 启动 ssh-agent
eval "$(ssh-agent -s)"

# 添加密钥
ssh-add ~/.ssh/id_ed25519
```

### 步骤 2: 添加公钥到 GitHub

```bash
# 复制公钥
cat ~/.ssh/id_ed25519.pub
```

1. 登录 GitHub
2. 点击头像 → Settings
3. SSH and GPG keys → New SSH key
4. 粘贴公钥内容
5. 保存

### 步骤 3: 测试连接

```bash
ssh -T git@github.com
# 应该显示: Hi username! You've successfully authenticated...
```

### 步骤 4: 使用 SSH 地址

```bash
# 如果已添加 HTTPS 地址，改为 SSH
git remote set-url origin git@github.com:your-username/xboard-frontend.git

# 推送
git push -u origin main
```

---

## 📝 .gitignore 说明

项目已包含 `.gitignore` 文件，以下文件/目录不会被上传：

- `node_modules/` - 依赖包（不应上传）
- `dist/` - 构建产物（可选）
- `.env` - 环境变量（敏感信息）
- `deploy.log` - 部署日志
- `backups/` - 备份文件

如果想上传构建产物，编辑 `.gitignore` 并删除 `dist/` 这一行。

---

## 🎨 提交信息规范

### 推荐的提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例

```bash
git commit -m "feat: add HTTPS auto-configuration"
git commit -m "fix: resolve SVG chart NaN error"
git commit -m "docs: update deployment guide"
```

---

## 🌿 分支管理

### 创建开发分支

```bash
# 创建并切换到开发分支
git checkout -b develop

# 推送到远程
git push -u origin develop
```

### 功能分支

```bash
# 创建功能分支
git checkout -b feature/new-feature

# 完成后合并到 develop
git checkout develop
git merge feature/new-feature

# 删除功能分支
git branch -d feature/new-feature
```

---

## 🔄 常用 Git 命令

### 查看状态

```bash
git status              # 查看当前状态
git log                 # 查看提交历史
git log --oneline       # 简洁的提交历史
git diff                # 查看未暂存的更改
```

### 提交更改

```bash
git add .               # 添加所有文件
git add file.txt        # 添加特定文件
git commit -m "message" # 提交
git commit --amend      # 修改最后一次提交
```

### 同步代码

```bash
git pull                # 拉取远程更改
git push                # 推送到远程
git push -f             # 强制推送（谨慎使用）
```

### 分支操作

```bash
git branch              # 查看分支
git branch name         # 创建分支
git checkout name       # 切换分支
git checkout -b name    # 创建并切换分支
git merge name          # 合并分支
git branch -d name      # 删除分支
```

### 撤销操作

```bash
git reset HEAD file     # 取消暂存
git checkout -- file    # 撤销文件修改
git reset --hard HEAD   # 重置到最后一次提交（危险）
```

---

## 📤 更新 GitHub 仓库

### 日常更新流程

```bash
# 1. 查看更改
git status

# 2. 添加文件
git add .

# 3. 提交
git commit -m "描述你的更改"

# 4. 推送
git push
```

### 批量更新

```bash
# 一次性完成
git add . && git commit -m "Update frontend" && git push
```

---

## 🏷️ 发布版本（Release）

### 创建标签

```bash
# 创建标签
git tag -a v1.0.0 -m "Version 1.0.0: Initial release"

# 推送标签
git push origin v1.0.0

# 推送所有标签
git push --tags
```

### 在 GitHub 上创建 Release

1. 进入仓库页面
2. 点击 "Releases" → "Create a new release"
3. 选择标签或创建新标签（如 `v1.0.0`）
4. 填写 Release 标题和说明
5. 可以上传附件（如 `xboard-frontend-dist.tar.gz`）
6. 点击 "Publish release"

---

## 🔧 故障排查

### 问题 1: 推送被拒绝

```
! [rejected] main -> main (fetch first)
```

**解决：**
```bash
git pull origin main --rebase
git push
```

### 问题 2: 认证失败

```
remote: Support for password authentication was removed
```

**解决：** 使用 Personal Access Token 或 SSH

**创建 Token:**
1. GitHub → Settings → Developer settings
2. Personal access tokens → Generate new token
3. 勾选 `repo` 权限
4. 生成并复制 token

**使用 Token:**
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/your-username/xboard-frontend.git
```

### 问题 3: 文件太大

```
remote: error: File is too large
```

**解决：**
1. 检查 `.gitignore` 是否正确
2. 移除大文件：
```bash
git rm --cached large-file
git commit --amend
```

---

## 📋 完整检查清单

上传前确认：

- [ ] 已创建 `.gitignore` 文件
- [ ] 已移除敏感信息（密码、密钥等）
- [ ] `node_modules/` 不在版本控制中
- [ ] 已创建 `README.md`
- [ ] 已添加 LICENSE 文件
- [ ] 代码已测试通过
- [ ] 提交信息清晰明确

---

## 🎉 上传完成后

### 1. 验证

访问你的 GitHub 仓库，确认：
- ✅ 所有文件已上传
- ✅ README 正确显示
- ✅ 没有敏感信息泄露

### 2. 设置仓库

- **About**: 添加描述和标签
- **Topics**: 添加相关主题（vue, vite, typescript, xboard）
- **README**: 确保格式正确
- **License**: 显示 MIT License

### 3. 分享

- 复制仓库链接
- 分享给其他人
- 在社交媒体上推广

---

## 💡 进阶技巧

### GitHub Actions（CI/CD）

创建 `.github/workflows/deploy.yml` 实现自动部署。

### GitHub Pages

部署静态站点到 GitHub Pages：

```bash
npm run build
git subtree push --prefix dist origin gh-pages
```

### 保护分支

在 GitHub 设置中启用分支保护：
- Settings → Branches → Add rule
- Require pull request reviews
- Require status checks

---

## 📞 获取帮助

- [GitHub 文档](https://docs.github.com/)
- [Git 文档](https://git-scm.com/doc)
- [GitHub Community](https://github.community/)

---

## ✅ 快速命令参考

```bash
# 首次上传
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/xboard-frontend.git
git branch -M main
git push -u origin main

# 日常更新
git add .
git commit -m "更新说明"
git push

# 查看状态
git status
git log --oneline

# 撤销更改
git reset HEAD file
git checkout -- file
```

---

**祝您上传顺利！** 🚀

如有问题，请查阅 [GitHub 官方文档](https://docs.github.com/)。

