#!/usr/bin/env node

import { program } from "commander";
import create from "../lib/create.js"; // 显式添加 .js 后缀，不然tsc编译后的代码会报错
import chalk from "chalk";
import templates from "../lib/templates.js";
import inquirer from "inquirer";

program
  .command("create [project-name]")
  .description("创建新项目")
  .option("-t, --template <template>", "指定模板")
  .action(async (projectName: string | undefined, options: { template?: string }) => {
    // 如果没有传入项目名称，则交互式询问
    if (!projectName) {
      const { inputProjectName } = await inquirer.prompt([
        {
          type: 'input',
          name: 'inputProjectName',
          message: '项目名称:',
          validate: (input) => {
            // 校验项目名称
            if (!input) return '项目名称不能为空';
            if (!/^[a-z0-9-]+$/.test(input)) return '项目名称只能包含小写字母、数字和连字符';
            return true;
          }
        }
      ]);
      projectName = inputProjectName;
    }

    // 执行创建项目
    create(projectName!, options);
  });

program
  .command("list")
  .description("列出可用模板")
  .action(() => {
    console.log(chalk.green("可用模板:"));
    templates.forEach((template) => {
      console.log(`- ${template.name} (${chalk.yellow(template.type)})`);
    });
  });

program.parse(process.argv);
