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

app.get('/populate', async (req, res) => {
  let Parser = require('rss-parser');
  let parser = new Parser();
  let feed = await parser.parseURL('http://www.deviante.com.br/podcasts/spin/feed/');

  let podcast = await Podcast.findOne({title: feed.title}).exec();
  if (!podcast) {
    podcast = new Podcast({title: feed.title,
      description: feed.description,
      url: feed.link,
      image_url: feed.image.url,
      image_title: feed.image.title
    })
    podcast.save();
  }

  feed.items.map(async (item) => {
    let episode = await Episode.findOne({title: item.title}).exec();
    if (!episode && item.url) {
      episode = new Episode({title: item.title,
        url: item.enclosure.url,
        link: item.link,
        pubDate: item.pubDate,
        length: item.enclosure.length,
        categories: item.categories,
        image_url: item.itunes.image
      })
      episode.save();
    }
  });

  res.setHeader('Content-Type', 'application/json');
  res.status(201);
  res.send('');
});

app.use('/api', cors(), graphqlHTTP({
  schema: schema,
  rootValue: global,
  graphiql: true
}));

module.exports = app;
