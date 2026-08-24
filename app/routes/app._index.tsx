import { useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  InlineStack,
  InlineGrid,
  Box,
  Badge,
  Banner,
  Select,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import {
  checkoutStylePresets,
  getPresetById,
  type CheckoutStylePreset,
} from "../presets/checkoutStyles";
import {
  applyCheckoutBranding,
  getCheckoutProfiles,
} from "../models/checkoutBranding.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  let profiles: Awaited<ReturnType<typeof getCheckoutProfiles>> = [];
  let profilesError: string | null = null;
  try {
    profiles = await getCheckoutProfiles(admin);
  } catch (error) {
    profilesError =
      "Could not load checkout profiles. Checkout customization requires a Shopify Plus store.";
  }

  return {
    presets: checkoutStylePresets,
    profiles,
    profilesError,
  };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const presetId = String(formData.get("presetId") ?? "");
  const checkoutProfileId = String(formData.get("checkoutProfileId") ?? "");

  const preset = getPresetById(presetId);
  if (!preset) {
    return { ok: false, message: "Unknown style preset." };
  }
  if (!checkoutProfileId) {
    return { ok: false, message: "Select a checkout profile first." };
  }

  try {
    const { userErrors } = await applyCheckoutBranding(
      admin,
      checkoutProfileId,
      preset.branding,
    );
    if (userErrors.length > 0) {
      return {
        ok: false,
        message: userErrors.map((error) => error.message).join(" "),
      };
    }
    return {
      ok: true,
      message: `Applied "${preset.name}" to your checkout.`,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        "Failed to apply branding. Checkout customization via API requires a Shopify Plus store.",
    };
  }
};

function PresetPreview({ preset }: { preset: CheckoutStylePreset }) {
  const { preview } = preset;
  return (
    <div
      style={{
        background: preview.background,
        borderRadius: 8,
        border: "1px solid var(--p-color-border)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        minHeight: 150,
      }}
    >
      <div
        style={{
          height: 10,
          width: "55%",
          background: preview.text,
          opacity: 0.85,
          borderRadius: preview.cornerRadius,
        }}
      />
      <div
        style={{
          height: 34,
          background: preview.surface,
          border: `1px solid ${preview.accent}33`,
          borderRadius: preview.cornerRadius,
        }}
      />
      <div
        style={{
          height: 34,
          background: preview.surface,
          border: `1px solid ${preview.accent}33`,
          borderRadius: preview.cornerRadius,
        }}
      />
      <div
        style={{
          height: 38,
          background: preview.button,
          borderRadius: preview.cornerRadius,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: preview.buttonText,
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        Pay now
      </div>
    </div>
  );
}

export default function Index() {
  const { presets, profiles, profilesError } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  const publishedProfile = profiles.find((profile) => profile.isPublished);
  const [selectedProfileId, setSelectedProfileId] = useState(
    publishedProfile?.id ?? profiles[0]?.id ?? "",
  );
  const [pendingPresetId, setPendingPresetId] = useState<string | null>(null);

  const isApplying = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setPendingPresetId(null);
      if (fetcher.data.ok) {
        shopify.toast.show(fetcher.data.message);
      }
    }
  }, [fetcher.state, fetcher.data, shopify]);

  const applyPreset = (presetId: string) => {
    setPendingPresetId(presetId);
    fetcher.submit(
      { presetId, checkoutProfileId: selectedProfileId },
      { method: "POST" },
    );
  };

  return (
    <Page>
      <TitleBar title="Checkout style library" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              {profilesError ? (
                <Banner tone="warning" title="Checkout profiles unavailable">
                  <p>{profilesError}</p>
                </Banner>
              ) : null}
              {fetcher.data && !fetcher.data.ok ? (
                <Banner tone="critical" title="Could not apply style">
                  <p>{fetcher.data.message}</p>
                </Banner>
              ) : null}
              <Card>
                <BlockStack gap="300">
                  <Text as="h2" variant="headingMd">
                    Choose a ready-made checkout style
                  </Text>
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Pick a style below and apply it to your checkout in one
                    click. Colors, fonts, corner radius, and button styles are
                    all set for you. You can fine-tune everything on the
                    Customize page.
                  </Text>
                  {profiles.length > 0 ? (
                    <Box maxWidth="400px">
                      <Select
                        label="Checkout profile"
                        options={profiles.map((profile) => ({
                          label: profile.isPublished
                            ? `${profile.name} (published)`
                            : profile.name,
                          value: profile.id,
                        }))}
                        value={selectedProfileId}
                        onChange={setSelectedProfileId}
                      />
                    </Box>
                  ) : null}
                </BlockStack>
              </Card>
              <InlineGrid columns={{ xs: 1, sm: 2, lg: 3 }} gap="400">
                {presets.map((preset) => (
                  <Card key={preset.id}>
                    <BlockStack gap="300">
                      <PresetPreview preset={preset} />
                      <BlockStack gap="100">
                        <InlineStack gap="200" blockAlign="center">
                          <Text as="h3" variant="headingSm">
                            {preset.name}
                          </Text>
                          <Badge>{preset.preview.fontLabel}</Badge>
                        </InlineStack>
                        <Text as="p" variant="bodySm" tone="subdued">
                          {preset.description}
                        </Text>
                      </BlockStack>
                      <Button
                        variant="primary"
                        loading={isApplying && pendingPresetId === preset.id}
                        disabled={
                          (isApplying && pendingPresetId !== preset.id) ||
                          !selectedProfileId
                        }
                        onClick={() => applyPreset(preset.id)}
                      >
                        Apply style
                      </Button>
                    </BlockStack>
                  </Card>
                ))}
              </InlineGrid>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
