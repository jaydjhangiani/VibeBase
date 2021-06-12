import Routes from "./utils/Routes";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "./components/Loader";
import Login from "./screens/LoginScreen";
import { auth } from "./utils/firebase";

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <Loader />;

  if (!user) return <Login />;

  return <Routes />;
}

export default App;
