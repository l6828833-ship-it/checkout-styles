import type { AdminApiContext } from "@shopify/shopify-app-remix/server";

const CHECKOUT_PROFILES_QUERY = `#graphql
  query checkoutProfiles {
    checkoutProfiles(first: 10) {
      edges {
        node {
          id
          name
          isPublished
        }
      }
    }
  }
`;

const CHECKOUT_BRANDING_UPSERT_MUTATION = `#graphql
  mutation checkoutBrandingUpsert(
    $checkoutProfileId: ID!
    $checkoutBrandingInput: CheckoutBrandingInput!
  ) {
    checkoutBrandingUpsert(
      checkoutProfileId: $checkoutProfileId
      checkoutBrandingInput: $checkoutBrandingInput
    ) {
      checkoutBranding {
        designSystem {
          colors {
            global {
              brand
              accent
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export type CheckoutProfile = {
  id: string;
  name: string;
  isPublished: boolean;
};

export async function getCheckoutProfiles(
  admin: AdminApiContext,
): Promise<CheckoutProfile[]> {
  const response = await admin.graphql(CHECKOUT_PROFILES_QUERY);
  const json = await response.json();
  const edges = json.data?.checkoutProfiles?.edges ?? [];
  return edges.map((edge: { node: CheckoutProfileNode }) => edge.node);
}

type CheckoutProfileNode = CheckoutProfile;

export async function applyCheckoutBranding(
  admin: AdminApiContext,
  checkoutProfileId: string,
  brandingInput: Record<string, unknown>,
): Promise<{ userErrors: { field: string[] | null; message: string }[] }> {
  const response = await admin.graphql(CHECKOUT_BRANDING_UPSERT_MUTATION, {
    variables: {
      checkoutProfileId,
      checkoutBrandingInput: brandingInput,
    },
  });
  const json = await response.json();
  return {
    userErrors: json.data?.checkoutBrandingUpsert?.userErrors ?? [],
  };
}
