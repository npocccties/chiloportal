import Header from "components/Header";

type Props = {
  children?: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div>
      <Header className="sticky top-0 left-0 w-full" />
      {children}
    </div>
  );
}

export default Layout;
