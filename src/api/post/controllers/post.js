"use strict";

/**
 *  post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
const _ = require("lodash");

module.exports = createCoreController("api::post.post", ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    const { results, pagination } = await strapi
      .service("api::post.post")
      .find(query);

    const postsWithAuthor = await strapi
      .service("api::post.post")
      .populateAuthorOnMultiplePosts(results);

    const postsWithSlimLocalization = postsWithAuthor.map(
      strapi.service("api::post.post").trimLocalizations
    );
    return {
      pagination,
      results: postsWithSlimLocalization,
    };
  },

  async findOne(ctx) {
    const { id: slug } = ctx.params;
    const query = _.merge(ctx.query, {
      filters: { slug: { $eq: slug } },
      locale: "all",
      populate: ["createdBy", "localizations"],
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

    return strapi.service("api::post.post").trimLocalizations(postWithAuthor);
  },
}));
