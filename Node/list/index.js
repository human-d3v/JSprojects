#! C:\Users\bryar.topham\scoop\apps\nodejs\current\node

const exp = require('constants');
const fs = require('fs');
//const util = require('util'); //this will import promisify for s3B


/*
	because of the asynchronous nature of the program reaching out to the 
	hard drive, the the array returned by this solution is often populated by 
	whatever the fastest write-out was, which can change upon each execution
*/
//function solutionOne(filenames) { //this is a bad solution 
//	for (let f of filenames) {
//		fs.fstat(f, (err, stats) => {
//			if (err) {
//				throw new Error(err);
	//		}
	//		console.log(f, stats.isFile());
		//});
	//};
//}



/*
	this solution sticks with the callback theme of the above solution, but, 
	like the first solution, it relies entirely on callbacks.
*/
//function solutionTwo(filenames) { //sticking with callback
//	const expected = Array(filename.length).fill(null); //empty array 
//	for (let f of filenames) {
//		const idx = filenames.indexOf(f);
//
//		fs.fstat(f, (err, stats) => {
//			if (err) {
//				throw new Error(err);
//			}
//			expected[idx] = stats;
//			const ready = expected.every(() => {
//				return stats;
//			});
//			if (ready) {
//				expected.forEach((stat, index) => {
//					console.log(filenames[index], stat.isFile());
//				});
//			}
//		});
//	};
//};


/*
	this solution relies on async & await to resolve the read-write promise 
	to & from harddrive, but still isn't optimized.
*/

//function solutionThreeA(filenames) {
//	const lstat = (f) => {
//		return new Promise((resolve, reject) => {
//			fs.lstat(f, (err, stats) => {
//				if (err) {
//					reject(err);
//				}
//				resolve(stats);
//			});
//		});
//	}
//	for (let f of filenames) {
//		console.log(lstat(f));
//	};
//}

//async function solutionThreeB(filenames) {
//	const { lstat } = util.promisify(fs.lstat);
//	for (let f of filenames){
//		const stats = await lstat(f);
//		console.log(f, stats.isfile());
//	};
//}

//the above implementation is running everything in series, so it's clearly not
//optimized. This implementation will process calls in parallel

fs.readdir(process.cwd(), async (err, filenames) => {
	if(err){
		throw new Error(err);
	}
	const { lstat } = fs.promises;
	statPromises = filenames.map(f => {
		return lstat(f);
	})

	const allStats = await Promise.all(statPromises);
	for(let stat of allStats){
		const idx = allStats.indexOf(stat);
		console.log(filenames[idx], stat.isFile());
	}
});
