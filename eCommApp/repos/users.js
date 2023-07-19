const fs = require('fs');
const crypto = require('crypto');

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
		return JSON.parse(await fs.promises.readFile(this.filename, 
			{encoding: 'utf8'}));
	}

	async create(attrs) {
		attrs.id = this.randId();
		const records = await this.getAll();
		records.push(attrs);
		this.writeAll(records);
	}
	
	async writeAll(records){
		await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
	}

	randId(){
		return crypto.randomBytes(4).toString('hex');
	}

	async getOne(id){
		const records = await this.getAll();
		return records.find(record=>record.id === id);
	}

	async delete(id){
		const records = await this.getAll();
		const filtered = records.filter(r => r.id !== id);
		await this.writeAll(filtered);
	}

	async update(id, attrs){
		const records = await this.getAll();
		const record = records.find(record=>record.id === id);
		if(!record){
			throw new Error(`Record with id ${id} not found`);
		}
		Object.assign(record, attrs);
		await this.writeAll(records);
	}

	async getOneBy(filters){
		const records = await this.getAll();

		for(let r of records){ //iterate through array
			let found = true; //update if not found
			
			for(let key in filters){ //iterate through object 
				if(r[key] !== filters[key]) {
					found = false;
				}
			};
			if(found){
				return r;
			};
		};
	}
}

module.exports = new UserRepository('users.json'); 
//exporting an instance instead of the class itself.
