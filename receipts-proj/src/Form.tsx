import bcrypt from "bcryptjs";
import "./Form.css";

const createAccountURL =
  "https://5xx9atbspi.execute-api.us-east-2.amazonaws.com/default/createAccount";
const loginURL =
  "https://5xx9atbspi.execute-api.us-east-2.amazonaws.com/default/login";
// const createAccountURL = "http://localhost:3000/createNewAccount";
// const loginURL = "http://localhost:3000/login";

const saltRounds = 10;

function handleSubmit(event: React.SyntheticEvent) {
  event.preventDefault();

  const form = event.currentTarget as HTMLFormElement | undefined;
  const formData = new FormData(form);
  const body: {
    [key: string]: string;
  } = {};
  formData.forEach((value, key) => (body[key] = value as string));

  bcrypt.hash(
    body["password"],
    saltRounds,
    function (err: Error | null, hash: string) {
      if (err) return;

      body["password"] = hash;
      fetch(createAccountURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
          localStorage.setItem("token", data);
        })
        .catch((error) => console.error(error));
    }
  );
}

function handleLogin(event: React.SyntheticEvent) {
  event.preventDefault();

  const form = event.currentTarget as HTMLFormElement | undefined;
  const formData = new FormData(form);
  const body: {
    [key: string]: string;
  } = {};
  formData.forEach((value, key) => (body[key] = value as string));

  fetch(loginURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
      localStorage.setItem("token", data);
    })
    .catch((error) => console.error(error));
}

export default function Form() {
  return (
    <div id="formDiv">
      <form id="submitForm" onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" id="username" name="username" />
        <label>Password:</label>
        <input type="text" id="password" name="password" />
        <button type="submit">Create Account</button>
      </form>

      <form id="submitForm" onSubmit={handleLogin}>
        <label>Username:</label>
        <input type="text" id="username" name="username" />
        <label>Password:</label>
        <input type="text" id="password" name="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
