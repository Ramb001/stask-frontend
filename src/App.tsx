import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChosenPage from "./pages/ChosenPage";
import TasksPage from "./pages/TasksPage";
import { WebAppContext } from "./contexts/WebAppContext";
import { useWebApp } from "./hooks/useWebApp";

function App() {
  const webApp = useWebApp();

  return (
    <WebAppContext.Provider value={{ WebApp: webApp }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ChosenPage />} />
          <Route path="/:organizationName/tasks" element={<TasksPage />} />
        </Routes>
      </BrowserRouter>
    </WebAppContext.Provider>
  );
}

export default App;
