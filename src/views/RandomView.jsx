import CocktailDetail from "@/components/CocktailDetail";

export default function RandomView(props) {
  const { userData, randomDrink } = props;
  const drinkIdList = userData.drinkIdList ?? [];

  const isDrinkInList = drinkIdList.includes(randomDrink?.data?.idDrink);

  return (
    <div className="flex-1 bg-base-100 grid place-content-center">
      <div className="flex justify-center py-5">
        <button className="btn btn-primary" onClick={props.getNewRandomDrink}>
          Press me for new random drink!
        </button>
      </div>
      <div>
        <CocktailDetail
          drink={props.randomDrink}
          userData={userData}
          onAddDrinkToList={props.addDrinkToList}
          onRemoveDrinkFromList={props.removeDrinkFromList}
          isDrinkInList={isDrinkInList}
        />
      </div>
    </div>
  );
}
