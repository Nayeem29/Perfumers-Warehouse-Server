const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

require('dotenv').config();
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fcrb6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const perfumesCollection = client.db('perfumers').collection('products');
    const myCollection = client.db('perfumers').collection('myProducts');
    // get all products
    app.get('/products', async (req, res) => {
      const query = {};
      const cursor = perfumesCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    })
    //get products by id
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const perfume = await perfumesCollection.findOne(query);
      res.send(perfume);
    })
    // get items of myProducts
    // app.get('/myProducts', async (req, res) => {
    //   const query = {}
    //   const cursor = myCollection.find(query);
    //   const myProducts = await cursor.toArray();
    //   res.send(myProducts);
    // })
    // //get myProductsby id
    // app.get('/myProducts/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await myCollection.findOne(query);
    //   res.send(result);
    // })

    //Update Quantity
    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) }
      const doc = req.body;
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: doc.quantity
        }
      };
      const result = await perfumesCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })

    //Update Email for My products
    // app.put('/myProducts/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: ObjectId(id) };
    //   const doc = req.body;
    //   const options = { upsert: true };
    //   const updatedDoc = {
    //     $set: {
    //       email: doc.email
    //     }
    //   }
    //   const result = await myCollection.updateOne(filter, updatedDoc, options);
    //   res.send(result);
    // })

    //Post a product
    app.post('/products', async (req, res) => {
      const doc = req.body;
      const result = await perfumesCollection.insertOne(doc);
      res.send(result);
    })
    //Post product to my products
    // app.post('/myProducts', async (req, res) => {
    //   const doc = req.body;
    //   const result = await myCollection.insertOne(doc);
    //   res.send(result);
    // })
    //Delete a product from all products
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await perfumesCollection.deleteOne(query);
      res.send(result);
    })
    // Delete a product from myProducts
    // app.delete('/myProducts/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await myCollection.deleteOne(query);
    //   res.send(result);
    // })
  } finally {

  }
}
run().catch(console.dir());


app.get('/', (req, res) => {
  res.send('server is running');
})

app.listen(port, () => {
  console.log('server is okay');
})