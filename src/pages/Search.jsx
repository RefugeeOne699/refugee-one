// import { useState } from "react";
// import cocktail from "@/clients/cocktail";
import { useModel } from "@/hooks";
import SearchView from "@/views/SearchView";

export default function Search() {
  const model = useModel();
  // console.log(model.searchData?.data);

  // const [searchResult, setSearchResult] = useState([]);

  return <SearchView searchResult={model.searchData?.data} />;
}
