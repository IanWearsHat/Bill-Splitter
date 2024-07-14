import bcrypt from "bcryptjs";
import "./Form.css";
import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { Button, TextField } from "@mui/material";

const createAccountURL =
  "https://5xx9atbspi.execute-api.us-east-2.amazonaws.com/default/createAccount";
const loginURL =
  "https://5xx9atbspi.execute-api.us-east-2.amazonaws.com/default/login";
// const createAccountURL = "http://localhost:3000/createNewAccount";
// const loginURL = "http://localhost:3000/login";

const saltRounds = 10;

export default function Form() {
  const isLoginForm = false;

  const { setLoggedIn } = useContext(AuthContext);

  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [buttonIsDisabled, setButtonIsDisabled] = useState<boolean>(false);

  function sendCredentials(body: { [key: string]: string }) {
    fetch(isLoginForm ? loginURL : createAccountURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("token", data.token);
        setLoggedIn(true);
        setButtonIsDisabled(false);
      })
      .catch((error) => {
        console.error(error);
        setButtonIsDisabled(false);
      });
  }

  function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setButtonIsDisabled(true);

    const body: {
      [key: string]: string;
    } = {
      username: user,
      password: password,
    };
    if (isLoginForm) {
      sendCredentials(body);
    } else {
      bcrypt.hash(
        body["password"],
        saltRounds,
        function (err: Error | null, hash: string) {
          if (err) return;

          body["password"] = hash;
          sendCredentials(body);
        }
      );
    }
  }

  return (
    <div id="formDiv">
      <form id="submitForm" onSubmit={handleSubmit}>
        <TextField
          id="username"
          label="Username"
          variant="outlined"
          onChange={(e) => setUser(e.target.value)}
        />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" disabled={buttonIsDisabled} variant="contained">
          {isLoginForm ? "Login" : "Create Account"}
        </Button>
      </form>
    </div>
  );
}
