import CredentialsForm from "../../components/CredentialsForm/CredentialsForm";
import "./Landing.css";

export default function Landing() {
  return (
    <>
      <div className="hero">
        <div className="infoColumn">
          <h1>Share Receipts. Anywhere.</h1>
          <p>
            Everyone knows what they owe with a simple link. Get started now.
          </p>
        </div>

        {/* <div className="formContainer"> */}
        <CredentialsForm isLoginForm={false} />

        {/* </div> */}
      </div>
    </>
  );
}
