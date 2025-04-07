import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/Home";
import Body from "./components/Body";
import SignUp from "./components/SignUp";
import AuthForm from "./components/AuthForm";
import LandingPage from "./components/LandingPage";
import Stats from "./components/Stats";
import ProfilePage from "./components/ProfilePage";
import JobMatcher from "./components/JobMatcher";
import TestPage from "./components/TestPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<AuthForm />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="stats" element={<Stats />} />
          <Route path="profile" element={<ProfilePage/>}/>
          <Route
            path="analyse"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="jobMatcher"
            element={
              <ProtectedRoute>
                <JobMatcher />
              </ProtectedRoute>
            }
          />
          <Route
            path="test"
            element={
              <ProtectedRoute>
                <TestPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
