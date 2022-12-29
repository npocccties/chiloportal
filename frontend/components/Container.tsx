import clsx from "clsx";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
};

function Container({ className, style, as = "main", children }: Props) {
  const As = as;
  return (
    <As
      className={clsx(
        "max-w-4xl mx-auto my-8 px-4 xl:px-0 min-h-[33vh]",
        className
      )}
      style={style}
    >
      {children}
    </As>
  );
}

export default Container;
