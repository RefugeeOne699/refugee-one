import { useModel } from "@/hooks";
import store, { decrement, increment } from "@/store";
import DemoView from "@/views/DemoView";

export default function Demo() {
  const model = useModel();

  return (
    <DemoView
      count={model.value}
      onCountDec={() => store.dispatch(decrement())}
      onCountInc={() => store.dispatch(increment())}
    />
  );
}
