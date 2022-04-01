"use strict";

/**
 *  author-profile controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const _ = require("lodash");
const {
  isSingleType,
  constants: { DP_PUB_STATE_LIVE },
} = require("@strapi/utils").contentTypes;

module.exports = createCoreController(
  "api::author-profile.author-profile",
  ({ strapi }) => ({
    async find(ctx) {
      const { query } = ctx;

      const findResult = await strapi
        .service("api::author-profile.author-profile")
        .find({
          ...query,
          isActive: true,
          blocked: false,
          populate: ["createdBy", "avatar"],
        });

      findResult.results = await Promise.all(
        findResult.results
          .map(
            strapi.service("api::author-profile.author-profile")
              .transformAuthorProfileEntity
          )
          .map(
            strapi.service("api::author-profile.author-profile")
              .populatePostCount
          )
      );

      return findResult;
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      const authorProfile = await strapi
        .query("api::author-profile.author-profile")
        .findOne({
          createdBy: id,
          isActive: true,
          blocked: false,
          populate: ["avatar", "createdBy"],
        });

      const author = strapi
        .service("api::author-profile.author-profile")
        .transformAuthorProfileEntity(authorProfile);

      return await strapi
        .service("api::author-profile.author-profile")
        .populatePostCount(author);
    },

    async findPosts(ctx) {
      const { id } = ctx.params;
      const posts = await strapi.service("api::post.post").find({
        filters: {
          createdBy: id,
        },
        publicationState: DP_PUB_STATE_LIVE,
      });
      return {
        ...posts,
        results: strapi
          .service("api::post.post")
          .populateAuthorOnMultiplePosts(posts),
      };
    },
  })
);
