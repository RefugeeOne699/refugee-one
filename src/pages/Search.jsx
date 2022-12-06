import { useEffect, useState } from "react";

import cocktail from "@/clients/cocktail";
import SearchView from "@/views/SearchView";

export default function Search() {
  const [query, setQuery] = useState("margarita");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    cocktail
      .get("search.php", {
        params: {
          s: query,
        },
      })
      .then((res) => {
        setSearchResult(res.data.drinks);
      });
  }, [query]);

  return <SearchView searchResult={searchResult} />;
}
