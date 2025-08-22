# HMF-CLI

一个快捷创建完整模板项目和批量克隆仓库的命令行工具。

## 安装

### 全局安装

```sh
npm install -g hmf-cli
```

### 直接使用 npx 一次性使用

```sh
npx hmf-cli create
npx hmf-cli list
npx hmf-cli clone
```

## 创建项目

### 交互式选择模板

```sh
hmf-cli create  
# or  
hmf-cli create my-project
```

### 列出所有可用模板

```sh
hmf-cli list
```

### 直接指定模板类型（type）

```sh
hmf-cli create my-project -t react  
# or  
hmf-cli create my-project --template react
```

## 批量克隆仓库

### 使用配置文件批量克隆

```sh
# 使用默认配置文件 hmf-repos.json
hmf-cli clone

# 指定配置文件
hmf-cli clone -c my-repos.json
```

### 直接指定仓库名称

```sh
# 克隆单个仓库
hmf-cli clone -r vue3-ts-template

# 克隆多个仓库
hmf-cli clone -r vue3-ts-template react-ts-template vue3-mini-template
```

### 指定用户名和目录

```sh
# 指定 GitHub 用户名
hmf-cli clone -u your-username -r repo1 repo2

# 指定克隆到的目录
hmf-cli clone -d ./projects -r vue3-ts-template react-ts-template
```

### 配置文件格式

创建一个 `hmf-repos.json` 文件来配置要批量克隆的仓库：

```json
{
  "username": "huangmingfu",
  "repos": [
    "vue3-ts-template",
    "vue3-mini-template",
    "react-ts-template",
    "react-mobile-template"
  ]
}
```

### Clone 命令选项

- `-c, --config <path>`: 指定配置文件路径（默认: hmf-repos.json）
- `-u, --username <username>`: 指定 GitHub 用户名（默认: huangmingfu）
- `-r, --repos <repos...>`: 直接指定要克隆的仓库名称（多个用空格分隔）
- `-d, --dir <directory>`: 指定克隆到的目录

## 其他命令

### 查看当前版本

```sh
hmf-cli -v
# or
hmf-cli --version
```

### 查看帮助

```sh
hmf-cli --help
hmf-cli create --help
hmf-cli clone --help
```

## 卸载

```sh
npm uninstall -g hmf-cli
```

## 使用示例

### 创建项目示例

```sh
# 交互式创建项目
hmf-cli create

# 创建 React 项目
hmf-cli create my-react-app -t react

# 创建 Vue3 项目
hmf-cli create my-vue-app -t vue
```

### 批量克隆示例

```sh
# 使用默认配置批量克隆
hmf-cli clone

# 克隆指定的几个仓库到 projects 目录
hmf-cli clone -d ./projects -r vue3-ts-template react-ts-template

# 克隆其他用户的仓库
hmf-cli clone -u antfu -r eslint-config utils
```