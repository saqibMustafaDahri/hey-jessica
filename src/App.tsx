import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import DeepfakeVideos from "./pages/DeepfakeVideos";
import TutorialVideos from "./pages/TutorialVideos";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import OnboardingQuestions from "./pages/OnboardingQuestions";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/deepfake-videos" element={<DeepfakeVideos />} />
          <Route path="/tutorial-videos" element={<TutorialVideos />} />
          <Route path="/subscription-plans" element={<SubscriptionPlans />} />
          <Route path="/onboarding-questions" element={<OnboardingQuestions />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
