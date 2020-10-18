#!/usr/bin/env node
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import CSV from './services/CSV/CSV';

const csv = new CSV();
csv.writeCSV();
