#!/usr/bin/env node

import { program } from "commander";// 用于创建命令行界面和处理命令参数
import chalk from "chalk"; // 用于在命令行中添加颜色和样式

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'node:fs';

import templates from "../lib/templates.js";
import create from "../lib/create.js"; // 显式添加 .js 后缀，不然tsc编译后的代码执行会报错
import cloneRepos from "../lib/clone.js";

// 获取当前模块的目录
const __dirname = dirname(fileURLToPath(import.meta.url));

// 读取 package.json
const packageJsonPath = join(__dirname, '../../package.json');
const packageJson = JSON.parse(
  fs.readFileSync(packageJsonPath, 'utf8')
);

program
  .name('hmf-cli')
  .description('HMF 模板项目脚手架')
  .version(packageJson.version, '-v, --version', 'output the current version')

program
  .command('create <project-name>')
  .description('创建新项目')
  .option('-t, --template <template>', '指定项目模板')
  .action(create)

program
  .command("list")
  .description("列出可用模板")
  .action(() => {
    console.log(chalk.green("可用模板:"));
    templates.forEach((template) => {
      console.log(`- ${template.name} (${chalk.yellow(template.type)})`);
    });
  });

program
  .command('clone')
  .description('批量克隆 GitHub 仓库')
  .option('-c, --config <path>', '指定配置文件路径', 'hmf-repos.json')
  .option('-u, --username <username>', '指定 GitHub 用户名', 'huangmingfu')
  .option('-r, --repos <repos...>', '直接指定要克隆的仓库名称（多个用空格分隔）')
  .option('-d, --dir <directory>', '指定克隆到的目录')
  .action(cloneRepos);

program.parse(process.argv);
