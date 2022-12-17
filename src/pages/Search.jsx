import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useModel } from "@/hooks";
import store from "@/store";
import { fetchSearchData } from "@/store/searchData";
import SearchView from "@/views/SearchView";

export default function Search() {
  const model = useModel();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    if (query) store.dispatch(fetchSearchData(query));
  }, [location]);

  const invokeSearch = (query) => {
    navigate(`/search?query=${query}`, { replace: true });
  };

  return <SearchView searchData={model.searchData} onUserWantsToSearch={invokeSearch} />;
}
