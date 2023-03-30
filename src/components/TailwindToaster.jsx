import { Toaster } from "react-hot-toast";
export default function TailWindToaster() {
  return (
    <Toaster
      toastOptions={{
        style: {
          padding: "1rem",
          boxShadow: "none",
          lineHeight: "normal",
          maxWidth: "400px",
        },
        iconTheme: {
          secondary: "#fff",
        },
        success: {
          style: {
            backgroundColor: "#bbf7d0",
            color: "#15803d",
          },
        },
        error: {
          style: {
            backgroundColor: "#fecaca",
            color: "#b91c1c",
          },
        },
      }}
    />
  );
}
