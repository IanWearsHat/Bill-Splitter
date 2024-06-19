import { FormEvent } from "react";

const body = {
  name: "myname",
};

const lambdaURL =
  "https://wyo8uceuk3.execute-api.us-east-2.amazonaws.com/default/insert";

function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  fetch(lambdaURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.text())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
}

export default function Form() {
  return (
    <form onSubmit={handleSubmit}>
      <label>First name:</label>
      <input type="text" id="fname" name="fname" />
      <label>Last name:</label>
      <input type="text" id="lname" name="lname" />
      <button type="submit">Do the thing</button>
    </form>
  );
}
