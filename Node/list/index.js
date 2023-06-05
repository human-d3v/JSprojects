//this file acts like the 'ls' command in linux/unix systems.
#! C:\Users\bryar.topham\scoop\apps\nodejs\current\node

const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const path = require('path');

const { lstat } = fs.promises;
const targetDir = process.argv[2] || process.cwd();
fs.readdir(targetDir, async (err, filenames) => {
	if(err){
		console.log(err);
	}
	const statPromises = filenames.map(f => {
		return lstat(path.join(targetDir,f));
	})

	const allStats = await Promise.all(statPromises);

	for(let stat of allStats){
		const idx = allStats.indexOf(stat);
		console.log((stat.isFile() ? chalk.blue(filenames[idx]):
			chalk.green(filenames[idx])));
	}
});
