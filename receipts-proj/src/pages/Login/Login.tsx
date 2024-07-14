import CredentialsForm from "../../components/CredentialsForm/CredentialsForm";
import "./Login.css";

export default function Login() {
  return (
    <div id="loginPage">
      <CredentialsForm isLoginForm />
    </div>
  );
}
