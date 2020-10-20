#!/usr/bin/env node
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import ora from 'ora';
import inquirer from 'inquirer';
import path from 'path';
import validPath from 'is-valid-path';
import chalk from 'chalk';
import fs from 'fs';
import logSymbols from 'log-symbols';
import CSV from './services/CSV/CSV';

class CLI {
  constructor() {
    this.optionalMessage = '';
    this.filePath = '';
  }

  generateCSV = async (hasPermission) => {
    const spinner = ora('Calculating Rover sitter search rankings...').start();
    setTimeout(async () => {
      const csv = new CSV();
      const result = await csv.writeCSV(this.filePath, hasPermission);
      spinner.stop();
      if (typeof result === 'string') {
        if (result.includes('Successfully')) {
          spinner.succeed(result);
        } else {
          spinner.fail(result);
        }
      } else {
        console.table(result);
        spinner.succeed('Successfully calculated and logged Rover sitter search rankings to your terminal!');
      }
    }, 2000);
  }

  checkWritePermission = () => {
    const prompt = {
      type: 'confirm',
      name: 'hasPermission',
      message: `${this.optionalMessage}Do I have permission to export a CSV to your Downloads folder?`,
    };

    inquirer.prompt(prompt).then(({ hasPermission }) => {
      this.generateCSV(hasPermission);
    });
  }

  verifyFilePath = () => {
    const prompt = {
      type: 'input',
      name: 'isValidAbsoluteFilePath',
      message: 'Please paste in the absolute file path to the CSV file',
      validate: (value) => {
        const fileExists = fs.existsSync(value);
        const isCSVExt = path.extname(value) === '.csv';
        const isAbsolutePath = path.isAbsolute(value);
        const isValidPath = validPath(value);
        const isValidAbsolutePath = (isAbsolutePath && isValidPath) && (fileExists && isCSVExt);

        if (isValidAbsolutePath) {
          this.filePath = value;
          return true;
        }
        console.log(`\n${logSymbols.error} ${chalk.rgb(252, 194, 194).bold('Invalid file path!')}`);
        return false;
      },
    };

    inquirer.prompt(prompt).then(({ isValidAbsoluteFilePath }) => {
      if (isValidAbsoluteFilePath) {
        this.checkWritePermission();
      }
    });
  }

  initialPrompt = () => {
    const prompt = {
      type: 'confirm',
      name: 'hasValidCSV',
      message: 'Do you have a valid Rover reviews CSV to upload (i.e. columns must include rating, sitter, and sitter_email)?',
    };

    inquirer.prompt(prompt).then(({ hasValidCSV }) => {
      if (hasValidCSV) {
        this.verifyFilePath();
      } else {
        this.optionalMessage = 'This module will use a sample CSV, instead. ';
        this.checkWritePermission();
      }
    });
  }

  main = () => {
    this.initialPrompt();
  }
}

const cli = new CLI();
cli.main();
