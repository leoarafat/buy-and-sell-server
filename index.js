const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

const app = express();
// middleware
app.use(cors());
app.use(express.json());

//mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tjc9clz.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


async function run() {
  try {
    const productsCollection = client.db("buyAndSell").collection("products");
    const categoryCollection = client.db("buyAndSell").collection("category");
    const bookingsCollection = client.db("buyAndSell").collection("bookings");

    app.get("/category", async (req, res) => {
      const query = {};
      const result = await categoryCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/products", async (req, res) => {
      const query = {};
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });
    app.get('/category/:id', async (req, res) => {
        const id = req.params.id;
        // console.log(id)
      const filter = {category_id:(id)}
      const result = await productsCollection.find(filter).toArray()
        res.send(result)

    })
   

//bookings
app.post('/bookings', async(req, res)=>{
    const booking = req.body 
    const result = await bookingsCollection.insertOne(booking)
    res.send(result)
})





  } 
  catch (error) {
    console.log(error.name, error.message);
  }
}
run().catch((error) => {
  console.log(error);
});

app.get("/", async (req, res) => {
  res.send("buy and sell server is running");
});

app.listen(port, () => console.log(`Buy And Sell portal running on ${port}`));
