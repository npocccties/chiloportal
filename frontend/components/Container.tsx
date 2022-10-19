import clsx from "clsx";

type Props = {
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
};

function Container({ className, as = "div", children }: Props) {
  const As = as;
  return (
    <As
      className={clsx("max-w-4xl mx-auto my-16 px-4 min-h-[33vh]", className)}
    >
      {children}
    </As>
  );
}

export default Container;
