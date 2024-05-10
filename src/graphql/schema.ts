const typeDefs = `#graphql
  interface Content {
    id: ID!
    access: String  # public, close-friends, private
    title: String!
    details: String!
    image: String!
    createdAt: String!
    updatedAt: String
    keywords: [String]!
    tags: [String]!
  }

  type Blog implements Content {
    id: ID!
    title: String!
    access: String  # public, close-friends, private
    details: String!
    image: String!
    createdAt: String!
    updatedAt: String
    keywords: [String]!
    tags: [String]!
    htmlContent: String!
  }

  type Video implements Content {
    id: ID!
    title: String!
    access: String  # public, close-friends, private
    details: String!
    image: String!
    createdAt: String!
    updatedAt: String
    keywords: [String]!
    tags: [String]!
    videoUrl: String!
  }

  type Query {
    blogs: [Blog]
    videos: [Video]
    blog(id: ID!): Blog
    video(id: ID!): Video
    contents: [Content]
    accessContents(access: String!): [Content]
  }

  input NewBlogInput {
    title: String!
    details: String!
    access: String!  # public, close-friends, private
    image: String!
    createdAt: String!
    updatedAt: String
    keywords: [String]!
    tags: [String]!
    htmlContent: String!
  }

  input NewVideoInput {
    title: String!
    details: String!
    access: String!  # public, close-friends, private
    image: String!
    createdAt: String!
    updatedAt: String
    keywords: [String]!
    tags: [String]!
    videoUrl: String!
  }

  type Mutation {
    createBlog(input: NewBlogInput!): Blog
    createVideo(input: NewVideoInput!): Video
    updateBlog(id: ID!, input: NewBlogInput!): Blog
    updateVideo(id: ID!, input: NewVideoInput!): Video
    deleteBlog(id: ID!): Blog
    deleteVideo(id: ID!): Video
  }
`;

export default typeDefs;
