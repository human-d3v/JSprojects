const express = require('express'); //express is the webserver
const app = express();

//mapping GET to app.get with callback to be fired
//req == request && res == resolution sent back
app.get('/',(req,res) => {	
	res.send(`
		<div>
			<form method="POST">
				<input name="email" placeholder="email">
				<input name="password" placeholder="password">
				<input name="passwordConfirmation" placeholder="password confirmation">
				<button>Sign Up</button>
			</form>
		</div>
		`);
});

app.post('/', (req,res)=>{
	//get access to submitted information with the req object
	req.on('data', data => {
		const parsed = data.toString('utf8').split('&');
		const formData = {}; //create object to receive the data variables
		for(let pair of parsed){
			const [key, value] = pair.split('=');
			formData[key] = value;
		};
		console.log(formData);
	});
	res.send('success');
});

app.listen(3000, () => {
	console.log('Listening');
});
