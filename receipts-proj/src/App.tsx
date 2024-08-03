import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import { AuthContext } from "./AuthContext";

import "./App.css";
import Landing from "./pages/Landing/Landing";
import UserProfile from "./components/UserProfile/UserProfile";
import EditingPage from "./pages/EditingPage/EditingPage";
import CredentialsForm from "./components/CredentialsForm/CredentialsForm";
import Login from "./pages/Login/Login";
import getUserIdentity from "./utils/getUserIdentity";

function App() {
  const [user, setLoginUser] = useState("");

  useEffect(() => {
    async function loadUser() {
      const res = await getUserIdentity();
      if (res) setLoginUser(res);
    }
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setLoginUser }}>
      <Router>
        <UserProfile />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/editor/*" element={<EditingPage />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
