export default function Blank({ children }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="hero-content text-center">{children}</div>
    </div>
  );
}
