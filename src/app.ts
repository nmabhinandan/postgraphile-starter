import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import postgraphile, { PostGraphileResponse, PostGraphileResponseFastify3 } from 'postgraphile';
import { devOptions } from './graphileOptions';

const middleware = postgraphile(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ["graphile"], 
  devOptions
);

function createServer() {
  const server = fastify({ logger: { prettyPrint: true } });
  
  const convertHandler = (handler: (res: PostGraphileResponse) => Promise<void>) => (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => handler(new PostGraphileResponseFastify3(request, reply));

  server.options(middleware.graphqlRoute, convertHandler(middleware.graphqlRouteHandler));
  server.post(middleware.graphqlRoute, convertHandler(middleware.graphqlRouteHandler));

  if (middleware.options.graphiql) {
    if (middleware.graphiqlRouteHandler) {
      server.head(middleware.graphiqlRoute, convertHandler(middleware.graphiqlRouteHandler));
      server.get(middleware.graphiqlRoute, convertHandler(middleware.graphiqlRouteHandler));
    }
    if (middleware.faviconRouteHandler) {
      server.get('/favicon.ico', convertHandler(middleware.faviconRouteHandler));
    }
  }

  if (middleware.options.watchPg) {
    if (middleware.eventStreamRouteHandler) {
      server.options(
        middleware.eventStreamRoute,
        convertHandler(middleware.eventStreamRouteHandler),
      );
      server.get(middleware.eventStreamRoute, convertHandler(middleware.eventStreamRouteHandler));
    }
  }
  

  server.setErrorHandler((error, req, res) => {
    req.log.error(error.toString());
    res.send({ error });
  });

  return { server, middleware };
}

export default createServer;
