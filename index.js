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

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}


async function run() {
    try {
        const photoCollection = client.db('photoDb').collection('photos');
        const reviewCollection = client.db('photoDb').collection('review')

        app.post('/jwt', (req, res) => {
            const user = req.body;

            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            console.log(token);
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

        app.get('/review', verifyJWT, async (req, res) => {
            const decoded = req.decoded;
            if (decoded.email !== req.query.email) {
                return res.status(403).send({ message: 'Forbidend access' })
            }

            let query = {}

            if (req.query.email) {
                query = {

                    reviewerEmail: req.query.email
                }
            }

            const cursor = reviewCollection.find(query)
            const review = await cursor.toArray()
            res.send(review)

        })
        app.get('/allreview', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/allreview/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.findOne(query);
            res.send(result);
        });
        app.put('/allreview/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const body = req.body;
            console.log(body)
            const option = { upsert: true }
            const updateUser = {
                $set: {
                    review: body.review,
                }
            }
            const result = await reviewCollection.updateOne(filter, updateUser, option)
            res.send(result)
        })
        app.delete('/allreview/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })


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