export default function DetailView(props) {
  let { detailResult, ingredients } = props;

  //   let ingredients=["1","2","3"];

  return (
    <div className="m-10 card lg:card-side bg-base-100 shadow-xl">
      <figure>
        <img src={detailResult.strDrinkThumb} alt="Picture" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{detailResult.strDrink}</h2>
        <div>
          <span className="font-semibold">Category:</span>
          {detailResult.strCategory}
        </div>
        <div>
          <span className="font-semibold">Glass:</span>
          {detailResult.strGlass}
        </div>
        <div>
          <span className="font-semibold">Alcoholic:</span>
          {detailResult.strAlcoholic}
        </div>
        <div>
          <span className="font-semibold">Instructions:</span>
          {detailResult.strInstructions}
        </div>
        <div>
          <span className="font-semibold">Ingredient:</span> {ingredients.join(",")}
        </div>
        <div>
          <button className="btn btn-primary">Listen</button>
        </div>
      </div>
    </div>
  );
}
