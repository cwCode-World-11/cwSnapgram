import { Routes, Route } from "react-router";
import AAA from "./AAA";

function App() {
  return (
    <main>
      <Routes>
        {/* <Route element={Auth} */}
        <Route path="/aaa" element={<AAA />} />
      </Routes>
    </main>
  );
}

export default App;
