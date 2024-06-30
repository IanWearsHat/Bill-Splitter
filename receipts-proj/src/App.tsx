import { useState } from "react";
import "./App.css";
import { AuthContext } from "./AuthContext";
import Form from "./Form";
import ReceiptEditor from "./components/ReceiptEditor/ReceiptEditor";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      <Form />
      <ReceiptEditor />
    </AuthContext.Provider>
  );
}

export default App;
