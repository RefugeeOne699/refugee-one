import CocktailDetail from "@/components/CocktailDetail";

export default function RandomView(props) {
  const { userData, randomDrink } = props;
  const drinkList = userData.drinkList ?? [];

  const isDrinkInList = drinkList.includes(randomDrink?.data?.idDrink);

  return (
    <div className="flex-1 bg-base-200 grid place-content-center">
      <div className="flex justify-center py-5">
        <button className="btn btn-primary" onClick={props.getNewRandomDrink}>
          Press me for new random drink!
        </button>
      </div>
      <div className="hero">
        <div className="hero-content flex-col lg:flex-row">
          <CocktailDetail
            drink={props.randomDrink}
            onAddDrinkToList={props.addDrinkToList}
            onRemoveDrinkFromList={props.removeDrinkFromList}
            isDrinkInList={isDrinkInList}
          />
        </div>
      </div>
    </div>
  );
}
