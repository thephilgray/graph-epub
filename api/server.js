const { GraphQLServer } = require('graphql-yoga');
const jsonServer = require('json-server');
const Mutation = require('./resolvers/Mutation.js');
const Query = require('./resolvers/Query.js');
const typeDefs = require('./resolvers/typeDefs.js');

const resolvers = {
  Mutation,
  Query
};

(async function() {
  const restServer = jsonServer.create();
  const restRouter = jsonServer.router('api/db.json');
  const restMiddleWares = jsonServer.defaults();
  const restOptions = {
    port: 5000
  };

  restServer.use(restMiddleWares);
  restServer.use(restRouter);
  restServer.listen(restOptions.port, async () => {
    const server = new GraphQLServer({ typeDefs, resolvers });
    const graphOptions = {
      port: 4000
    };
    await server.start(graphOptions, ({ port }) => {
      console.log(`Rest api is running on ${db}`);
      console.log(`Graphql api is running on http://localhost:${port}`);
    });
  });
})();
