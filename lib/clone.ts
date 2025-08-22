import fs from 'fs-extra';
import path from 'node:path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'node:child_process';

interface RepoConfig {
  repos: string[];
  username?: string;
}

const DEFAULT_CONFIG_FILE = 'hmf-repos.json';

// 默认配置
const DEFAULT_CONFIG: RepoConfig = {
  username: 'huangmingfu',
  repos: [
    'vue3-ts-template',
    'vue3-mini-template',
    'react-ts-template',
    'react-mobile-template'
  ]
};

/**
 * 创建默认配置文件
 */
async function createDefaultConfig(configPath: string): Promise<void> {
  await fs.writeJson(configPath, DEFAULT_CONFIG, { spaces: 2 });
  console.log(chalk.green(`已创建默认配置文件: ${configPath}`));
  console.log(chalk.yellow('你可以编辑此文件来自定义要克隆的仓库列表'));
}

/**
 * 读取配置文件
 */
async function loadConfig(configPath: string): Promise<RepoConfig> {
  if (!fs.existsSync(configPath)) {
    const { createConfig } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'createConfig',
        message: `配置文件 ${configPath} 不存在，是否创建默认配置？`,
        default: true
      }
    ]);

    if (createConfig) {
      await createDefaultConfig(configPath);
      return DEFAULT_CONFIG;
    } else {
      throw new Error('需要配置文件才能继续');
    }
  }

  return await fs.readJson(configPath);
}

/**
 * 克隆单个仓库
 */
async function cloneRepo(repoName: string, username: string, targetDir?: string): Promise<boolean> {
  const repoUrl = `https://github.com/${username}/${repoName}.git`;
  const cloneDir = targetDir || repoName;
  
  try {
    console.log(chalk.blue(`正在克隆: ${repoUrl}`));
    execSync(`git clone ${repoUrl} ${cloneDir}`, { stdio: 'inherit' });
    console.log(chalk.green(`✓ ${repoName} 克隆成功`));
    return true;
  } catch (error) {
    console.log(chalk.red(`✗ ${repoName} 克隆失败: ${error}`));
    return false;
  }
}

/**
 * 批量克隆仓库
 */
async function cloneRepos(options: { 
  config?: string; 
  username?: string; 
  repos?: string[];
  dir?: string;
}): Promise<void> {
  const configPath = path.resolve(options.config || DEFAULT_CONFIG_FILE);
  
  let config: RepoConfig;
  let reposToClone: string[];
  let username: string;

  // 如果直接传入了仓库列表，则使用传入的参数
  if (options.repos && options.repos.length > 0) {
    reposToClone = options.repos;
    username = options.username || 'huangmingfu';
  } else {
    // 否则从配置文件读取
    config = await loadConfig(configPath);
    reposToClone = config.repos;
    username = options.username || config.username || 'huangmingfu';
  }

  if (!reposToClone || reposToClone.length === 0) {
    console.log(chalk.yellow('没有找到要克隆的仓库'));
    return;
  }

  console.log(chalk.cyan(`准备克隆 ${reposToClone.length} 个仓库:`));
  reposToClone.forEach(repo => {
    console.log(chalk.gray(`  - ${username}/${repo}`));
  });

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: '确认开始克隆？',
      default: true
    }
  ]);

  if (!confirm) {
    console.log(chalk.yellow('已取消克隆操作'));
    return;
  }

  // 如果指定了目录，先创建目录
  if (options.dir) {
    await fs.ensureDir(options.dir);
    process.chdir(options.dir);
    console.log(chalk.blue(`切换到目录: ${path.resolve(options.dir)}`));
  }

  const spinner = ora('开始批量克隆...').start();
  
  let successCount = 0;
  let failCount = 0;

  for (const repo of reposToClone) {
    spinner.text = `正在克隆 ${repo}...`;
    const success = await cloneRepo(repo, username);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  spinner.stop();

  console.log(chalk.green(`\n克隆完成！`));
  console.log(chalk.green(`成功: ${successCount} 个`));
  if (failCount > 0) {
    console.log(chalk.red(`失败: ${failCount} 个`));
  }
}

export default cloneRepos;