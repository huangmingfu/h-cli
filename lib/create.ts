import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import download from 'download-git-repo';
import ora from 'ora';
import templates from './templates.js';
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
          name: t.name + ` (${chalk.green(t.description)})`,
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