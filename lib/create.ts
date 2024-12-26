// 文件系统操作的增强模块，提供额外的文件系统方法
import fs from 'fs-extra';
// Node.js 内置路径处理模块，用于处理文件和目录路径
import path from 'node:path';
// 交互式命令行用户界面，用于创建命令行交互提示
import inquirer from 'inquirer';
// 终端字符串样式库，用于在命令行中添加颜色和样式
import chalk from 'chalk';
// 从 Git 仓库下载代码的工具库
import download from 'download-git-repo';
// 命令行加载动画/进度指示器
import ora from 'ora';
// 可能是预定义的项目模板配置
import templates from './templates.js';
// Node.js 子进程模块，用于执行系统命令
import { execSync } from 'node:child_process';

function downloadRepo(repo: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    download(repo, dest, { clone: false }, (err: any) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

async function create(projectName: string, options: { template?: string }): Promise<void> {
  // 如果没有指定模板，则交互式选择
  let selectedTemplate: string;

  if (!options.template) {
    const { template } = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: '请选择项目模板:',
        choices: templates.map((t) => ({
          name: t.name + ` (${chalk.yellow(t.description)})`,
          value: t.value,
        })),
      },
    ]);
    selectedTemplate = template;
  } else {
    // 根据用户输入匹配模板
    selectedTemplate =
      templates.find(
        (t) => t.name.includes(options.template!) || t.type === options.template
      )?.value || options.template!;
  }

  // 目标目录处理
  const targetDir = path.join(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    const { action } = await inquirer.prompt([
      {
        name: 'action',
        type: 'list',
        message: '目标目录已存在，请选择操作:',
        choices: [
          { name: '覆盖', value: 'overwrite' },
          { name: '取消', value: 'cancel' },
        ],
      },
    ]);

    if (action === 'cancel') return;
    if (action === 'overwrite') {
      await fs.remove(targetDir);
    }
  }

  // 创建进度条
  const spinner = ora('正在下载模板...').start();

  try {
    // 下载仓库
    await downloadRepo(selectedTemplate, targetDir);

    spinner.succeed(chalk.green('模板下载成功!'));

    // 更新 package.json
    const pkgPath = path.join(targetDir, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      pkg.name = projectName;
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }

    // 项目初始化后的额外配置
    const { needInstall } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'needInstall',
        message: '是否立即安装依赖?',
        default: true,
      },
    ]);

    if (needInstall) {
      execSync(`cd ${projectName} && pnpm install`, { stdio: 'inherit' });
      console.log(`依赖安装完成`);
    } else {
      console.log(
        chalk.blue(`
      项目 ${projectName} 创建成功!

      cd ${projectName}
      pnpm install
      pnpm run dev
      `)
      );
    }
  } catch (error) {
    spinner.fail(chalk.red('模板下载失败'));
    console.error(error);
  }
}

export default create;