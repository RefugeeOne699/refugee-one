import { useEffect, useState } from "react";

import cocktail from "@/clients/cocktail";
import { useModel } from "@/hooks";
import store from "@/store";
import { getDrinkId } from "@/store/detailData";
import SearchView from "@/views/SearchView";
// import { fetchSearchData } from "@/store/searchData";

export default function Search() {
  const model = useModel();
  const [searchResult, setSearchResult] = useState([]);
  console.log(model.searchData.query);

  /* useEffect(() => {
    store.dispatch(fetchSearchData(model.searchData.query));
  }, []); */

  useEffect(() => {
    cocktail
      .get("search.php", {
        params: {
          s: model.searchData.query,
        },
      })
      .then((res) => {
        setSearchResult(res.data.drinks);
      });
  }, []);

  const saveDrinkId = (id) => {
    store.dispatch(getDrinkId(id));
  };

  // console.log(model.searchData?.data);

  // const [searchResult, setSearchResult] = useState([]);

  // return <SearchView searchResult={model.searchData.data} onsaveDrinkId={saveDrinkId} />;
  return <SearchView searchResult={searchResult} onsaveDrinkId={saveDrinkId} />;
}
