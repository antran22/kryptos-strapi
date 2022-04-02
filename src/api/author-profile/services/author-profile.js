"use strict";

/**
 * author-profile service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::author-profile.author-profile",
  ({ strapi }) => ({
    async countPostByAuthor(authorId) {
      return strapi.query("api::post.post").count({
        where: {
          createdBy: authorId,
        },
      });
    },

    transformAuthorProfileEntity(raw) {
      const id = raw.createdBy.id;

      return {
        id,
        bio: raw.bio,
        avatar: raw.avatar,
        name: raw.createdBy.firstname + " " + raw.createdBy.lastname,
        email: raw.createdBy.email,
      };
    },

    async populatePostCount(author) {
      const id = author.id;
      const postCount = await strapi
        .service("api::author-profile.author-profile")
        .countPostByAuthor(id);

      return {
        ...author,
        postCount,
      };
    },
  })
);
