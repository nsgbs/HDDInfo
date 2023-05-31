const { exec } = require('child_process');
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req,res) =>{
  //res.send("Funcionando topperson. testando o nodemon");
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => {
  console.log("server exec on port 3000");
});