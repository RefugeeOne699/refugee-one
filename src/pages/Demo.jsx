import { useModel } from "@/hooks";
import store from "@/store";
import DemoView from "@/views/DemoView";

import { decrement, increment } from "../store/counter";

export default function Demo() {
  const model = useModel();

  return (
    <DemoView
      count={model.counter.value}
      onCountDec={() => store.dispatch(decrement())}
      onCountInc={() => store.dispatch(increment())}
    />
  );
}
