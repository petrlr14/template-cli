#!/usr/bin/env node

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

require = require('esm')(module);
require('../src/cli').cli(process.argv);
