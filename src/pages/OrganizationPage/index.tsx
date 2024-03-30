import { useCallback, useContext, useEffect, useState } from "react";
import { WebAppContext } from "../../contexts/WebAppContext";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import TabsLayout from "../../layouts/TabsLayout";
import OrganizationTasks from "../../components/OrganizationTasks";
import OrganizationRequests from "../../components/OrganizationRequests";

function OrganizationPage() {
  const { WebApp } = useContext(WebAppContext);
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();

  const backToMenu = useCallback(() => {
    WebApp?.BackButton.hide();
    navigate(
      `/?user_id=${searchParams.get(
        "user_id"
      )}&language_code=${searchParams.get("language_code")}`
    );
  }, [WebApp, navigate]);

  useEffect(() => {
    WebApp?.BackButton.onClick(backToMenu);
    return () => {
      WebApp?.BackButton.onClick(backToMenu);
    };
  }, [WebApp, backToMenu]);

  useEffect(() => {
    WebApp?.BackButton.show();
  }, [WebApp]);

  const [activeTab, setActiveTab] = useState("Tasks");

  return (
    <div>
      <TabsLayout
        props={{
          tabs:
            searchParams.get("user_status") === "Owner"
              ? ["Overview", "Tasks", "Requests"]
              : ["Overview", "Tasks"],
          activeTab: activeTab,
          setTab: setActiveTab,
        }}
      />
      {activeTab === "Overview" && ""}
      {activeTab === "Tasks" && <OrganizationTasks />}
      {activeTab === "Requests" &&
        searchParams.get("user_status") === "Owner" && <OrganizationRequests />}
    </div>
  );
}

export default OrganizationPage;
