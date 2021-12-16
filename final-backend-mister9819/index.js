const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Cross origin
const cors = require('cors')
const corsOption = {origin: ['http://localhost:4200', 'https://ricetome.surge.sh'], credentials: true};

// Connect to mongodb
const mongoose = require('mongoose');
const connectionString = 'mongodb+srv://sp91:sp91DB@cluster0.ndppc.mongodb.net/finalDatabase?retryWrites=true&w=majority';

const auth = require('./src/auth');
const article = require('./src/articles');
const profile = require("./src/profile");

const passp = require("./src/my-passport.js")


let articles = [{ id: 0, author: 'Mack', body: 'Post 1' },
    { id: 1, author: 'Jack', body: 'Post 2' },
    { id: 2, author: 'Zack', body: 'Post 3' }];


const hello = (req, res) => res.send({ hello: 'world' });


const app = express();
app.use(cors(corsOption));
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:4200");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Credentials', true);
//     if(req.method === 'OPTIONS'){
//         res.sendStatus(200);
//         return;
//     }
//     else{
//         next();
//     }
// });
app.use(bodyParser.json());
app.use(cookieParser());
app.enable('trust proxy')
app.get('/', hello);

passp(app);
auth(app);
article(app);
profile(app);


mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => {
        console.log("connected to db");
        // Get the port from the environment, i.e., Heroku sets it
        const port = process.env.PORT || 3000;
        const server = app.listen(port, () => {
            const addr = server.address();
            console.log(`Server listening at http://${addr.address}:${addr.port}`)
        });
    })
    .catch((err) => console.log(err));