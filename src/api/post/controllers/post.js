"use strict";

/**
 *  post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

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
    const { params } = ctx;
    const post = await strapi
      .service("api::post.post")
      .findOne(params.id, ctx.query);
    if (!post) {
      return ctx.notFound();
    }
    const postWithAuthor = await strapi
      .service("api::post.post")
      .populateAuthor(post);

    return strapi.service("api::post.post").trimLocalizations(postWithAuthor);
  },
}));
