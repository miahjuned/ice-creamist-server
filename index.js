const express = require('express')
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());


// console.log(process.env.DB_USER)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7tcxm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  // console.log('connecting error', err)

  const ProductCollection = client.db("theDynamic").collection("addProduct");

  app.get('/allProduct', (req, res) => {
    ProductCollection.find()
    .toArray((err, items) => {
      res.send(items)
      // console.log('from database', items)
    })
  })

  app.get('/product/:_id', (req, res) => {
    ProductCollection.find({_id: req.params._id})
    .toArray( (err, documents) => {
      res.send(documents[0]);
    })
  })

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    // console.log('adding new product: ', newProduct)
    ProductCollection.insertOne(newProduct)
    .then(result => {
      // console.log('inseart count',result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  // client.close();
});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)