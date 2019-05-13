var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var graphqlHTTP = require('express-graphql');
var schema = require('./graphql/podcastSchema');
var cors = require('cors');
var Podcast = require('./models/Podcast');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

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

app.use('/', indexRouter);

app.get('/populate', async (req, res) => {
  let Parser = require('rss-parser');
  let parser = new Parser();
  let feed = await parser.parseURL('http://www.deviante.com.br/podcasts/micangas/feed/');

  let podcast = Podcast.find({title: feed.title})
  if (!podcast) {
  podcast = new Podcast({title: feed.title,
                         description: feed.description,
                         url: feed.link })
  } else {
    console.log('here');
    Podcast.findOneAndUpdate({ title: feed.title }, { description: feed.description, url: feed.link });
  }
  if (!podcast.save()) {
    throw new Error('aaa');
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(podcast);
});

app.use('/graphql', cors(), graphqlHTTP({
  schema: schema,
  rootValue: global,
  graphiql: true
}));

module.exports = app;
