"use strict";

/**
 *  page-setting controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::page-setting.page-setting",
  ({ strapi }) => ({
    async find(ctx) {
      return strapi.service("api::page-setting.page-setting").find(ctx.query);
    },
  })
);
