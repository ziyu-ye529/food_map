import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppShell from "@/components/AppShell";
import About from "@/pages/About";
import Home from "@/pages/Home";
import Playground from "@/pages/Playground";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
}
