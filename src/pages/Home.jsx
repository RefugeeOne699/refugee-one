import { useModel } from "@/hooks";
import store, { decrement, increment } from "@/store";

export default function Home() {
  const model = useModel();

  return (
    <div>
      <button onClick={() => store.dispatch(decrement())}>-</button>
      <h1>Counter: {model.value}</h1>
      <button onClick={() => store.dispatch(increment())}>+</button>
    </div>
  );
}
