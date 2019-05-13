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
        resolve: (root, params) => {
          const podcastDetails = Podcast.find({title: params.title}).exec();
          if (!podcastDetails) {
            throw new Error('Error');
          }

          return podcastDetails;
        }
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: queryType });
