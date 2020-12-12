import 'dotenv/config';
import { createDb, migrate } from "postgres-migrations";
import createServer from './app';

 
async function init() {
  const dbConfig = {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_NAME),
  }
 
  await createDb(process.env.DB_NAME, {
    ...dbConfig,
    defaultDatabase: "postgres", // defaults to "postgres"
  })
  await migrate(dbConfig, "src/migrations")
}

init()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    const { server, middleware } = createServer();
    
    server.listen(+PORT, "0.0.0.0", (err, host) => {
      if (err) throw err;
      console.log(`Access GraphQL at ${host}${middleware.graphiqlRoute} 🚀`);
    });  
  })
  .catch(console.error);

