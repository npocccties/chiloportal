import { extendTheme } from "@chakra-ui/react";

const colors = {
  primary: {
    "50": "#EFF6FF",
    "100": "#DBEAFE",
    "200": "#BFDBFE",
    "300": "#93C5FD",
    "400": "#60A5FA",
    "500": "#3B82F6",
    "600": "#2563EB",
    "700": "#1D4ED8",
    "800": "#1E40AF",
    "900": "#1E3a8A",
    "950": "#172554",
  },
  gray: {
    "50": "#f9fafb",
    "100": "#f3f4f6",
    "200": "#e5e7eb",
    "300": "#d1d5db",
    "400": "#9ca3af",
    "500": "#6b7280",
    "600": "#4b5563",
    "700": "#374151",
    "800": "#1f2937",
    "900": "#111827",
    "950": "#030712",
  },
  status: {
    success: "#15803D",
    caution: "#FACC15",
    danger: "#B80000",
  },
  basic: {
    black: "#000000",
    white: "#FFFFFF",
  },
};

export const theme = extendTheme({
  styles: {
    global: {
      body: {
        color: "basic.black",
        bg: "basic.white",
      },
    },
  },
  borders: {
    main: `2px solid ${colors.gray["300"]}`,
  },
  components: {
    Modal: {
      baseStyle: {
        dialogContainer: {
          px: 2,
        },
      },
    },
    Button: {
      defaultProps: {
        colorScheme: "primary",
      },
    },
  },
  colors: colors,
});
