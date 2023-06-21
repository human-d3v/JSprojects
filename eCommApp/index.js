const express = require('express'); //express is the webserver
const bodyParser = require('body-parser');

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


app.post('/', bodyParser.urlencoded({extended: true}), (req,res)=>{
	console.log(req.body);
	res.send('success');
});

app.listen(3000, () => {
	console.log('Listening');
});
