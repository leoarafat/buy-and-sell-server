const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
//verify jwt
function verifyJWT(req, res, next) {

  const authHeader = req.headers.authorization;
  if (!authHeader) {
      return res.status(401).send('unauthorized access');
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_JWT_TOKEN, function (error, decoded) {
      if (error) {
          return res.status(403).send({ message: 'forbidden access' })
      }
      req.decoded = decoded;
      next();
  })

}



async function run() {
  try {
    const productsCollection = client.db("buyAndSell").collection("products");
    const categoryCollection = client.db("buyAndSell").collection("category");
    const bookingsCollection = client.db("buyAndSell").collection("bookings");
    const usersCollection = client.db("buyAndSell").collection("users");

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
    app.get("/category/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id)
      const filter = { category_id: id };
      const result = await productsCollection.find(filter).toArray();
      res.send(result);
    });

    //bookings
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      res.send(result);
    });

    app.get("/bookings",verifyJWT, async (req, res) => {
      const email = req.query.email;
      const decodedEmail = req.decoded.email;

      if (email !== decodedEmail) {
          return res.status(403).send({ message: 'forbidden access' });
      }
      
      const query = { email: email };
      const bookings = await bookingsCollection.find(query).toArray();
      res.send(bookings);
    });
    //get user data
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });



    //jwt start
    app.get('/jwt', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      if (user) {
          const token = jwt.sign({ email }, process.env.ACCESS_JWT_TOKEN, { expiresIn: '5d' })
          return res.send({ accessToken: token });
      }
      res.status(403).send({ accessToken: '' })
  });
    //jwt end

    //get user data
    app.get('/users', async(req, res)=>{
      const query = {}
      const result = await usersCollection.find(query).toArray()
      res.send(result)
    })
//make admin or seller
app.put('/users/admin/:id',verifyJWT, async (req, res) => {

  const decodedEmail = req.decoded.email
  const query = {email: decodedEmail}
  const user = await usersCollection.findOne(query)
  if(user?.role !== 'admin'){
    return res.status(403).send({message: 'forbidden access'})
  }

  const id = req.params.id;
  const filter = { _id: ObjectId(id) }
  const options = { upsert: true };
  const updatedDoc = {
      $set: {
          role: 'admin'
      }
  }
  const result = await usersCollection.updateOne(filter, updatedDoc, options);
  res.send(result);
});
//visit dashboard





  } catch (error) {
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
