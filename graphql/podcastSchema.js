var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var Podcast = require('../models/Podcast');
var Episode = require('../models/Episode');

var podcastType = new GraphQLObjectType({
  name: 'podcast',
  fields: () => {
    return {
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      url: { type: GraphQLString },
      updated_at: { type: GraphQLDate }
    }
  }
});

var episodeType = new GraphQLObjectType({
  name: 'episode',
  fields: () => {
    return {
      title: { type: GraphQLString },
      url: { type: GraphQLString }
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
        resolve: (root, params) => {
          const limit = params.limit || 10;
          console.log(limit);
          const episodes = Episode.find().limit(limit).exec();
          if (!episodes) {
            throw new Error('Error');
          }

          return episodes;
        }
      },
      episode: {
        type: episodeType,
        resolve: (root, params) => {
          const episodeDetails = Episode.find({title: params.title}).exec();
          if (!episodeDetails) {
            throw new Error('Error');
          }

          return null;
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
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });
