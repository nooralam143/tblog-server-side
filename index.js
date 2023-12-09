const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
console.log(process.env.DB_USER)
// middleware
app.use(cors());
app.use(express.json());



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.58kalj5.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // create database & collection
    const blogPostCollection = client.db('tblog').collection('blogPost');
    const wishlistCollection = client.db('tblog').collection('wishlist');
    const commentCollection = client.db('tblog').collection('comment');
    const newsletterCollection = client.db('tblog').collection('newsletter');



    // blogpost Api CRUD methods Start

    // Read all blogpost data from database
    app.get('/post', async (req, res) => {
      const cursor = blogPostCollection.find();
      const post = await cursor.toArray();
      res.send(post);
    })
    // Read single blogpost data from database
    app.get('/post/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await blogPostCollection.findOne(query);
      res.send(result);
    })
    // Post Add blogpost data in database
    app.post('/post', async (req, res) => {
      const newPost = req.body;
      console.log(newPost);
      const result = await blogPostCollection.insertOne(newPost);
      res.send(result);
    })

    // update single blogpost data
    app.put('/post/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const post = req.body;
      console.log(id, post);
      const updatePost = {
        $set: {
          postTitle: post.postTitle,
          postImage: post.postImage,
          postCategory: post.postCategory,
          PostTag: post.PostTag,
          SortDescription: post.SortDescription,
          LongDescription: post.LongDescription,
        }
      }
      const result = await blogPostCollection.updateOne(filter, updatePost, options);
      res.send(result);
    })

    // Delete blogpost data from database
    app.delete('/post/:id', async (req, res) => {
      const id = req.params.id;
      console.log('please delete data', id);
      const query = { _id: new ObjectId(id) }
      const result = await blogPostCollection.deleteOne(query);
      res.send(result);
    })
    // blogpost Api CRUD methods END

    // Wishlist API routes
    app.get('/wishlist', async (req, res) => {
      const cursor = wishlistCollection.find();
      const wishlist = await cursor.toArray();
      res.send(wishlist);
    });

    app.get('/wishlist/user', async (req, res) => {
      const userEmail = req.query.userEmail;
      const cursor = wishlistCollection.find({ userEmail });
      const myWishlist = await cursor.toArray();
      res.send(myWishlist);
    });

    app.post('/wishlist', async (req, res) => {
      const newWishlist = req.body;
      console.log(newWishlist);
      const result = await wishlistCollection.insertOne(newWishlist);
      res.send(result);
    });

    app.delete('/wishlist/:id', async (req, res) => {
      const id = req.params.id;
      console.log('please delete data', id);
      const query = { _id: new ObjectId(id) }
      const result = await wishlistCollection.deleteOne(query);
      res.send(result);
    });

    // Comment API routes
    app.get('/comment', async (req, res) => {
      const cursor = commentCollection.find();
      const comment = await cursor.toArray();
      res.send(comment);
    });

    app.get('/comment/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await commentCollection.findOne(query);
      res.send(result);
    });

    app.post('/comment', async (req, res) => {
      const newComment = req.body;
      console.log(newComment);
      const result = await commentCollection.insertOne(newComment);
      res.send(result);
    });

    app.delete('/comment/:id', async (req, res) => {
      const id = req.params.id;
      console.log('please delete data', id);
      const query = { _id: new ObjectId(id) }
      const result = await commentCollection.deleteOne(query);
      res.send(result);
    });
    //comment api end
    // newslater Api routes
    app.post('/newsletter', async (req, res) => {
      const newNewsletter = req.body;
      console.log(newNewsletter);
      const result = await newsletterCollection.insertOne(newNewsletter);
      res.send(result);
    })

    app.get('/newsletter', async (req, res) => {
      const cursor = newsletterCollection.find();
      const newsletter = await cursor.toArray();
      res.send(newsletter);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Port listening
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
