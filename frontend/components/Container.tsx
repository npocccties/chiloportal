import clsx from "clsx";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
};

function Container({ className, style, as = "div", children }: Props) {
  const As = as;
  return (
    <As className={clsx("container p-6 pb-10", className)} style={style}>
      {children}
    </As>
  );
}

export default Container;
