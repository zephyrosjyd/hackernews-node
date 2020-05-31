const { GraphQLServer } = require('graphql-yoga');

// const typeDefs = `
// type Query {
//   info: String!
//   feed: [Link!]!
// }

// type Mutation {
//   post(url: String!, description: String!): Link!
// }

// type Link {
//   id: ID!
//   description: String!
//   url: String!
// }
// `;

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL',
}];

let idCount = links.length;
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args, context, info) => links.find((link) => link.id === args.id),
  },
  Mutation: {
    post: (parent, args, context) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, args) => {
      const idx = links.findIndex(({ id }) => id === args.id);
      links[idx] = { ...links[idx], ...args };
      return links[idx];
    },
    deleteLink: (parent, args) => {
      const idx = links.findIndex(({ id }) => id === args.id);
      const link = links[idx];
      delete links[idx];
      return link;
    },
  },
  Link: {
    id: (parent) => parent.id,
    description: (parent) => parent.description,
    url: (parent) => parent.url,
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
