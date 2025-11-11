const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = 3000;

//Middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://share-meal:z8QLY86SqIVbiY9e@cluster0.t8kbwcq.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    //Collections
    const db = client.db("share-meal");
    const foodCollection = db.collection("foods");

    // find foods
    app.get("/foods", async (req, res) => {
      const result = await foodCollection
        .find()
        .sort({ food_quantity: "-1" })
        .limit(6)
        .toArray();
      res.send(result);
    });

    // find all foods
    app.get("/available-foods", async (req, res) => {
      const result = await foodCollection.find().toArray();
      res.send(result);
    });

    //Add Foods
    app.post("/foods", async (req, res) => {
      const data = req.body;
      const result = await foodCollection.insertOne(data);
      res.send(result);
    });

    // Food Details
    app.get("/foods/:id", async (req, res) => {
      const { id } = req.params;
      const query = new ObjectId(id);
      const result = await foodCollection.findOne({ _id: query });
      res.send(result);
    });

    // UpdateOne
    app.put("/foods/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      const query = new ObjectId(id);
      const filter = { _id: query };
      const update = {
        $set: data,
      };
      const result = await foodCollection.updateOne(filter, update);
      res.send({
        success: true,
        result,
      });
    });

    // Manage foods
    app.get("/manage-foods", async (req, res) => {
      const result = await foodCollection.find().toArray();
      res.send(result);
    });

    // Delete
    app.delete("/foods/:id", async (req, res) => {
      const { id } = req.params;
      const result = await foodCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }

  //Delete food cart
  app.delete("/foods/:id", async (req, res) => {
    const { id } = req.params;
    const result = await modelCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
  });
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is Running...!");
});

app.listen(port, () => {
  console.log(`The Server is Running now on ${port}`);
});
