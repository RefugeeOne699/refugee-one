import { useNavigate } from "react-router-dom";

export default function DrinkListView(props) {
  const { userData, userWantsToRemoveDrink } = props;
  const drinkList = userData?.drinkList ?? [];
  const navigate = useNavigate();

  if (!userData?.user?.uid)
    return (
      <div className="flex justify-center mt-28">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-center mb-6">
            Login first to see your favoriate drink list!
          </h1>
          <button
            className="btn btn-primary text-lg w-fit"
            onClick={() => navigate("/login?from=/my-list")}
          >
            Bring me to Login
          </button>
        </div>
      </div>
    );

  if (drinkList.length === 0)
    return (
      <div className="flex justify-center mt-28">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-center mb-6">
            Your favorite drink list is empty!
          </h1>
          <h1 className="text-2xl text-center mb-6">Go explore some new drinks first</h1>
          <div className="mb-2">
            <button className="btn btn-primary" onClick={() => navigate("/random")}>
              Give me a random
            </button>
          </div>
          <div>
            <button className="btn btn-primary" onClick={() => navigate("/search")}>
              Search by name
            </button>
          </div>
        </div>
      </div>
    );

  const renderDrinkList = (drinkList) =>
    drinkList.map((drink) => (
      <tr key={drink.idDrink}>
        <td>
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="mask mask-squircle w-12 h-12">
                <img src={drink.strDrinkThumb} alt={drink.idDrink} />
              </div>
            </div>
            <div>
              <div className="font-bold">{drink.strDrink}</div>
            </div>
          </div>
        </td>
        <td>{drink.strCategory}</td>
        <td>{drink.strAlcoholic}</td>
        <th>
          <button
            className="btn btn-xs btn-info mr-2"
            onClick={() => navigate(`/detail/${drink.idDrink}`)}
          >
            Detail
          </button>
          <button
            className="btn btn-xs btn-warning"
            onClick={() => userWantsToRemoveDrink(drink.idDrink)}
          >
            Remove
          </button>
        </th>
      </tr>
    ));

  return (
    <div className="mt-10 mx-32">
      <h1 className="text-3xl font-bold text-center mb-6">My Favorite Drinks</h1>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Alcoholic?</th>
              <th>Operation</th>
            </tr>
          </thead>
          <tbody>{renderDrinkList(userData.drinkList)}</tbody>
        </table>
      </div>
    </div>
  );
}
