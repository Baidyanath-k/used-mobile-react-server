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

function verifyJwtToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access')
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })
}
async function run() {
    try {
        const samsungCollection = client.db('usedMobile').collection('samsung');
        const symphonyCollection = client.db('usedMobile').collection('symphony');
        const waltonCollection = client.db('usedMobile').collection('walton');
        const usersCollection = client.db('usedMobile').collection('users');
        const buysCollection = client.db('usedMobile').collection('buys');

        app.get('/samsungcollection', async (req, res) => {
            const query = {};
            const options = await samsungCollection.find(query).toArray();
            res.send(options)
        })
        app.get('/symphonycollection', async (req, res) => {
            const query = {};
            const options = await symphonyCollection.find(query).toArray();
            res.send(options)
        })
        app.get('/waltoncollection', async (req, res) => {
            const query = {};
            const options = await waltonCollection.find(query).toArray();
            res.send(options)
        })



        app.get('/samsungcollection/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await samsungCollection.findOne(query);
            res.send(service);
        })

        app.get('/symphonycollection/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await symphonyCollection.findOne(query);
            res.send(service);
        })
        app.get('/waltoncollection/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await waltonCollection.findOne(query);
            res.send(service);
        })



        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await usersCollection.insertOne(users);
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const query = {};
            const users = await usersCollection.find(query).toArray();
            res.send(users)
        });


        app.put('/users/admin/:id', async (req, res) => {

            // //start: verify jwt
            // const decodedEmail = req.decoded.email;
            // const query = { email: decodedEmail }
            // const user = await usersCollection.findOne(query);
            // if (user?.role !== 'admin') {
            //     return res.status(403).send({ message: 'forbidden access' })
            // }
            // //end: verify jwt



            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result)

        })

        // admin check
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email }
            const user = await usersCollection.findOne(filter)
            res.send({ isAdmin: user?.role === 'admin' })
        })



        app.post('/buys', async (req, res) => {
            const buys = req.body;
            const result = await buysCollection.insertOne(buys);
            res.send(result);
        })

        app.get('/buys', async (req, res) => {
            const query = {};
            const buys = await buysCollection.find(query).toArray();
            res.send(buys)
        });

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120h' })
                return res.send({ accessToken: token })
            }
            console.log(user);
            res.status(403).send({ accessToken: '' })
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