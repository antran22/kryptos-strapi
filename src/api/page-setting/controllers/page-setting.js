"use strict";

const { stripImageField } = require("../../../utils");
/**
 *  page-setting controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::page-setting.page-setting",
  ({ strapi }) => ({
    async find(ctx) {
      const locale = ctx.query.locale;
      if (!locale || locale === "all") {
        return ctx.notFound();
      }
      const pageSettings = await strapi
        .query("api::page-setting.page-setting")
        .findMany({
          where: { locale },
          populate: ["featured_posts.thumbnail"],
        });

      const pageSetting = pageSettings[0];
      const posts = pageSetting.featured_posts;
      const postsWithSlimImage = posts.map((post) => {
        return stripImageField(post, "thumbnail");
      });
      return {
        ...pageSetting,
        featured_posts: postsWithSlimImage,
      };
    },
  })
);
