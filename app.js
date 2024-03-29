const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require('./schemas');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/EspressError');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yelp-camp', {})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
})

app.get('/', (req, res) => {
  res.render('home');
});

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  }
  else {
    next();
  }
}

app.get('/campgrounds', catchAsync(async (req, res) => {
  const camp_raw = await Campground.find({});
  const campgrounds = camp_raw.sort((a, b) => a.title.localeCompare(b.title));
  res.render('campgrounds/index', { campgrounds })
}))


app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})


app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
  // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`)
}))


app.get('/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/show', { campground })
})


app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground })
}))


app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${campground._id}`)
}))


app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  // Add functionality to delete more stuff here later.
  // For now, just delete the whole object.
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds')
})


app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})


app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})


app.listen(3000, () => console.log('Example app listening on port 3000!'))


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

