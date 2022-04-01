module.exports = {
  async beforeCreate(event) {
    const { data, where, select, populate } = event.params;
    const other = await strapi
      .query("api::author-profile.author-profile")
      .findOne({
        where: {
          createdBy: data.createdBy,
        },
      });
    if (other) {
      throw new Error("You cannot create more than one profile for you");
    }
  },
  async beforeUpdate(event) {
    const { data, where } = event.params;
    const currentData = await strapi
      .query("api::author-profile.author-profile")
      .findOne({
        where,
        populate: ["createdBy"],
      });
    if (currentData.createdBy.id !== data.updatedBy) {
      throw new Error("You cannot update other people profile");
    }
  },
};
