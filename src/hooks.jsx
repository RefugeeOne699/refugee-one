import { useEffect, useState } from "react";

import store from "@/store";

// Custom hook to trigger dataflow update & reredner when Redux store is updated
function useModel() {
  const [model, setModel] = useState(store.getState());

  useEffect(() => {
    store.subscribe(() => setModel(store.getState()));
  });

  return model;
}

export { useModel };
