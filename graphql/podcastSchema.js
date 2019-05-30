var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLFloat = require('graphql').GraphQLFloat;
var GraphQLDate = require('graphql-date');
var Podcast = require('../models/Podcast');
var Episode = require('../models/Episode');
var CurrentTime = require('../models/CurrentTime');

var podcastType = new GraphQLObjectType({
  name: 'podcast',
  fields: () => {
    return {
      _id: { type: GraphQLString },
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      url: { type: GraphQLString },
      updated_at: { type: GraphQLDate },
      image_url: { type: GraphQLString },
      image_title: { type: GraphQLString }
    }
  }
});

var episodeType = new GraphQLObjectType({
  name: 'episode',
  fields: () => {
    return {
      _id: { type: GraphQLString },
      title: { type: GraphQLString },
      url: { type: GraphQLString },
      length: { type: GraphQLInt },
      currentTime: { type: GraphQLFloat },
      link: { type: GraphQLString },
      pubDate: { type: GraphQLDate },
      categories: { type: new GraphQLList(GraphQLString) },
      image_url: { type: GraphQLString }
    }
  }
});

var currentTimeType = new GraphQLObjectType({
  name: 'currentTime',
  fields: () => {
    return {
      episodeId: { type: GraphQLString },
      currentTime: { type: GraphQLFloat }
    }
  }
});

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => {
    return {
      podcasts: {
        type: new GraphQLList(podcastType),
        resolve: () =>{
          const podcasts = Podcast.find().exec()
          if (!podcasts) {
            throw new Error('Error');
          }

          return podcasts;
        }
      },
      podcast: {
        type: podcastType,
        args: {
          _id: { name: '_id', type: GraphQLString },
          title: { name: 'title', type: GraphQLString }
        },
        resolve: (root, params) => {
          const podcastDetails = Podcast.findOne({title: params.title}).exec();
          if (!podcastDetails) {
            throw new Error('Error');
          }

          return podcastDetails;
        }
      },
      episodes: {
        type: new GraphQLList(episodeType),
        args: {
          limit: { name: 'limit', type: GraphQLInt }
        },
        resolve: async (root, params) => {
          const limit = params.limit || 10;
          const episodes = await Episode.find().limit(limit).exec();
          let result = []
          result = episodes.map(async (episode, index) => {
            let currentTime = await CurrentTime.findOne({episodeId: episode._id}).exec();
            episode.currentTime = currentTime ? currentTime.currentTime : 0;

            return episode;
          });

          return result;
        }
      },
      episode: {
        type: episodeType,
        args: {
          _id: { name: '_id', type: GraphQLString }
        },
        resolve: async (root, params) => {
          const episodeDetails = await Episode.findOne({_id: params._id}).exec();
          const currentTimeDetails = await CurrentTime.findOne({episodeId: params._id}).exec();
          if (!episodeDetails) {
            throw new Error('Error');
          }

          episodeDetails.currentTime = currentTimeDetails.currentTime;

          return episodeDetails;
        }
      },
      currentTimes: {
        type: new GraphQLList(currentTimeType),
        resolve: () => {
          const currentTimes = CurrentTime.find().exec();

          return currentTimes;
        }
      }
    }
  }
});

var mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function () {
    return {
      removePodcast: {
        type: podcastType,
        args: {
          title: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          const removePodcast = Podcast.findOneAndRemove({title: params.title}).exec();
          if (!removePodcast) {
            throw new Error('Error')
          }
          return removePodcast;
        }
      },
      removeAllEpisodes: {
        type: new GraphQLList(episodeType),
        resolve(root, params) {
          const removeEpisodes = Episode.deleteMany({}).exec();
          if (!removeEpisodes) {
            throw new Error('Error')
          }
          return removeAllEpisodes;
        }
      },
      saveCurrentTime: {
        type: currentTimeType,
        args: {
          episodeId: { name: 'episodeId', type: GraphQLString },
          currentTime: { name: 'currentTime', type: GraphQLFloat }
        },
        resolve(root, params) {
          CurrentTime.deleteMany({ episodeId: params.episodeId }).exec();
          const currentTime = new CurrentTime(params);
          currentTime.save();
          return currentTime;
        }
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
