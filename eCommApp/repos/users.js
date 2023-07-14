const fs = require('fs');

class UserRepository{
	constructor(filename){
		if(!filename){
			throw new Error('Creating a repository requires a filename');
		}
		this.filename = filename;
		try {
		  fs.accessSync(this.filename);
		} catch (err) {
			fs.writeFileSync(this.filename,'[]');
		}
	}

	async getAll() {
		//open file, read contents and return returns parsed data
		const contents = await fs.promises.readFile(this.filename, 
			{encoding: 'utf8'});
		console.log(contents);
	}
}

const test = async () => {
	const repo = new UserRepository('users.json');
	await repo.getAll();
};

test();
