const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const cors = require('cors');

require('dotenv').config();

// middlewares:
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m8chh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const inventoryItems = client.db('electronics-inventory-project-11').collection('items');
        console.log("DB Also Connected");


        // To get / read all documents from database
        app.get('/items', async (req, res) => {
            const email = req.params.email;
            if (email) {
                const email = req.params.email;
                const query = { email: email };
                const cursor = inventoryItems.find(query);
                const items = await cursor.toArray();
                res.send(items);
            }
            else {
                const query = {};
                const cursor = inventoryItems.find(query);
                const items = await cursor.toArray();
                res.send(items);
            }
        });

        // To get / read one document by _id
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await inventoryItems.findOne(query);
            res.send(item);
        });

        // Posting data from UI
        app.post('/items', async (req, res) => {
            const newItem = req.body;
            const result = await inventoryItems.insertOne(newItem);
            res.send(result);
        });

        // Delete data form UI
        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await inventoryItems.deleteOne(query);
            res.send(result);
        });

        // Update
        app.put('/items/:id', async (req, res) => {
            const id = req.params.id;
            const updatedQuantity = { quantity: (req.body.quantity) };
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = { $set: updatedQuantity }
            const result = await inventoryItems.updateOne(filter, updatedDoc, options);
            res.send(result);
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