import { useModel } from "@/hooks";
import store, { decrement, increment } from "@/store";
import HomeView from "@/views/HomeView";

export default function Home() {
  const model = useModel();

  return (
    <HomeView
      count={model.value}
      onCountDec={() => store.dispatch(decrement())}
      onCountInc={() => store.dispatch(increment())}
    />
  );
}
