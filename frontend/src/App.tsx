import { Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Parent Route */}
      <Route path="/" element={<MainLayout/>}>
        {/* Child Routes render inside <Outlet /> */}

        <Route index element={<Home />} />
      </Route>
      <Route path="/auth" element={<Auth />} />
      {/* Outside layout */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;
