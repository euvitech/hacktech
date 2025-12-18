export default function Container({ children, className = "" }) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
