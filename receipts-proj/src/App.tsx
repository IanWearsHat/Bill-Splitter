import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AuthContext } from "./AuthContext";

import "./App.css";
import Landing from "./pages/Landing/Landing";
import UserProfile from "./components/UserProfile/UserProfile";
import EditingPage from "./pages/EditingPage/EditingPage";
import Login from "./pages/Login/Login";
import getUserIdentity from "./utils/getUserIdentity";

/**
 * August 3
 * node_modules/vm-browserify/index.js (110:11): Use of eval in "node_modules/vm-browserify/index.js" is strongly discouraged as it poses security risks and may cause issues with minification.
✓ 1413 modules transformed.
dist/index.html                     0.46 kB │ gzip:   0.30 kB
dist/assets/index-2g9mMMOb.css      1.39 kB │ gzip:   0.62 kB
dist/assets/index-BLwDsLrp.js   1,237.65 kB │ gzip: 356.36 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
✓ built in 10.53s
 */


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
