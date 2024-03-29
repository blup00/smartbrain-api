const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'test',
    database : 'smartbrain'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
	res.send(database.users);
});

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)});

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) } )

app.get('/profile/:id', (req, res) =>{
	const { id } = req.params;
	let found = false
	db.select('*').from('users').where({
		id: id
	})
	.then(user => {
		if (user.length) {
			res.json(user[0])
		} else {
			res.status(400).json('Not found')
		}
	})
	.catch(err => res.status(400).json('error getting user'))
	// if(!found) {
	// 	res.status(400).json('not found');
	// }
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
  	.increment('entries', 1)
  	.returning('entries')
  	.then(entries => {
  		res.json(entries[0]);
  	})
  	.catch(err => res.status(400).json('unable to get entries'))
})

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


app.listen(process.env.PORT || 3000, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})

