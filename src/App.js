import RouterApp from "./routes";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter className="App">
      <RouterApp />
    </BrowserRouter>
  );
}

export default App;
