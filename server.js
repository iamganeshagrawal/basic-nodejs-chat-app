// load env file
require('dotenv').config()
// Import dependeces
let express = require('express');
let app = express();
let http = require('http');
let Socket = require('socket.io');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

// Models
const Message = require('./src/models/Message')

// Tie express app with http and create server 
let server = http.Server(app)
// Tie socket with server
let io = Socket(server)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
//Serve static assests or frontend
app.use(express.static(__dirname));

// temp data object
// let db = []

// routes
app.get("/messages", (req, res) => {
    Message.find({}).then(data => {
        // console.log(data)
        res.send(data);
    }).catch(err => {
        res.sendStatus(500)
    })
    // res.send(db);
})
app.post("/messages", (req, res) => {
    let msg = new Message(req.body)
    msg.save((err) => {
        if(err){
            res.sendStatus(500)
            return;
        }
        io.emit("message", req.body)
        res.sendStatus(200)
    })
})

// Socket events
io.on("connection", (socket) => {
    console.log('New user')
})

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
        if(!err){
            console.log('Database connected')
        }else{
            console.warn('>>>\tDatabase connection error\n', err)
        }
})
server.listen(process.env.PORT || 3000, () => {
    console.log(`Server running at http://localhost:${server.address().port}`);
})
// process.on