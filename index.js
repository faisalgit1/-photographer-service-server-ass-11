const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const data = require('./data/data.json');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

// middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5bfvhe8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const photoCollection = client.db('photoDb').collection('photos')

        app.get('/chose-photos', async (req, res) => {
            const query = {}
            const cursor = photoCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

    }
    finally {

    }
}
run().catch(err => console.error(err));


app.get('/data', (req, res) => {
    res.send(data)
});

app.get('/', (req, res) => {
    res.send('Assignment server is running')
})

app.listen(port, () => {
    console.log(`Assignment server running on ${port}`);
})