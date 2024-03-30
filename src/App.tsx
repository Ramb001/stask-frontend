import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WebAppContext } from "./contexts/WebAppContext";
import { useWebApp } from "./hooks/useWebApp";
import OrganizationsPage from "./pages/OrganizationsPage";
import CreateTask from "./pages/CreateTask";
import CreateOrganization from "./pages/CreateOrganization";
import OrganizationPage from "./pages/OrganizationPage";

function App() {
  const webApp = useWebApp();

  return (
    <WebAppContext.Provider value={{ WebApp: webApp }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OrganizationsPage />} />
          <Route path="/:organization_id" element={<OrganizationPage />} />
          <Route path="/:organization_id/createTask" element={<CreateTask />} />
          <Route path="/createOrganization" element={<CreateOrganization />} />
        </Routes>
      </BrowserRouter>
    </WebAppContext.Provider>
  );
}

export default App;
