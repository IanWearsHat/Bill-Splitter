import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import { AuthContext } from "./AuthContext";

import "./App.css";
import Landing from "./pages/Landing/Landing";
import UserProfile from "./components/UserProfile/UserProfile";
import EditingPage from "./pages/EditingPage/EditingPage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      <Router>
        <UserProfile />
        <Link to="/">Home</Link>
        <hr />
        <Link to="/editor">Editor</Link>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/editor" element={<EditingPage />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
