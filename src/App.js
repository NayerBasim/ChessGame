import { Route, Routes } from "react-router-dom";
import ChessPage from "./components/ChessPage";
import Home from "./components/Home";

function App() {
  return (
    <Routes>
      <Route path="/game/:id" element={<ChessPage />} />
      <Route path="/" element={<Home/>}/>
    </Routes>
  )

}

export default App;
