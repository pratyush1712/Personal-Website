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
    blogs(offset:Int, limit:Int): [Blog]
    videos(offset:Int, limit:Int): [Video]
    blog(id: ID!): Blog
    video(id: ID!): Video
    contents(offset:Int, limit:Int): [Content]
    accessContents(access: String!, offset:Int, limit:Int): [Content]
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
