"use strict";

/**
 * author-profile router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/authors",
      handler: "author-profile.find",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/authors/:id",
      handler: "author-profile.findOne",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/authors/:id/posts",
      handler: "author-profile.findPosts",
      config: {
        auth: false,
      },
    },
  ],
};
