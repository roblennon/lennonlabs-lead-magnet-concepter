import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminR from "./pages/AdminR";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin-r" element={<AdminR />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;