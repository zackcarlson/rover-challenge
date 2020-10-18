#!/usr/bin/env node
import CSV from './services/CSV/CSV.ts';

const csv = new CSV();
csv.writeCSV();
