import Header from "components/Header";
import Footer from "components/Footer";
import Chat from "components/Chat";

type Props = {
  children?: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div>
      <Header className="sticky z-20 top-0 left-0 w-full" />
      {children}
      <Footer />
      <Chat className="fixed bottom-0 right-[10vw]" />
    </div>
  );
}

export default Layout;
