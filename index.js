const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

app.use([cors(), express.json()]);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.o8p26h6.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const todosCollection = client.db("AllTodo").collection("todos");
    app.get("/todos", async (_req, res) => {
      const query = {};
      const cursor = todosCollection.find(query);
      const todos = await cursor.toArray();
      res.send(todos);
    });
    app.post("/todos", async (req, res) => {
      const todo = req.body;
      await todosCollection.insertOne(todo);
      res.send(todo);
    });
    app.put("/todos/:id", async (req, res) => {
      const id = req.params.id;
      const todo = req.body;

      const filter = { _id: ObjectId(id) };
      const updateTodo = {
        $set: todo,
      };
      const result = await todosCollection.updateOne(filter, updateTodo);
      return res.send(result);
    });

    app.delete("/todos/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await todosCollection.deleteOne(filter);
      res.send(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);
app.get("/", (_req, res) => {
  res.send("todo crud server running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
