const connectToMongo = require('./db'); 
const express = require('express');

const app = express();
const port = 5000;

app.use(express.json());

//available routes

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

async function startServer() {
  await connectToMongo(); 



  app.listen(port, () => {
    console.log(`iNotebook backend listening on port ${port}`);
  });
}

startServer(); 
