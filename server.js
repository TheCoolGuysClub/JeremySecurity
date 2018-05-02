const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const morgan = require('morgan');

const authRoute = require('./routes/users.js');
const mongoose = require('./db/mongoose.js');

const port = process.env.PORT || 3000;

const app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({defaultLayout : 'main',
                          extname       : '.hbs'}))
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render('index');
})


//middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// Mount Routes
app.use('/', authRoute);

app.listen(port, () => {
  console.log(`Web server up on port ${port}`);
} )