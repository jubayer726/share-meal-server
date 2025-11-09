const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors");
const app = express()
const port = 3000

//Middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://share-meal:z8QLY86SqIVbiY9e@cluster0.t8kbwcq.mongodb.net/?appName=Cluster0";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    //Collections
    const db = client.db("assignment-DB");
    const mealCollection = db.collection("meals");

    // find

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Server is Running...!')
})

app.listen(port, () => {
  console.log(`The Server is Running now on ${port}`)
})