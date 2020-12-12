import { PostGraphileOptions } from "postgraphile";

export const devOptions: PostGraphileOptions = {
  subscriptions: true,
  classicIds: true,
  watchPg: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  ignoreIndexes: false,
  showErrorStack: "json",
  extendedErrors: ["hint", "detail", "errcode"],
  appendPlugins: [require("@graphile-contrib/pg-simplify-inflector")],
  exportGqlSchemaPath: "schema.graphql",
  graphiql: true,
  enhanceGraphiql: true,
  allowExplain(req: any) {
    // TODO: customise condition!
    return true;
  },
  enableQueryBatching: true,
  legacyRelations: "omit",
  pgSettings: async req => ({})
};

export const prodOptions = {
  subscriptions: true,
  classicIds: true,
  retryOnInitFail: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  ignoreIndexes: false,
  extendedErrors: ["errcode"],
  appendPlugins: [require("@graphile-contrib/pg-simplify-inflector")],
  graphiql: false,
  enableQueryBatching: true,
  disableQueryLog: true, // our default logging has performance issues, but do make sure you have a logging system in place!
  legacyRelations: "omit",
  pgSettings: async req => ({})
};