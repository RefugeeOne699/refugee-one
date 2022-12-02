import { useEffect, useState } from "react";

import store from "@/store";

// Custom hook to trigger dataflow update & reredner when Redux store is updated
function useModel() {
  const [model, setModel] = useState(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => setModel(store.getState()));
    return () => unsubscribe();
  });

  return model;
}

export { useModel };
