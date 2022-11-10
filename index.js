const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5bfvhe8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




async function run() {
    try {
        const photoCollection = client.db('photoDb').collection('photos');
        const reviewCollection = client.db('photoDb').collection('review')

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
            res.send({ token })
        })

        app.get('/chose-photos', async (req, res) => {
            const query = {}
            const cursor = photoCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/home', async (req, res) => {
            const query = {}
            const cursor = photoCollection.find(query).sort({ _id: -1 });
            const result = await cursor.limit(3).toArray()
            res.send(result)
        })

        app.get('/chose-photos/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await photoCollection.findOne(query);
            res.send(service);
        });

        app.post('/chose-photos', async (req, res) => {
            const addService = req.body;
            const result = await photoCollection.insertOne(addService);
            res.send(result);
        });
        app.post('/review', async (req, res) => {
            const addreview = req.body;
            const result = await reviewCollection.insertOne(addreview);
            res.send(result);
        });

        app.get('/review', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/allreview', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

    }
    finally {

    }
}
run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('Assignment server is running')
})

app.listen(port, () => {
    console.log(`Assignment server running on ${port}`);
})