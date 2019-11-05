import Home from "../containers/Index";
import Login from "../containers/Login";
import Signup from "../containers/Signup";

const routes = [
  {
    path: "/",
    exact: true,
    strict: true,
    component: Home,
    id: "Home"
  },
  {
    path: "/login",
    exact: true,
    strict: true,
    component: Login,
    id: "Login"
  },
  {
    path: "/signup",
    exact: true,
    strict: true,
    component: Signup,
    id: "Signup"
  }
];
export default routes;
