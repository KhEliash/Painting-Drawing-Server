const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://paintingdrawing-dd451.web.app"]
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzzvi9v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const craftCollection = client.db("drawingCraft").collection("craft");

    // post data
    app.post("/addCraft", async (req, res) => {
      const craft = req.body;
      const result = await craftCollection.insertOne(craft);
      res.send(result);
    });

    // get data
    app.get("/addCraft", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get for my carts
    app.get("/myCart/:email", async (req, res) => {
      const result = await craftCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    // get single product
    app.get("/singleCraft/:id", async(req, res) => {
       const result = await craftCollection.findOne({_id: new ObjectId(req.params.id),
      });
       res.send(result);
    });

    // update craft
    app.put("/updateCraft/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          itemName: req.body.itemName,
          image: req.body.image,
          description: req.body.description,
          price: req.body.price,
          rating: req.body.rating,
          processing_time: req.body.processing_time,
          subcategory: req.body.subcategory,
          customize: req.body.customize,
          stock_status: req.body.stock_status,
        },
      };
      const result = await craftCollection.updateOne(query, data);
      res.send(result);
    });

    // delete
    app.delete("/delete/:id", async (req, res) => {
      const result = await craftCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
