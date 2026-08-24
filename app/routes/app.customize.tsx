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
  InlineGrid,
  Banner,
  Select,
  TextField,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import {
  applyCheckoutBranding,
  getCheckoutProfiles,
} from "../models/checkoutBranding.server";

const CORNER_RADIUS_OPTIONS = [
  { label: "None (sharp corners)", value: "NONE" },
  { label: "Small", value: "SMALL" },
  { label: "Base", value: "BASE" },
  { label: "Large", value: "LARGE" },
];

const FONT_OPTIONS = [
  "Inter",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Nunito",
  "Quicksand",
  "Helvetica",
  "Merriweather",
  "Playfair Display",
  "IBM Plex Sans",
  "Source Sans Pro",
  "Cormorant Garamond",
].map((font) => ({ label: font, value: font }));

const HEX_PATTERN = /^#([0-9a-fA-F]{6})$/;

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

  return { profiles, profilesError };
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const checkoutProfileId = String(formData.get("checkoutProfileId") ?? "");
  const background = String(formData.get("background") ?? "");
  const text = String(formData.get("text") ?? "");
  const accent = String(formData.get("accent") ?? "");
  const buttonBackground = String(formData.get("buttonBackground") ?? "");
  const buttonText = String(formData.get("buttonText") ?? "");
  const cornerRadius = String(formData.get("cornerRadius") ?? "BASE");
  const font = String(formData.get("font") ?? "Inter");

  if (!checkoutProfileId) {
    return { ok: false, message: "Select a checkout profile first." };
  }

  const colors = { background, text, accent, buttonBackground, buttonText };
  for (const [name, value] of Object.entries(colors)) {
    if (!HEX_PATTERN.test(value)) {
      return {
        ok: false,
        message: `"${name}" must be a hex color like #1a2b3c.`,
      };
    }
  }

  const brandingInput = {
    designSystem: {
      colors: {
        global: { brand: accent, accent },
        schemes: {
          scheme1: {
            base: { background, text, accent },
            control: { background: "#ffffff", text, accent },
            primaryButton: {
              background: buttonBackground,
              text: buttonText,
              accent,
            },
            secondaryButton: {
              background,
              text: accent,
              border: accent,
            },
          },
        },
      },
      typography: {
        primary: { shopifyFontGroup: { name: font } },
        secondary: { shopifyFontGroup: { name: font } },
      },
    },
    customizations: {
      global: { cornerRadius },
      primaryButton: { cornerRadius },
      secondaryButton: { cornerRadius },
      control: { cornerRadius },
      textField: { cornerRadius },
      select: { cornerRadius },
    },
  };

  try {
    const { userErrors } = await applyCheckoutBranding(
      admin,
      checkoutProfileId,
      brandingInput,
    );
    if (userErrors.length > 0) {
      return {
        ok: false,
        message: userErrors.map((error) => error.message).join(" "),
      };
    }
    return { ok: true, message: "Custom checkout style applied." };
  } catch (error) {
    return {
      ok: false,
      message:
        "Failed to apply branding. Checkout customization via API requires a Shopify Plus store.",
    };
  }
};

export default function Customize() {
  const { profiles, profilesError } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  const publishedProfile = profiles.find((profile) => profile.isPublished);
  const [checkoutProfileId, setCheckoutProfileId] = useState(
    publishedProfile?.id ?? profiles[0]?.id ?? "",
  );
  const [background, setBackground] = useState("#ffffff");
  const [text, setText] = useState("#1a1a1a");
  const [accent, setAccent] = useState("#3b82f6");
  const [buttonBackground, setButtonBackground] = useState("#3b82f6");
  const [buttonText, setButtonText] = useState("#ffffff");
  const [cornerRadius, setCornerRadius] = useState("BASE");
  const [font, setFont] = useState("Inter");

  const isApplying = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      shopify.toast.show(fetcher.data.message);
    }
  }, [fetcher.state, fetcher.data, shopify]);

  const submit = () => {
    fetcher.submit(
      {
        checkoutProfileId,
        background,
        text,
        accent,
        buttonBackground,
        buttonText,
        cornerRadius,
        font,
      },
      { method: "POST" },
    );
  };

  const previewRadius =
    cornerRadius === "NONE"
      ? "0px"
      : cornerRadius === "SMALL"
        ? "4px"
        : cornerRadius === "LARGE"
          ? "16px"
          : "8px";

  return (
    <Page>
      <TitleBar title="Customize checkout" />
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
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Build your own checkout style
                </Text>
                {profiles.length > 0 ? (
                  <Select
                    label="Checkout profile"
                    options={profiles.map((profile) => ({
                      label: profile.isPublished
                        ? `${profile.name} (published)`
                        : profile.name,
                      value: profile.id,
                    }))}
                    value={checkoutProfileId}
                    onChange={setCheckoutProfileId}
                  />
                ) : null}
                <InlineGrid columns={{ xs: 1, sm: 2 }} gap="400">
                  <TextField
                    label="Page background"
                    value={background}
                    onChange={setBackground}
                    autoComplete="off"
                    placeholder="#ffffff"
                  />
                  <TextField
                    label="Text color"
                    value={text}
                    onChange={setText}
                    autoComplete="off"
                    placeholder="#1a1a1a"
                  />
                  <TextField
                    label="Accent color"
                    value={accent}
                    onChange={setAccent}
                    autoComplete="off"
                    placeholder="#3b82f6"
                  />
                  <TextField
                    label="Button background"
                    value={buttonBackground}
                    onChange={setButtonBackground}
                    autoComplete="off"
                    placeholder="#3b82f6"
                  />
                  <TextField
                    label="Button text"
                    value={buttonText}
                    onChange={setButtonText}
                    autoComplete="off"
                    placeholder="#ffffff"
                  />
                  <Select
                    label="Corner radius"
                    options={CORNER_RADIUS_OPTIONS}
                    value={cornerRadius}
                    onChange={setCornerRadius}
                  />
                  <Select
                    label="Font"
                    options={FONT_OPTIONS}
                    value={font}
                    onChange={setFont}
                  />
                </InlineGrid>
                <Button
                  variant="primary"
                  loading={isApplying}
                  disabled={!checkoutProfileId}
                  onClick={submit}
                >
                  Apply to checkout
                </Button>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Live preview
              </Text>
              <div
                style={{
                  background,
                  borderRadius: 8,
                  border: "1px solid var(--p-color-border)",
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    height: 10,
                    width: "60%",
                    background: text,
                    borderRadius: previewRadius,
                  }}
                />
                <div
                  style={{
                    height: 34,
                    background: "#ffffff",
                    border: `1px solid ${accent}55`,
                    borderRadius: previewRadius,
                  }}
                />
                <div
                  style={{
                    height: 34,
                    background: "#ffffff",
                    border: `1px solid ${accent}55`,
                    borderRadius: previewRadius,
                  }}
                />
                <div
                  style={{
                    height: 38,
                    background: buttonBackground,
                    borderRadius: previewRadius,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: buttonText,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Pay now
                </div>
              </div>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
