const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const artistsRouter = require('./routes/artists');
const artworkRoutes = require('./routes/artwork');
const workshopRoutes = require('./routes/workshop');
const User = require('./models/user');
const Artwork = require('./models/artwork');
const Workshop = require('./models/workshop');

const app = express();

const crypto = require('crypto');

const generateRandomKey = () => {
  return crypto.randomBytes(32).toString('hex'); 
};

const secretKey = generateRandomKey();
console.log('Generated Secret Key:', secretKey);

mongoose.connect('mongodb://localhost/store22', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(session({
	secret: secretKey, 
	resave: false,
	saveUninitialized: true,
  }));

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use((req, res, next) => {
  res.locals.currentUser = req.session.userId;
  next();
});

app.get('/', (req, res) => {
  
  res.redirect('/login');
});

app.use('/user', userRoutes);

app.use('/artwork', artworkRoutes);

app.use('/workshop', workshopRoutes);

app.use('/artists', artistsRouter);

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      
      return res.render('register', { error: 'Username already exists. Please choose a different username.' });
    }

    
    const user = await User.create({ username, password });
    req.session.userId = user._id;
    res.redirect('/user/account');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/login', async (req, res) => {
  
  if (req.session.userId) {
    return res.redirect('/user/account');
  }

  const { username, password } = req.body;

  try {
    
    const user = await User.findOne({ username });

    if (user) {
      
      const isPasswordValid = await user.comparePassword(password);

      if (isPasswordValid) {
        
        if (req.session.userId) {
          if (req.session.userId !== user._id) {
            return res.render('login', { error: 'Multiple users logged in at the same browser window' });
          }
          return res.redirect('/user/account'); 
        }

        req.session.userId = user._id;
        return res.redirect('/user/account');
      } else {
        return res.render('login', { error: 'Invalid username or password' });
      }
    } else {
      return res.render('login', { error: 'Invalid username' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



app.get('/logout', (req, res) => {
  if (!req.session.userId) {
    
    return res.redirect('/login');
  }

  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      if (req.session) {
        delete req.session.userId;
      }

      res.redirect('/login');
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});







