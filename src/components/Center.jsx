export default function Center({ children, className }) {
  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <div className="hero-content text-center">{children}</div>
    </div>
  );
}
