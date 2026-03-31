import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import AIAssistantButton from "./AIAssistantButton";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
      <AIAssistantButton />
    </div>
  );
};

export default MainLayout;
