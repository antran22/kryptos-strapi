const _ = require("lodash");

module.exports = {
  stripImageField(entity, fieldName) {
    if (entity[fieldName] && entity[fieldName].url) {
      return {
        ...entity,
        [fieldName]: _.pick(
          entity[fieldName],
          "id",
          "name",
          "alternativeText",
          "caption",
          "width",
          "height",
          "url"
        ),
      };
    }

    return entity;
  },
};
