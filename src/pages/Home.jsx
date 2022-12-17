// import { useModel } from "@/hooks";
// import { useEffect, useState } from "react";
import store from "@/store";
import { fetchSearchData, getSearchQuery } from "@/store/searchData";
import HomeView from "@/views/HomeView";

export default function Home() {
  // const model = useModel();
  // const [query, setQuery] = useState("margarita");

  function getQuery(query) {
    // console.log(query);
    store.dispatch(getSearchQuery(query));
    // setQuery(query);
  }

  /*   useEffect(() => {
    console.log(query);
    store.dispatch(fetchSearchData(query));
    console.log(model.searchData?.data);
  }, [query]); */

  return <HomeView onGetQuery={getQuery} />;
}
