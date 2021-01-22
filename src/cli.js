import arg from 'arg';
import inquirer from 'inquirer';
import { exec, ls } from 'shelljs';
import chalk from 'chalk';
import { getBranches } from './network/utils';
import { exit } from 'process';

function parseArgs(rawArgs) {
  const args = arg(
    {
      '--skip': Boolean,
      '--no-git': Boolean,
      '-g': '--no-git',
      '-s': '--skip',
    },
    { argv: rawArgs.slice(2) }
  );
  return {
    dir: args._[0] || './',
    git: args['--no-git'] || true,
    skip: args['--skip'] || false,
  };
}

async function fromPrompt(options) {
  const templates = await getBranches();
  if (options.skip) {
    return {
      ...options,
      template: templates[0],
    };
  }
  const answer = await inquirer.prompt({
    type: 'list',
    name: 'template',
    choices: templates,
    default: templates[0],
  });
  return {
    ...options,
    template: answer.template,
  };
}

async function cloneRepo({ template, dir }) {
  if (ls(dir).length !== 0) {
    console.log(
      '%s: directory must be empty. %s is not empty',
      chalk.red.bold('ERROR'),
      chalk.cyan.bold(dir)
    );
    exit(1);
  }
  const { code: cloneCode } = exec(
    `git clone --single-branch --branch ${template} https://github.com/${process.env.USER}/${process.env.REPO} ${dir}`
  );
  if (cloneCode !== 0) {
    console.log('%s: something went wrong', chalk.red.bold('ERROR'));
    exit(1);
  }
  return cloneCode;
}

function removeGitDirectory(dir) {
  const { code } = exec(`rm -rf ${dir}/.git`);
  if (code !== 0) {
    console.log(
      '%s: something went wrong trying to delete git directory. You should do it yourself',
      chalk.red.bold('ERROR')
    );
    exit(1);
  }
}

function initGitDirectory(dir) {
  const { code: initCode } = exec(`cd ${dir} && git init`);
  if (initCode !== 0) {
    console.log(
      '%s: something went wrong trying to initialize git repository. You should do it yourself',
      chalk.red.bold('ERROR')
    );
    exit(1);
  }
}

async function setupRepo({ git, dir }) {
  const initialDir = process.cwd();
  removeGitDirectory(dir);
  if (git) {
    initGitDirectory(dir);
    const { code: cdCode } = exec(`cd ${initialDir}`);
    if (cdCode !== 0) {
      console.log(
        '%s: something went wrong trying to access the directory where this command where called. You should do it yourself',
        chalk.red.bold('ERROR')
      );
      exit(1);
    }
  }
}

export async function cli(arg) {
  let options = parseArgs(arg);
  options = await fromPrompt(options);
  await cloneRepo(options);
  await setupRepo(options);
  console.log(
    '%s: Project was cloned into %s with branch %s',
    chalk.green.bold('DONE'),
    chalk.white.bold(options.dir),
    chalk.cyan.bold(options.template)
  );
}
