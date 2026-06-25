import type { Config } from "tailwindcss";

const config = {
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        border: "var(--color-border)",
        accent: "var(--color-accent)",
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        7: "var(--space-7)",
        8: "var(--space-8)",
        9: "var(--space-9)",
        10: "var(--space-10)",
      },
      fontSize: {
        display: [
          "var(--font-size-display)",
          {
            lineHeight: "var(--line-height-display)",
            letterSpacing: "var(--letter-spacing-display)",
          },
        ],
        h1: [
          "var(--font-size-h1)",
          {
            lineHeight: "var(--line-height-h1)",
            letterSpacing: "var(--letter-spacing-h1)",
          },
        ],
        h2: [
          "var(--font-size-h2)",
          {
            lineHeight: "var(--line-height-h2)",
            letterSpacing: "var(--letter-spacing-h2)",
          },
        ],
        h3: [
          "var(--font-size-h3)",
          {
            lineHeight: "var(--line-height-h3)",
            letterSpacing: "var(--letter-spacing-h3)",
          },
        ],
        body: [
          "var(--font-size-body)",
          {
            lineHeight: "var(--line-height-body)",
            letterSpacing: "var(--letter-spacing-body)",
          },
        ],
        small: [
          "var(--font-size-small)",
          {
            lineHeight: "var(--line-height-small)",
            letterSpacing: "var(--letter-spacing-small)",
          },
        ],
      },
    },
  },
} satisfies Config;

export default config;
