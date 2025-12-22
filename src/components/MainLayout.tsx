import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../contexts/AuthContext";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, login, logout, editProfile } = useAuth();

  return (
    <div>
      <Header 
        onLoginClick={login} 
        user={user} 
        onLogout={logout} 
        onEditProfile={editProfile}
      />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
