var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var graphqlHTTP = require('express-graphql');
var schema = require('./graphql/podcastSchema');
var cors = require('cors');
var Podcast = require('./models/Podcast');
var Episode = require('./models/Episode');
var CurrentTime = require('./models/CurrentTime');

mongoose.connect('mongodb://localhost/podcast', { promiseLibrary: require('bluebird'), useNewUrlParser: true })
        .then(() => console.log('connection successful'))
        .catch((err) => console.error(err));

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('*', cors());

app.use('/api', cors(), graphqlHTTP({
  schema: schema,
  rootValue: global,
  graphiql: true
}));

module.exports = app;
