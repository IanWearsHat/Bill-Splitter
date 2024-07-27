import { Button } from "@mui/material";
import CredentialsForm from "../../components/CredentialsForm/CredentialsForm";
import "./Landing.css";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <>
      <div className="hero">
        <div className="infoColumn">
          <h1>Share Receipts. Anywhere.</h1>
          <p>
            Everyone knows what they owe with a simple link. Get started now.
          </p>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/editor/99d2009e38b24d82a23b102cdb9da160")}
          >
            See a sample receipt
          </Button>
        </div>

        <CredentialsForm isLoginForm={false} />
      </div>
    </>
  );
}
