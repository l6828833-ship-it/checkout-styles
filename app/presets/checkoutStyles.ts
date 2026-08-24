export type CheckoutStylePreset = {
  id: string;
  name: string;
  description: string;
  preview: {
    background: string;
    surface: string;
    accent: string;
    text: string;
    button: string;
    buttonText: string;
    cornerRadius: string;
    fontLabel: string;
  };
  branding: Record<string, unknown>;
};

const radius = {
  none: "NONE",
  small: "SMALL",
  base: "BASE",
  large: "LARGE",
} as const;

function branding(opts: {
  background: string;
  surface: string;
  text: string;
  accent: string;
  button: string;
  buttonText: string;
  border?: string;
  cornerRadius: keyof typeof radius;
  headingFont?: string;
  bodyFont?: string;
  buttonBlockPadding?: "NONE" | "EXTRA_TIGHT" | "TIGHT" | "BASE" | "LOOSE" | "EXTRA_LOOSE";
  labelPosition?: "INSIDE" | "OUTSIDE";
  headerAlignment?: "START" | "CENTER" | "END";
}) {
  return {
    designSystem: {
      colors: {
        global: {
          brand: opts.accent,
          accent: opts.accent,
        },
        schemes: {
          scheme1: {
            base: {
              background: opts.background,
              text: opts.text,
              border: opts.border ?? opts.surface,
              accent: opts.accent,
            },
            control: {
              background: opts.surface,
              text: opts.text,
              border: opts.border ?? opts.surface,
              accent: opts.accent,
            },
            primaryButton: {
              background: opts.button,
              text: opts.buttonText,
              accent: opts.accent,
              hover: {
                background: opts.accent,
                text: opts.buttonText,
              },
            },
            secondaryButton: {
              background: opts.background,
              text: opts.accent,
              border: opts.accent,
            },
          },
          scheme2: {
            base: {
              background: opts.surface,
              text: opts.text,
              border: opts.border ?? opts.surface,
              accent: opts.accent,
            },
          },
        },
      },
      cornerRadius: {
        small: 4,
        base: opts.cornerRadius === "none" ? 0 : opts.cornerRadius === "small" ? 4 : opts.cornerRadius === "large" ? 16 : 8,
        large: opts.cornerRadius === "large" ? 24 : 16,
      },
      ...(opts.headingFont || opts.bodyFont
        ? {
            typography: {
              ...(opts.bodyFont
                ? {
                    primary: {
                      shopifyFontGroup: { name: opts.bodyFont },
                    },
                  }
                : {}),
              ...(opts.headingFont
                ? {
                    secondary: {
                      shopifyFontGroup: { name: opts.headingFont },
                    },
                  }
                : {}),
            },
          }
        : {}),
    },
    customizations: {
      global: {
        cornerRadius: radius[opts.cornerRadius],
      },
      header: {
        alignment: opts.headerAlignment ?? "START",
      },
      primaryButton: {
        cornerRadius: radius[opts.cornerRadius],
        blockPadding: opts.buttonBlockPadding ?? "BASE",
      },
      secondaryButton: {
        cornerRadius: radius[opts.cornerRadius],
      },
      control: {
        cornerRadius: radius[opts.cornerRadius],
        labelPosition: opts.labelPosition ?? "INSIDE",
      },
      textField: {
        cornerRadius: radius[opts.cornerRadius],
      },
      select: {
        cornerRadius: radius[opts.cornerRadius],
      },
      checkbox: {
        cornerRadius: radius[opts.cornerRadius] === "NONE" ? "NONE" : "SMALL",
      },
    },
  };
}

export const checkoutStylePresets: CheckoutStylePreset[] = [
  {
    id: "minimal-noir",
    name: "Minimal Noir",
    description: "Sleek black-and-white minimalism with sharp corners for premium brands.",
    preview: {
      background: "#ffffff",
      surface: "#f5f5f5",
      accent: "#111111",
      text: "#111111",
      button: "#111111",
      buttonText: "#ffffff",
      cornerRadius: "0px",
      fontLabel: "Helvetica",
    },
    branding: branding({
      background: "#ffffff",
      surface: "#f5f5f5",
      text: "#111111",
      accent: "#111111",
      button: "#111111",
      buttonText: "#ffffff",
      border: "#e0e0e0",
      cornerRadius: "none",
      bodyFont: "Helvetica",
      headingFont: "Helvetica",
    }),
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    description: "Calm blues and soft rounded corners, great for lifestyle and wellness stores.",
    preview: {
      background: "#f0f7fb",
      surface: "#ffffff",
      accent: "#0e7ea8",
      text: "#123945",
      button: "#0e7ea8",
      buttonText: "#ffffff",
      cornerRadius: "12px",
      fontLabel: "Lato",
    },
    branding: branding({
      background: "#f0f7fb",
      surface: "#ffffff",
      text: "#123945",
      accent: "#0e7ea8",
      button: "#0e7ea8",
      buttonText: "#ffffff",
      border: "#cfe4ee",
      cornerRadius: "large",
      bodyFont: "Lato",
      headingFont: "Lato",
    }),
  },
  {
    id: "sunset-pop",
    name: "Sunset Pop",
    description: "Warm coral and orange energy for bold, playful brands.",
    preview: {
      background: "#fff8f3",
      surface: "#ffffff",
      accent: "#ff5a3c",
      text: "#3a221c",
      button: "#ff5a3c",
      buttonText: "#ffffff",
      cornerRadius: "8px",
      fontLabel: "Montserrat",
    },
    branding: branding({
      background: "#fff8f3",
      surface: "#ffffff",
      text: "#3a221c",
      accent: "#ff5a3c",
      button: "#ff5a3c",
      buttonText: "#ffffff",
      border: "#ffd9cd",
      cornerRadius: "base",
      bodyFont: "Montserrat",
      headingFont: "Montserrat",
    }),
  },
  {
    id: "forest-luxe",
    name: "Forest Luxe",
    description: "Deep greens with gold accents for organic and luxury products.",
    preview: {
      background: "#f6f8f4",
      surface: "#ffffff",
      accent: "#1d4d33",
      text: "#1c2b22",
      button: "#1d4d33",
      buttonText: "#f4e9c8",
      cornerRadius: "4px",
      fontLabel: "Playfair Display",
    },
    branding: branding({
      background: "#f6f8f4",
      surface: "#ffffff",
      text: "#1c2b22",
      accent: "#1d4d33",
      button: "#1d4d33",
      buttonText: "#f4e9c8",
      border: "#d8e2d4",
      cornerRadius: "small",
      headingFont: "Playfair Display",
      bodyFont: "Lato",
    }),
  },
  {
    id: "midnight-mode",
    name: "Midnight Mode",
    description: "Dark checkout with electric blue accents for tech and gaming stores.",
    preview: {
      background: "#0d1117",
      surface: "#161b22",
      accent: "#3b82f6",
      text: "#e6edf3",
      button: "#3b82f6",
      buttonText: "#ffffff",
      cornerRadius: "8px",
      fontLabel: "Inter",
    },
    branding: branding({
      background: "#0d1117",
      surface: "#161b22",
      text: "#e6edf3",
      accent: "#3b82f6",
      button: "#3b82f6",
      buttonText: "#ffffff",
      border: "#30363d",
      cornerRadius: "base",
      bodyFont: "Inter",
      headingFont: "Inter",
    }),
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    description: "Soft pinks and rounded shapes for beauty and fashion brands.",
    preview: {
      background: "#fdf2f6",
      surface: "#ffffff",
      accent: "#d6336c",
      text: "#4a1a2c",
      button: "#d6336c",
      buttonText: "#ffffff",
      cornerRadius: "16px",
      fontLabel: "Poppins",
    },
    branding: branding({
      background: "#fdf2f6",
      surface: "#ffffff",
      text: "#4a1a2c",
      accent: "#d6336c",
      button: "#d6336c",
      buttonText: "#ffffff",
      border: "#f8cddd",
      cornerRadius: "large",
      bodyFont: "Poppins",
      headingFont: "Poppins",
      headerAlignment: "CENTER",
    }),
  },
  {
    id: "espresso",
    name: "Espresso",
    description: "Rich browns and cream tones for coffee, food, and artisan goods.",
    preview: {
      background: "#faf6f0",
      surface: "#ffffff",
      accent: "#6b4226",
      text: "#3b2a1d",
      button: "#6b4226",
      buttonText: "#faf6f0",
      cornerRadius: "8px",
      fontLabel: "Merriweather",
    },
    branding: branding({
      background: "#faf6f0",
      surface: "#ffffff",
      text: "#3b2a1d",
      accent: "#6b4226",
      button: "#6b4226",
      buttonText: "#faf6f0",
      border: "#e8ddce",
      cornerRadius: "base",
      headingFont: "Merriweather",
      bodyFont: "Source Sans Pro",
    }),
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    description: "Elegant purple palette for premium and subscription products.",
    preview: {
      background: "#f8f6fd",
      surface: "#ffffff",
      accent: "#6d28d9",
      text: "#2b1a4d",
      button: "#6d28d9",
      buttonText: "#ffffff",
      cornerRadius: "12px",
      fontLabel: "Raleway",
    },
    branding: branding({
      background: "#f8f6fd",
      surface: "#ffffff",
      text: "#2b1a4d",
      accent: "#6d28d9",
      button: "#6d28d9",
      buttonText: "#ffffff",
      border: "#e2d9f7",
      cornerRadius: "large",
      bodyFont: "Raleway",
      headingFont: "Raleway",
    }),
  },
  {
    id: "citrus-fresh",
    name: "Citrus Fresh",
    description: "Zesty green-yellow tones for juice bars, health, and eco brands.",
    preview: {
      background: "#fbfdf4",
      surface: "#ffffff",
      accent: "#65a30d",
      text: "#2a3614",
      button: "#65a30d",
      buttonText: "#ffffff",
      cornerRadius: "24px",
      fontLabel: "Nunito",
    },
    branding: branding({
      background: "#fbfdf4",
      surface: "#ffffff",
      text: "#2a3614",
      accent: "#65a30d",
      button: "#65a30d",
      buttonText: "#ffffff",
      border: "#e3eecb",
      cornerRadius: "large",
      bodyFont: "Nunito",
      headingFont: "Nunito",
      buttonBlockPadding: "LOOSE",
    }),
  },
  {
    id: "slate-pro",
    name: "Slate Pro",
    description: "Neutral slate grays with a professional feel for B2B and services.",
    preview: {
      background: "#f8fafc",
      surface: "#ffffff",
      accent: "#334155",
      text: "#1e293b",
      button: "#334155",
      buttonText: "#ffffff",
      cornerRadius: "4px",
      fontLabel: "IBM Plex Sans",
    },
    branding: branding({
      background: "#f8fafc",
      surface: "#ffffff",
      text: "#1e293b",
      accent: "#334155",
      button: "#334155",
      buttonText: "#ffffff",
      border: "#e2e8f0",
      cornerRadius: "small",
      bodyFont: "IBM Plex Sans",
      headingFont: "IBM Plex Sans",
      labelPosition: "OUTSIDE",
    }),
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Warm amber and charcoal for jewelry and high-end accessories.",
    preview: {
      background: "#1c1917",
      surface: "#292524",
      accent: "#f59e0b",
      text: "#fafaf9",
      button: "#f59e0b",
      buttonText: "#1c1917",
      cornerRadius: "0px",
      fontLabel: "Cormorant Garamond",
    },
    branding: branding({
      background: "#1c1917",
      surface: "#292524",
      text: "#fafaf9",
      accent: "#f59e0b",
      button: "#f59e0b",
      buttonText: "#1c1917",
      border: "#44403c",
      cornerRadius: "none",
      headingFont: "Cormorant Garamond",
      bodyFont: "Lato",
      headerAlignment: "CENTER",
    }),
  },
  {
    id: "bubblegum",
    name: "Bubblegum",
    description: "Fun, vibrant pink-and-teal combo for youth and novelty brands.",
    preview: {
      background: "#fdf4ff",
      surface: "#ffffff",
      accent: "#0d9488",
      text: "#581c87",
      button: "#ec4899",
      buttonText: "#ffffff",
      cornerRadius: "24px",
      fontLabel: "Quicksand",
    },
    branding: branding({
      background: "#fdf4ff",
      surface: "#ffffff",
      text: "#581c87",
      accent: "#0d9488",
      button: "#ec4899",
      buttonText: "#ffffff",
      border: "#f5d0fe",
      cornerRadius: "large",
      bodyFont: "Quicksand",
      headingFont: "Quicksand",
      buttonBlockPadding: "LOOSE",
    }),
  },
];

export function getPresetById(id: string) {
  return checkoutStylePresets.find((preset) => preset.id === id) ?? null;
}
