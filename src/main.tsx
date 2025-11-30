import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
// ✅ Khai báo theme Mantine
const theme = createTheme({
  primaryColor: "indigo",
  fontFamily: "Inter, sans-serif",
});

// ✅ Render React app
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider theme={theme} defaultColorScheme="light">
        {/* ✅ Bắt buộc để Mantine Notifications hiển thị */}
        <Notifications position="top-right" zIndex={9999} />
        <App />
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>
);
