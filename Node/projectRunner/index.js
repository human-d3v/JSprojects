#! C:\Users\bryar.topham\scoop\apps\nodejs\current\node

const debounce = require('lodash.debounce');
const chokidar = require('chokidar'); //for watching files in cwd
const prog = require('caporal');
const fs = require('fs');
const { spawn } = require('child_process');
const chalk = require('chalk');

prog //outlining the caporal help CLI tools
	.version('0.0.1')
	.argument('[filename]','Name of the file to be executed')
	.action(async ({ filename }) => {
		const name = filename || 'index.js';

		try {
			await fs.promises.access(name)
		} catch (err) {
			throw new Error(`Could not find ${name} or you don't have permission`)
		}

		//stdio maps the child process [stdin, stdout, stderr] to the parent process
		//spawn is not executed in the shell and runs in a stream

		let proc;
		const start = debounce(() => {
			if(proc){
				proc.kill();
			};
			console.log(chalk.cyan('>>>>>>>>> Starting Process'));
			proc = spawn('node', [name], {stdio:'inherit'});
		}, 100);

		chokidar
			.watch('.')
			.on('add', start) //only a reference, not an invocation
			.on('change', start)
			.on('unlink', start)
	});

prog.parse(process.argv); //invoking the CLI helper

