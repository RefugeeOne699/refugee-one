export default function HomeView(props) {
  const { count, onCountDec, onCountInc } = props;

  return (
    <div>
      <button onClick={onCountDec} style={{ width: 60 }}>
        -
      </button>
      <h1>Counter: {count}</h1>
      <button onClick={onCountInc} style={{ width: 60 }}>
        +
      </button>
    </div>
  );
}
