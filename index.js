const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.y6l8m1u.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('painting').collection('services');
        const reviewCollection = client.db('painting').collection('reviews')


        app.get('/services', async(req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/allservices', async(req, res ) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/allservices/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })


    }
    finally{

    }
}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('Server for review site is running')
})

app.listen(port, () => {
    console.log(`Review site server is running on ${port}`);
})