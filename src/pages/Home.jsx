// import { useModel } from "@/hooks";
import { useEffect, useState } from "react";

import store from "@/store";
import { fetchSearchData } from "@/store/searchData";
import HomeView from "@/views/HomeView";

export default function Home() {
  // const model = useModel();
  const [query, setQuery] = useState();

  function userWantsToSearch(query) {
    console.log(query);
    setQuery(query);
  }

  useEffect(() => {
    console.log(query);
    store.dispatch(fetchSearchData(query));
    // console.log(model.searchData?.data);
  }, [query]);

  return <HomeView onUserWantsToSearch={userWantsToSearch} />;
}
