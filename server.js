const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');


const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'spiri',
      password : 'cdosavs1',
      database : 'smart-brain'
    }
  });

db.select('*').from('users').then(data => {
    console.log(data)
});
 
const app = express();

app.use(cors());
app.use(bodyParser.json());


const database = {
    users: [
        {
            id: '1',
            name: 'John',
            email: 'john@gmail.com',
            password: '123',
            entries: 0,
            joined: new Date()
        },
        {
            id: '2',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        },
        {
            id: '3',
            name: 'Tom',
            email: 'tom@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

/* Sign In Post*/
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
     req.body.password === database.users[0].password) {
       res.json(database.users[0]);
    }else {
        res.status(400).json('error loggin in')
    }
})

/* Register Post */
app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
    });

    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
    })
    .then(user => {
        res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'))
    
    
})

/* Profile mit user id */
app.get('/profile/:id', (req, res) => {
    const {id} =req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('user not found')
    }
})

/* /image --> PUT = user :update */
app.put('/image', (req, res) => {
    const {id} =req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('user not found')
    }
})

app.listen(3000, () => {
    console.log('====================================');
    console.log('app is running on port 3000');
    console.log('====================================');
})

