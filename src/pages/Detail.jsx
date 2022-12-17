import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useModel } from "@/hooks";
import store from "@/store";
import { fetchDrinkDetail } from "@/store/detailData";
import DetailView from "@/views/DetailView";

export default function Detail() {
  const params = useParams();
  const model = useModel();

  useEffect(() => {
    if (params.cocktailId) {
      store.dispatch(fetchDrinkDetail(params.cocktailId));
    }
  }, [params.cocktailId]);

  return <DetailView drinkDetail={model.detailData} />;
}
