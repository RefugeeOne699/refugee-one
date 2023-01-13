import CocktailDetail from "@/components/CocktailDetail";

export default function DetailView(props) {
  const { drinkDetail, userData, onAddDrinkToList, onRemoveDrinkFromList } = props;
  const drinkList = userData.drinkIdList ?? [];
  const isDrinkInList = drinkList.includes(drinkDetail?.data?.idDrink);

  return (
    <CocktailDetail
      drink={drinkDetail}
      userData={userData}
      onAddDrinkToList={onAddDrinkToList}
      onRemoveDrinkFromList={onRemoveDrinkFromList}
      isDrinkInList={isDrinkInList}
    />
  );
}
