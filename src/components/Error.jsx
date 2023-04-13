import { ErrorOutline } from "@mui/icons-material";

import Center from "./Center";

export default function ErrorInfo() {
  return (
    <Center>
      <div className="text-8xl text-error">
        <ErrorOutline fontSize="inherit" />
      </div>
    </Center>
  );
}
