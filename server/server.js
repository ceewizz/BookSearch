const express = require('express');
const path = require('path');

// Appollo server
const { ApolloServer } = require('apollo-server-express');

// Importing the typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');

const { authMiddleware } = require("./utils/auth");

// For the db connection
const db = require('./config/connection');



const PORT = process.env.PORT || 3001;
const app = express();


// For the apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});




app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// const _dirname = path.dirname("");
// const buildPath = path.join(_dirname, "../client/build");

// app.use(express.static(buildPath));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(_dirname, '../client/build/index.html'));
});

// Using apollo with express
// server.applyMiddleware({ app });

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });
}

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  })
})

startApolloServer(typeDefs, resolvers);


// app.use(routes);

// db.once('open', () => {
  // app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });
