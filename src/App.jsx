import "./App.css";
import Agua from "./views/agua";
import Luz from "./views/luz";
import Landing from "./views/landing";
import HistorialAgua from "./views/historialAgua";

import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/agua" element={<Agua />} />
        <Route path="/luz" element={<Luz />} />
        <Route path="/historial-agua" element={<HistorialAgua />} />
      </Routes>
    </>
  );
}

export default App;
