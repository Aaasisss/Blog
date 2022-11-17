import { useContext } from "react";
import { UserContext } from "../lib/context";
import SignIn from "./SignIn";
import UsernameForm from "../components/UsernameForm";

const AuthCheck = (props) => {
  const { user, username } = useContext(UserContext);
  return user ? username ? props.children : <UsernameForm /> : <SignIn />;
};

export default AuthCheck;
