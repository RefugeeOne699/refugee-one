import { useModel } from "@/hooks";
import store from "@/store";
import { removeDrinkFromList } from "@/store/userData";
import DrinkListView from "@/views/DrinkListView";

export default function DrinkList() {
  const model = useModel();

  const userWantsToRemoveDrink = (drinkId) => {
    store.dispatch(removeDrinkFromList(drinkId));
  };

  return (
    <DrinkListView
      userData={model.userData}
      userWantsToRemoveDrink={userWantsToRemoveDrink}
    />
  );
}
