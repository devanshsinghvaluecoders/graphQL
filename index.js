const express = require("express");
const { ApolloServer } = require("@apollo/server");
const bodyParser = require("body-parser");
const cors = require("cors");
const { expressMiddleware } = require("@apollo/server/express4");
const { axios } = require("axios");
async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
    type User{
        id:ID!
        name:String!
        username:String!
        email:String!
    }
        type Todo {
            id:ID!
            title:String!
            completed: Boolean!
            user:User
        }

        type Query{
            getTodos:[Todo]
            getUsers:[User]
            getUser(id:ID!):User
        }
        `,
    resolvers: {
      Todo: {
        user: async (todo) => {
          const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${todo.userId}`
          );
          const data = response.json();
          return data;
        },
      },
      Query: {
        getTodos: async () => {
          const response = await fetch(
            "https://jsonplaceholder.typicode.com/todos"
          );
          const data = response.json();
          return data;
        },
        getUsers: async () => {
          const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
          );
          const data = response.json();
          return data;
        },
        getUser: async (parent, { id }) => {
          const response = await fetch(
            `https://jsonplaceholder.typicode.com/users/${id}`
          );
          const data = response.json();
          return data;
        },
      },
    },
  });
  app.use(bodyParser.json());
  app.use(cors());
  await server.start();
  app.use("/graphql", expressMiddleware(server));
  app.listen(8000, () => {
    console.log("server started 8000");
  });
}
startServer();
