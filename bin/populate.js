var mongoose = require('mongoose');
var Podcast = require('../models/Podcast');
var Episode = require('../models/Episode');
var Parser = require('rss-parser');

mongoose.connect('mongodb://localhost/podcast', { promiseLibrary: require('bluebird'), useNewUrlParser: true })
        .then(() => console.log('connection successful'))
        .catch((err) => console.error(err))

const podcastUrls = [
  'http://www.deviante.com.br/podcasts/scicast/feed/',
  'http://www.deviante.com.br/podcasts/beco-da-bike/feed/',
  'http://www.deviante.com.br/podcasts/contrafactual/feed/',
  'http://www.deviante.com.br/podcasts/costelasehidromel/feed/',
  'http://www.deviante.com.br/podcasts/chutandoaescada/feed/',
  'http://www.deviante.com.br/podcasts/derivadas/feed/',
  'http://www.deviante.com.br/podcasts/fronteirasnotempo/feed/',
  'http://www.deviante.com.br/podcasts/meialua/feed/',
  'http://www.deviante.com.br/podcasts/micangas/feed/',
  'http://www.deviante.com.br/podcasts/npix/feed/',
  'http://www.deviante.com.br/podcasts/rpguaxa/feed/',
  'http://www.deviante.com.br/podcasts/spin/feed/',
  'http://www.deviante.com.br/podcasts/sociedade-brasileira-de-nefrologia/feed/',
]

var populate = async (url) => {
  let parser = new Parser();
  let feed = await parser.parseURL(url);

  console.log(url);
  Podcast.findOne({ title: feed.title }, (err, podcast) => {
    if (err) {
      console.error(err);
      return;
    }

    const podcast_params = {
      title: feed.title,
      description: feed.description,
      url: feed.link,
      imageUrl: feed.image.url,
      imageTitle: feed.image.title
    }

    if (podcast) {
      podcast.updateOne(podcast_params, {}, (err, _podcast) => {err && console.error(err)});
    } else {
      podcast = new Podcast(podcast_params).save((err, _podcast) => {err && console.error(err)});
    }

    feed.items.map((item) => {
      Episode.findOne({ title: item.title }, (err, episode) => {
        if (err) {
          console.error(err);
          return;
        }

        if (!item.enclosure) return;

        const episode_params = {
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          length: item.enclosure.length,
          categories: item.categories,
          imageUrl: item.itunes.image,
          podcastId: podcast._id
        }

        if (episode) {
          episode.updateOne(episode_params, {}, (err, _episode) => {err && console.error(err)});
        } else {
          new Episode(episode_params).save((err, _episode) => {err && console.error(err)});
        }
      });
    });

    // TODO: Find the correct way to close connection and finish the script.
    //mongoose.connection.close();
    //process.exit();
  });
}

try {
  podcastUrls.forEach((url) => populate(url));
} catch(e) {
  console.error(e);
}
