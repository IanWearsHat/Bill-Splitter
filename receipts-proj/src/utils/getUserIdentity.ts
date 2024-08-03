const verifyTokenURL =
  "https://5xx9atbspi.execute-api.us-east-2.amazonaws.com/default/verifyToken";

export default function getUserIdentity(): Promise<string | void> | undefined {
  const token = localStorage.getItem("token");
  if (token) {
    console.log("getting user");

    return fetch(verifyTokenURL, {
      method: "POST",
      body: JSON.stringify({ token: token }),
    })
      .then((data) => data.text())
      .then((text) => {
        console.log(text ? text : "blank");
        return text;
      })
      .catch((err) => console.log(err));
  }
}
