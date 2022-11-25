const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb'); // Mongodb


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hymefqt.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const samsungCollection = client.db('usedMobile').collection('samsung');



        app.get('/samsungcollection', async (req, res) => {
            const query = {};
            const options = await samsungCollection.find(query).toArray();
            res.send(options)
        })


        app.get('/samsungcollection/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await samsungCollection.findOne(query);
            res.send(service);
        })


    }
    finally { }
}
run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('Used Mobile server')
});

app.listen(port, () => {
    console.log(`Used Mobile ${port}`)
})