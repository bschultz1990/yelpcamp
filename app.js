const express = require('express');
const app = express();
const path = require('path');

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

