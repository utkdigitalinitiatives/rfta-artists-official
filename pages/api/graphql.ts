import { ApolloServer, gql } from "apollo-server-micro";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";
import { makeExecutableSchema } from "@graphql-tools/schema";
import slugify from "slugify";

const loadCanopyJson = <T>(filename: string, fallback: T): T => {
  // This module is imported by both API routes and page code.
  // Avoid touching node-only paths during browser bundling.
  if (typeof window !== "undefined") return fallback;

  try {
    if (filename === "collections.json") {
      return require("../../.canopy/collections.json") as T;
    }
    if (filename === "manifests.json") {
      return require("../../.canopy/manifests.json") as T;
    }
    if (filename === "metadata.json") {
      return require("../../.canopy/metadata.json") as T;
    }
  } catch (error) {
    console.error(`Failed to load .canopy/${filename}:`, error);
  }

  return fallback;
};

const CANOPY_COLLECTIONS = loadCanopyJson<any[]>("collections.json", []);
const CANOPY_MANIFESTS = loadCanopyJson<any[]>("manifests.json", []);
const CANOPY_METADATA = loadCanopyJson<any[]>("metadata.json", []);

const typeDefs = gql`
  type Query {
    collections: [Collection]
    collectionItems: [CollectionItem]
    manifests(limit: Int, offset: Int, id: [String]): [Manifest]
    metadata(id: String, label: String): [Metadata]
    getManifest(slug: ID): Manifest
  }

  type Collection {
    id: String
    label: [String]
    items: [CollectionItem]
    collections: Int
    manifests: Int
    depth: Int
    parent: String
    slug: ID
  }

  type CollectionItem {
    id: String
    label: [String]
    type: String
    parent: String
  }

  type Manifest {
    collectionId: ID
    id: ID
    label: [String]
    metadata: [Metadata]
    slug: ID
  }

  type Metadata {
    manifestId: String
    label: String
    value: String
    thumbnail: String
  }
`;

const resolvers = {
  Query: {
    collections: async (_, __, context) => {
      return CANOPY_COLLECTIONS;
    },
    collectionItems: async (_, __, context) => {
      return CANOPY_COLLECTIONS?.[0]?.items || [];
    },
    manifests: async (_, { limit, offset, id }, context) => {
      return CANOPY_MANIFESTS;
    },

    metadata: async (_, { id, label }, context) => {
      if (CANOPY_METADATA) return CANOPY_METADATA;
    },

    getManifest: async (_, { slug }, context) => {
      return CANOPY_MANIFESTS.filter(
        (item) =>
          slug ===
          slugify(item.label[0], {
            lower: true,
            strict: true,
            trim: true,
          }),
      )[0];
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const apolloServer =
  typeof window === "undefined" ? new ApolloServer({ schema }) : (null as any);

const startServer = typeof window === "undefined" ? apolloServer.start() : null;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new SchemaLink({ schema }),
  ssrMode: true,
  ssrForceFetchDelay: 100,
});

export const getGraphQL = (query) =>
  fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then((json) => json.data);
