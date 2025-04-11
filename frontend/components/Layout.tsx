import Header from "components/Header";
import Footer from "components/Footer";
import Chat from "components/Chat";

type Props = {
  children?: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header className="shrink-0 sticky z-20 top-0 left-0 w-full" />
      <main className="grow">{children}</main>
      <Footer className="shrink-0" />
      <Chat className="fixed z-20 bottom-0 right-8" />
    </div>
  );
}

export default Layout;
