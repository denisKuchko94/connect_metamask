import { Box, styled } from "@mui/material";

export const Wrapper = styled(Box, { name: "copyContainer" })(() => ({
  cursor: "pointer",
  display: "grid",
  alignItems: "center",
  placeItems: "center",
  borderRadius: 16,
  padding: "8px",

  // colors from sidebar items
  "&:hover": {
    backgound:
      "linear-gradient(42.64deg, rgba(1, 219, 255, 0.12) -6.58%, rgba(162, 249, 139, 0.12) 102.6%)",
  },

  "&:active": {
    background:
      "linear-gradient(52.64deg, rgba(1, 219, 255, 0.27) -6.58%, rgba(162, 249, 139, 0.27) 102.6%)",
  },
}));
