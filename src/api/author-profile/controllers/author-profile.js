"use strict";

/**
 *  author-profile controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const _ = require("lodash");
const { stripImageField } = require("../../../utils");
const {
  isSingleType,
  constants: { DP_PUB_STATE_LIVE },
} = require("@strapi/utils").contentTypes;

module.exports = createCoreController(
  "api::author-profile.author-profile",
  ({ strapi }) => ({
    async find(ctx) {
      const { query } = ctx;

      const authors = await strapi
        .service("api::author-profile.author-profile")
        .find({
          ...query,
          isActive: true,
          blocked: false,
          populate: ["createdBy", "avatar"],
        });

      const authorWithPostCount = await Promise.all(
        authors.results
          .map(
            strapi.service("api::author-profile.author-profile")
              .transformAuthorProfileEntity
          )
          .map(
            strapi.service("api::author-profile.author-profile")
              .populatePostCount
          )
      );

      const authorsWithSlimAvatar = authorWithPostCount.map((author) =>
        stripImageField(author, "avatar")
      );

      return { ...authors, results: authorsWithSlimAvatar };
    },

    async findOne(ctx) {
      const { id } = ctx.params;

      const authorProfileResponse = await strapi
        .service("api::author-profile.author-profile")
        .find({
          filters: {
            createdBy: parseInt(id),
          },
          populate: ["avatar", "createdBy"],
        });

      if (
        !authorProfileResponse.results ||
        authorProfileResponse.results.length === 0
      ) {
        return ctx.notFound();
      }
      const authorProfile = authorProfileResponse.results[0];

      const author = strapi
        .service("api::author-profile.author-profile")
        .transformAuthorProfileEntity(authorProfile);

      const authorWithPostCount = await strapi
        .service("api::author-profile.author-profile")
        .populatePostCount(author);

      return stripImageField(authorWithPostCount, "avatar");
    },

    async findPosts(ctx) {
      const { id } = ctx.params;
      const posts = await strapi.service("api::post.post").find({
        filters: {
          createdBy: id,
        },
        populate: ["thumbnail"],
        publicationState: DP_PUB_STATE_LIVE,
      });
      const postsWithAuthor = await strapi
        .service("api::post.post")
        .populateAuthorOnMultiplePosts(posts.results);

      const postsWithSlimThumbnail = postsWithAuthor.map((post) =>
        stripImageField(post, "thumbnail")
      );
      return {
        ...posts,
        results: postsWithSlimThumbnail,
      };
    },
  })
);
