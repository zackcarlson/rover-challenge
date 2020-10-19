#!/usr/bin/env node
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import ora from 'ora';
import CSV from './services/CSV/CSV';

const spinner = ora('Calculating Rover sitter search rankings...').start();

setTimeout(async () => {
  const csv = new CSV();
  const result = await csv.writeCSV();

  if (result.includes('Successfully')) {
    spinner.succeed(result);
  } else {
    spinner.fail(result);
  }

  spinner.stop();
}, 2000);
