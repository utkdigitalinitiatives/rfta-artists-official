import { ApolloServer, gql } from "apollo-server-micro";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";
import { makeExecutableSchema } from "@graphql-tools/schema";
import slugify from "slugify";
import { NextApiRequest, NextApiResponse } from 'next';
import CANOPY_COLLECTIONS from "@/.canopy/collections.json";
import CANOPY_MANIFESTS from "@/.canopy/manifests.json";
import CANOPY_METADATA from "@/.canopy/metadata.json";

type CanopyManifest = {
  id?: string;
  slug?: string;
  label?: string[];
  metadata?: unknown[];
};

const manifests = CANOPY_MANIFESTS as CanopyManifest[];

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
    thumbnail: String
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
    collections: async (_: any, __: any, context: any) => {
      return CANOPY_COLLECTIONS;
    },
    collectionItems: async (_: any, __: any, context: any) => {
      return (CANOPY_COLLECTIONS as any).items || [];
    },
    manifests: async (_: any, { limit, offset, id }: { limit?: number; offset?: number; id?: string[] }, context: any) => {
      return manifests;
    },

    metadata: async (_: any, { id, label }: { id?: string; label?: string }, context: any) => {
      if (CANOPY_METADATA) return CANOPY_METADATA;
    },

    getManifest: async (_: any, { slug }: { slug: string }, context: any) => {
      return manifests.find((item) => {
        const label = item.label?.[0] || "";
        return (
          slug ===
          slugify(label, {
            lower: true,
            strict: true,
            trim: true,
          })
        );
      });
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const apolloServer = new ApolloServer({
  schema,
});

const startServer = apolloServer.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
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

export const getGraphQL = (query: any) =>
  fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then((json) => json.data);
