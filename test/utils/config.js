module.exports = {
   base: {
      table_name: "testTable",
      attributes: {
         uuid: { type: "uuid", primaryKey: true },
         string: "string",
         json: "json",
         datetime: "datetime",
         obj1: { type: "string" },
         col: { type: "string", column_name: "columnName" },
         attr: { type: "string", attr_name: "attr_name" },
      },
   },
   baseNoAdds: {
      attributes: {
         createdAt: false,
         updatedAt: false,
      },
   },
   connectionA: {
      table_name: "A",
      attributes: {
         one_one: {
            model: "connectionB",
         },
         one_many: {
            model: "connectionB",
         },
         many_many: {
            collection: "connectionB",
            via: "many_manyb",
         },
         noModel: {
            model: "connectionZ",
         },
         noOtherAttribute: {
            model: "connectionC",
         },
      },
   },
   connectionB: {
      table_name: "B",
      attributes: {
         one_one: {
            model: "connectionA",
         },
         many_one: {
            collection: "connectionA",
            via: "one_many",
         },
         many_manyb: {
            collection: "connectionA",
            dominant: true,
            via: "many_many",
         },
      },
   },
   connectionC: {
      table_name: "B",
      attributes: {},
   },
};
