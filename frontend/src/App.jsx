import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Network from "./pages/Network";
import Notifications from "./pages/Notifications";
import { userDataContext } from "./context/UserContext";
import { useContext, useEffect } from "react";
import Lenis from "lenis";
import "./App.css";

function App() {
  const { userData } = useContext(userDataContext);

  // Initialize Lenis Smooth Scrolling for Netflix-grade fluidity
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={userData ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={userData ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/signup"
        element={userData ? <Navigate to="/" /> : <Signup />}
      />
      <Route
        path="/profile"
        element={userData ? <Profile /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile/:id"
        element={userData ? <Profile /> : <Navigate to="/login" />}
      />
      <Route
        path="/network"
        element={userData ? <Network /> : <Navigate to="/login" />}
      />
      <Route
        path="/notifications"
        element={userData ? <Notifications /> : <Navigate to="/login" />}
      />
      <Route
        path="*"
        element={<Navigate to={userData ? "/" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
