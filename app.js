const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yelp-camp', {

})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
})

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/makecampground', async (req, res) => {
  const camp = new Campground({ title: 'My Backyard', description: 'Cheap camping!' })
  await camp.save()
  res.send(camp);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

