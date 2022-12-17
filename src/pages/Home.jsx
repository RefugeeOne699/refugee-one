import { useNavigate } from "react-router-dom";

import HomeView from "@/views/HomeView";

export default function Home() {
  const navigate = useNavigate();

  function goSearch(query) {
    if (query) navigate(`/search?query=${query}`);
  }

  return <HomeView onUserWantsToSearch={goSearch} />;
}
