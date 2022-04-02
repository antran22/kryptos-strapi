"use strict";

/**
 * post service.
 */

const { createCoreService } = require("@strapi/strapi").factories;
const { stripImageField } = require("../../../utils");
const _ = require("lodash");

module.exports = createCoreService("api::post.post", ({ strapi }) => ({
  async populateAuthor(post) {
    const authorId = post.createdBy;

    const authorProfile = await strapi
      .query("api::author-profile.author-profile")
      .findOne({
        createdBy: authorId,
        isActive: true,
        blocked: false,
        populate: ["avatar", "createdBy"],
      });

    const author = strapi
      .service("api::author-profile.author-profile")
      .transformAuthorProfileEntity(authorProfile);

    return {
      ..._.omit(post, "createdBy"),
      author: stripImageField(author, "avatar"),
    };
  },

  async populateAuthorOnMultiplePosts(posts) {
    return Promise.all(
      posts.map((post) => strapi.service("api::post.post").populateAuthor(post))
    );
  },

  trimLocalizations(post) {
    if (post.localizations) {
      return {
        ...post,
        localizations: post.localizations.map((localization) => ({
          id: localization.id,
          slug: localization.slug,
          locale: localization.locale,
        })),
      };
    }
    return post;
  },
}));
