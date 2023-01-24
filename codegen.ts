import type { CodegenConfig } from "@graphql-codegen/cli";
import { storefrontApiCustomScalars } from "@shopify/storefront-kit-react";

const config: CodegenConfig = {
  // Use the schema that's bundled with @shopify/storefront-kit-react
  schema: "./node_modules/@shopify/storefront-kit-react/storefront.schema.json",
  documents: "**/*.graphql",
  generates: {
    "app/gql/types.ts": {
      plugins: ["typescript", "typed-document-node", "typescript-operations"],
      config: {
        scalars: storefrontApiCustomScalars,
      },
    },
  },
};

export default config;
