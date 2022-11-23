const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();
// middleware
app.use(cors());
app.use(express.json());

//mongodb


const uri = "mongodb+srv://<username>:<password>@cluster0.tjc9clz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){

}
run().catch(console.log);



app.get('/', async (req, res) => {
    res.send('buy and sell server is running');
})

app.listen(port, () => console.log(`Doctors portal running on ${port}`))