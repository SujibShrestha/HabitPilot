import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { googleUser } from "../api/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const token = credentialResponse.credential;
      if (!token) return console.error("No token returned from Google!");

      const res = await googleUser(token);

      dispatch(setCredentials({ user: res.user, token: res.token }));
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleError = () => {
    console.error("Google login failed");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary transition-all duration-1000">
      <div className="relative flex flex-col items-center justify-center bg-card text-card-foreground p-10 rounded-3xl shadow-2xl w-96 animate-fadeIn">
        {/* Decorative circles */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-accent opacity-20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary opacity-20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

        <h1 className="text-4xl flex items-center flex-col font-extrabold mb-4 text-center text-primary">
         <img src="/HabitPilot.png" alt="" className="h-20 w-20" /> HabitPilot
        </h1>
        <p className="text-sm mb-8 text-muted-foreground text-center">
          Log in with Google to track your habits and boost your productivity!
        </p>

        <div className="w-full flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
          />
        </div>

      </div>
    </div>
  );
}