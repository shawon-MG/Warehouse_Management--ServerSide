const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

const { MongoClient, ServerApiVersion } = require('mongodb');


const cors = require('cors');

require('dotenv').config();

// middlewares:
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m8chh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     console.log('Connected with MongoDB-Atlas');

//     // perform actions on the collection object
//     client.close();
// });
async function run() {
    try {
        await client.connect();
        const inventoryItems = client.db('electronics-inventory-project-11').collection('items');

        // To get / read all documents from database
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = inventoryItems.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });
    }
    finally {
        // No code right now. Can be written if needed
    }
};
run().catch(console.dir);


// Root API : (getting / reading data form root)
app.get('/', (req, res) => {
    res.send('Electronics Inventory Site <--- Server Side');
});

// Connecting Server to Port:
app.listen(port, () => {
    console.log('Port Is Connected', port);
});