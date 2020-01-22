const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const PORT = 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use('/build', express.static(path.resolve(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './index.html'));
})

app.post('/films', (req, res) => {
  //add film to databse
})


app.listen(PORT, function(){
  console.log(`Listening on port ${PORT}`);
})