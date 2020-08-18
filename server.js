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
app.get("/messages", async (req, res) => {
    try {
        let data = await Message.find({}).skip(await Message.countDocuments() - 5)
        res.send(data)
    }
    catch(err){
        res.sendStatus(500)
        return console.log(err)
    }
})
app.get("/messages/:user", async (req, res) => {
    try {
        const {user} = req.params;
        let data = await Message.find({name: user})
        res.send(data)
    }
    catch(err){
        res.sendStatus(500)
        return console.log(err)
    }
})
app.post("/messages", async (req, res) => {
    try{
        let msg = new Message(req.body)
        let saveMsg = await msg.save()

        let censored = await Message.findOne({message: 'bad'})

        if(censored){
            console.log('Censored found')
            await Message.deleteOne({_id: censored._id})
        }else{
            io.emit("message", msg)
        }
        res.sendStatus(200)
    }
    catch(err){
        res.sendStatus(500)
        console.log(err)
    }
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