"use strict";

/**
 * post service.
 */

const { createCoreService } = require("@strapi/strapi").factories;
const { stripImageField } = require("../../../utils");
const _ = require("lodash");

module.exports = createCoreService("api::post.post", ({ strapi }) => ({
  async transformCreatedByToAuthor(post) {
    if (!_.isObject(post.createdBy)) {
      const authorId = post.createdBy;

      const authorProfile = await strapi
        .query("api::author-profile.author-profile")
        .findOne({
          createdBy: authorId,
          isActive: true,
          blocked: false,
          populate: ["avatar", "createdBy"],
        });
      if (!authorProfile) {
        return post;
      }
      const author = {
        id,
        bio: authorProfile.bio,
        avatar: authorProfile.avatar,
        name:
          authorProfile.createdBy.firstname +
          " " +
          authorProfile.createdBy.lastname,
        email: authorProfile.createdBy.email,
      };

      return {
        ..._.omit(post, "createdBy"),
        author: stripImageField(author, "avatar"),
      };
    }

    let authorProfile = await strapi
      .query("api::author-profile.author-profile")
      .findOne({
        createdBy: post.createdBy.id,
        isActive: true,
        blocked: false,
        populate: ["avatar"],
      });

    if (!authorProfile) {
      authorProfile = {
        bio: "Bio",
      };
    }

    const author = {
      id: post.createdBy.id,
      bio: authorProfile.bio,
      avatar: authorProfile.avatar,
      name: post.createdBy.firstname + " " + post.createdBy.lastname,
      email: post.createdBy.email,
    };

    return {
      ..._.omit(post, "createdBy"),
      author: stripImageField(author, "avatar"),
    };
  },

  async populateAuthorOnMultiplePosts(posts) {
    return Promise.all(
      posts.map((post) =>
        strapi.service("api::post.post").transformCreatedByToAuthor(post)
      )
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
