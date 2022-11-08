const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const data = require('./data/data.json');

// middle wares
app.use(cors());
app.use(express.json());

app.get('/data', (req, res) => {
    res.send(data)
});

app.get('/', (req, res) => {
    res.send('Assignment server is running')
})

app.listen(port, () => {
    console.log(`Assignment server running on ${port}`);
})