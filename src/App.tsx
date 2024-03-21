import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WebAppContext } from "./contexts/WebAppContext";
import { useWebApp } from "./hooks/useWebApp";
import OrganizationsPage from "./pages/OrganizationsPage";
import TasksPage from "./pages/TasksPage";
import CreateTask from "./pages/CreateTask";

function App() {
  const webApp = useWebApp();

  return (
    <WebAppContext.Provider value={{ WebApp: webApp }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OrganizationsPage />} />
          <Route path="/:organizationName/tasks" element={<TasksPage />} />
          <Route
            path="/:organizationName/createTask"
            element={<CreateTask />}
          />
        </Routes>
      </BrowserRouter>
    </WebAppContext.Provider>
  );
}

export default App;
