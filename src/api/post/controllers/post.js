"use strict";

/**
 *  post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const _ = require("lodash");
const { stripImageField } = require("../../../utils");

module.exports = createCoreController("api::post.post", ({ strapi }) => ({
  async find(ctx) {
    const query = _.merge(ctx.query, {
      populate: ["createdBy", "localizations", "category", "thumbnail"],
    });

    const { results, pagination } = await strapi
      .service("api::post.post")
      .find(query);

    const postsWithAuthor = await strapi
      .service("api::post.post")
      .populateAuthorOnMultiplePosts(results);

    const postsWithSlimLocalization = postsWithAuthor.map(
      strapi.service("api::post.post").trimLocalizations
    );

    const postsWithSlimImage = postsWithSlimLocalization.map((post) =>
      stripImageField(post, "thumbnail")
    );

    return {
      pagination,
      results: postsWithSlimImage,
    };
  },

  async findOne(ctx) {
    const { id: slug } = ctx.params;
    const query = _.merge(ctx.query, {
      filters: { slug: { $eq: slug } },
      locale: "all",
      populate: ["createdBy", "localizations", "category", "thumbnail"],
    });

    const { results: posts } = await strapi
      .service("api::post.post")
      .find(query);
    if (!posts || posts.length === 0) {
      return ctx.notFound();
    }
    const post = posts[0];

    const postWithAuthor = await strapi
      .service("api::post.post")
      .populateAuthor(post);

    const postWithSlimImage = stripImageField(postWithAuthor, "thumbnail");

    return strapi
      .service("api::post.post")
      .trimLocalizations(postWithSlimImage);
  },
}));
