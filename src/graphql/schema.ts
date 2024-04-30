const typeDefs = `#graphql
  interface Content {
    id: ID!
    title: String!
    details: String!
    image: String!
    createdAt: String!
    keywords: [String]!
    tags: [String]!
  }

  type Blog implements Content {
    id: ID!
    title: String!
    details: String!
    image: String!
    createdAt: String!
    keywords: [String]!
    tags: [String]!
    htmlContent: String!
  }

  type Video implements Content {
    id: ID!
    title: String!
    details: String!
    image: String!
    createdAt: String!
    keywords: [String]!
    tags: [String]!
    videoUrl: String!
  }

  type Query {
    blogs: [Blog]
    videos: [Video]
  }

  input NewBlogInput {
    title: String!
    details: String!
    image: String!
    createdAt: String!
    keywords: [String]!
    tags: [String]!
    htmlContent: String!
  }

  input NewVideoInput {
    title: String!
    details: String!
    image: String!
    createdAt: String!
    keywords: [String]!
    tags: [String]!
    videoUrl: String!
  }

  type Mutation {
    createBlog(input: NewBlogInput!): Blog
    createVideo(input: NewVideoInput!): Video
  }
`;

export default typeDefs;
