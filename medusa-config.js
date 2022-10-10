const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-store";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const STRIPE_API_KEY = process.env.STRIPE_API_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST;
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY;

// This is the place to include plugins. See API documentation for a thorough guide on plugins.
const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: STRIPE_API_KEY,
      webhook_secret: STRIPE_WEBHOOK_SECRET,
    },
  },
  {
    resolve: `medusa-file-s3`,
    options: {
      s3_url: "https://fishing-medusa-storage.s3.eu-central-1.amazonaws.com",
      bucket: "fishing-medusa-storage",
      region: "eu-central-1",
      access_key_id: "AKIAUU7K2D3UEFDU3KFL",
      secret_access_key: "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",
    },
  },
  {
    resolve: `medusa-plugin-meilisearch`,
    options: {
      // config object passed when creating an instance of the MeiliSearch client
      config: {
        host: MEILISEARCH_HOST,
        apiKey: MEILISEARCH_API_KEY,
      },
      settings: {
        // index name
        products: {
          // MeiliSearch's setting options to be set on a particular index
          searchableAttributes: ["title", "description", "variant_sku"],
          displayedAttributes: [
            "id",
            "title",
            "description",
            "variant_sku",
            "thumbnail",
            "handle",
            "hs_code",
            "updated_at",
            "variants.prices.amount",
            "variants.inventory_quantity",
            "collection.handle",
            "status",
          ],
          sortableAttributes: [
            "updated_at",
            "created_at",
            "variants.prices.amount",
            "variants.inventory_quantity",
          ],
          filterableAttributes: [
            "updated_at",
            "created_at",
            "collection.metadata.parent",
            "variants.prices.amount",
            "collection.title",
            "collection.handle",
            "hs_code",
            "tags.value",
            "status",
          ],
        },
      },
    },
  },
];

module.exports = {
  projectConfig: {
    redis_url: REDIS_URL,
    database_url: DATABASE_URL,
    database_type: "postgres",
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
  },
  plugins,
};
