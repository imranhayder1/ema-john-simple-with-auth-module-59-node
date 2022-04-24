const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()


// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l5imx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// const uri = "mongodb+srv://emajohn59:BntGKrcnPWUswJq1@cluster0.l5imx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const productCollection = client.db("emaJohn").collection("products");

        app.get('/product', async (req, res) => {
            // console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            const query = {};
            const cursor = productCollection.find(query);
            let products;
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }

            res.send(products)
        })

        app.get('/productcount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count })
        })

        app.post('/productByKeys', async (req, res) => {
            const keys = req.body;
            console.log(keys);
            const ids = keys.map(id => ObjectId(id));
            const query = { _id: { $in: ids } };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);

        })
    }
    finally {

    }
}
run().catch(console.dir)


app.listen(port, () => {
    console.log('Example app listening on port', port)
})