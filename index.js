const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
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
    app.get('/products', async (req, res) => {
      const query = {};
      const cursor = perfumesCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    })
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