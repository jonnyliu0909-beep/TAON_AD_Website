# GitHub Pages 部署指南

## ✅ 网站兼容性检查

### 适合 GitHub Pages 的原因：

1. **静态网站**：网站主要由 HTML、CSS、JavaScript 组成，完全兼容 GitHub Pages
2. **留言板功能**：已实现 `localStorage` 后备机制，在 GitHub Pages 上会自动使用本地存储
3. **无服务器依赖**：除了留言板 API（已有后备方案），其他功能都是纯前端实现
4. **多语言支持**：使用 JSON 文件和 JavaScript，无需服务器端处理

### ⚠️ 注意事项：

1. **留言板功能**：
   - 在 GitHub Pages 上，留言板会**自动使用 localStorage**（本地存储）
   - 留言数据存储在用户的浏览器中，不会同步到服务器
   - 如果需要服务器端存储，需要：
     - 使用第三方服务（如 Firebase、Supabase）
     - 或使用 GitHub Actions + GitHub API
     - 或部署到支持 PHP 的服务器（如 Netlify、Vercel 等）

2. **PHP API**：
   - `api/messages.php` 在 GitHub Pages 上**不会工作**（GitHub Pages 不支持 PHP）
   - 但网站已自动检测协议，会回退到 localStorage，不影响基本功能

## 📋 部署步骤

### 方法一：使用 GitHub Desktop（推荐，最简单）

1. **安装 GitHub Desktop**
   - 下载：https://desktop.github.com/
   - 安装并登录 GitHub 账号

2. **创建新仓库**
   - 打开 GitHub Desktop
   - 点击 "File" → "New Repository"
   - Repository name: `taon-advertising-website`（或您喜欢的名称）
   - Description: `TAON Advertising Studio Website`
   - Local path: 选择项目文件夹的**父目录**（不是项目文件夹本身）
   - 勾选 "Initialize this repository with a README"
   - 点击 "Create Repository"

3. **添加项目文件**
   - 在 GitHub Desktop 中，点击 "Repository" → "Show in Explorer"
   - 将整个项目文件夹复制到仓库目录中
   - 回到 GitHub Desktop，所有文件会出现在左侧列表中

4. **提交并推送**
   - 在底部输入提交信息：`Initial commit: TAON Advertising Website`
   - 点击 "Commit to main"
   - 点击 "Publish repository"
   - 选择 "Keep this code private" 或取消勾选（公开）
   - 点击 "Publish repository"

5. **启用 GitHub Pages**
   - 在 GitHub 网站上打开您的仓库
   - 点击 "Settings" → 左侧菜单找到 "Pages"
   - 在 "Source" 下选择 "Deploy from a branch"
   - Branch: 选择 `main`（或 `master`）
   - Folder: 选择 `/ (root)`
   - 点击 "Save"
   - 等待几分钟，GitHub Pages 会自动部署
   - 访问地址：`https://[您的用户名].github.io/[仓库名]/`

### 方法二：使用 Git 命令行

1. **初始化 Git 仓库**（在项目根目录执行）
   ```bash
   git init
   ```

2. **创建 .gitignore 文件**（可选，排除不需要的文件）
   ```
   node_modules/
   .DS_Store
   Thumbs.db
   ```

3. **添加所有文件**
   ```bash
   git add .
   ```

4. **提交**
   ```bash
   git commit -m "Initial commit: TAON Advertising Website"
   ```

5. **在 GitHub 上创建新仓库**
   - 访问 https://github.com/new
   - 输入仓库名称（如 `taon-advertising-website`）
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

6. **连接并推送**
   ```bash
   git remote add origin https://github.com/[您的用户名]/[仓库名].git
   git branch -M main
   git push -u origin main
   ```

7. **启用 GitHub Pages**
   - 在 GitHub 仓库页面，点击 "Settings" → "Pages"
   - Source: 选择 `main` branch，folder: `/ (root)`
   - 点击 "Save"

### 方法三：使用 GitHub Web 界面

1. **创建新仓库**
   - 访问 https://github.com/new
   - 输入仓库名称
   - 勾选 "Initialize this repository with a README"
   - 点击 "Create repository"

2. **上传文件**
   - 在仓库页面，点击 "uploading an existing file"
   - 将项目文件夹中的所有文件拖拽到上传区域
   - 输入提交信息
   - 点击 "Commit changes"

3. **启用 GitHub Pages**
   - Settings → Pages → Source: `main` → Save

## 🔧 部署后配置

### 1. 更新网站 URL（可选）

如果您的 GitHub Pages URL 与代码中的 URL 不同，需要更新以下文件中的 URL：

- `index.html` - Open Graph 和 Twitter Card 的 URL
- `contact.html` - 同上
- `services.html` - 同上
- `single.html` - 同上
- `archive.html` - 同上
- `leave-message.html` - 同上

**当前代码中的 URL**：`https://taonadvertising.com/`

**GitHub Pages URL 格式**：`https://[用户名].github.io/[仓库名]/`

### 2. 自定义域名（可选）

如果您有自己的域名：

1. 在项目根目录创建 `CNAME` 文件，内容为您的域名：
   ```
   taonadvertising.com
   ```

2. 在 GitHub 仓库 Settings → Pages → Custom domain 中输入域名

3. 在您的域名 DNS 设置中添加 CNAME 记录指向 `[用户名].github.io`

## 📝 文件说明

### 需要部署的文件：
- ✅ 所有 HTML 文件
- ✅ `css/` 目录
- ✅ `js/` 目录
- ✅ `images/` 目录
- ✅ `i18n/` 目录
- ✅ `font-awesome/` 目录
- ✅ `owl-carousel/` 目录
- ✅ `includes/` 目录

### 可选文件：
- `api/` 目录（PHP 在 GitHub Pages 上不工作，但保留不影响功能）
- `api/README.md`（文档文件）

### 不需要部署：
- `node_modules/`（如果存在）

## 🎯 功能验证清单

部署后，请验证以下功能：

- [ ] 网站首页正常加载
- [ ] 语言切换功能正常
- [ ] 导航菜单正常工作
- [ ] 所有页面可以正常访问
- [ ] 图片正常显示
- [ ] 留言板功能（使用 localStorage）
- [ ] 联系表单（会跳转到留言页面）
- [ ] 响应式设计在不同设备上正常

## 🐛 常见问题

### Q: 留言板数据会丢失吗？
A: 在 GitHub Pages 上，留言数据存储在用户的浏览器 localStorage 中。如果用户清除浏览器数据，留言会丢失。如果需要持久化存储，建议使用第三方服务。

### Q: 可以修改代码后再推送吗？
A: 可以。修改后使用 `git add .`、`git commit -m "描述"`、`git push` 即可更新网站。

### Q: 如何更新网站？
A: 修改文件后，提交并推送到 GitHub，GitHub Pages 会自动重新部署（通常需要几分钟）。

### Q: 网站加载慢怎么办？
A: GitHub Pages 使用 CDN，通常速度很快。如果慢，可以：
- 优化图片大小
- 使用 GitHub Pages 的自定义域名
- 考虑使用其他静态网站托管服务（Netlify、Vercel 等）

## 📚 相关资源

- GitHub Pages 文档：https://docs.github.com/en/pages
- GitHub Desktop：https://desktop.github.com/
- Git 下载：https://git-scm.com/downloads

---

**注意**：本指南假设您不修改代码。如果后续需要修改，只需编辑文件后重新提交推送即可。
