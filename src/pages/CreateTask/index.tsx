import { useCallback, useContext, useEffect } from "react";
import { WebAppContext } from "../../contexts/WebAppContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

function CreateTask() {
  const { WebApp } = useContext(WebAppContext);
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();

  const sendDataToTelegram = useCallback(() => {
    {
      WebApp?.sendData(
        JSON.stringify({
          action: "create_task",
          data: {
            organization: params.organizationName,
            title: "Test new task",
            description: "test description",
            creator: searchParams.get("user_id"),
            workers: [
              {
                id: "zktal3nexiy053x",
                name: "Artem Stanko",
                username: "artem.rmb",
                tg_id: "440758448",
                chat_id: "440758448",
              },
              {
                id: "2bur69x384lz39a",
                name: "",
                username: "tonlance_support",
                tg_id: "5907442895",
                chat_id: "5907442895",
              },
            ],
            deadline: "test",
          },
        })
      );
    }
  }, [WebApp]);

  const backToTasks = useCallback(() => {
    WebApp?.MainButton.hide();
    WebApp?.BackButton.hide();
    navigate(
      `/${params.organizationName}/tasks?user_id=${searchParams.get(
        "user_id"
      )}&language_code=${searchParams.get("language_code")}`
    );
  }, [WebApp, navigate]);

  useEffect(() => {
    WebApp?.BackButton.onClick(backToTasks);
    return () => {
      WebApp?.BackButton.onClick(backToTasks);
    };
  }, [WebApp, backToTasks]);

  useEffect(() => {
    WebApp?.BackButton.show();
  }, [WebApp]);

  useEffect(() => {
    WebApp?.MainButton.onClick(sendDataToTelegram);
    return () => {
      WebApp?.MainButton.offClick(sendDataToTelegram);
    };
  }, [WebApp, sendDataToTelegram]);

  useEffect(() => {
    WebApp?.MainButton.show();
    WebApp?.MainButton.setText("Create");
  }, [WebApp]);

  return <>{params.organizationName}</>;
}

export default CreateTask;
