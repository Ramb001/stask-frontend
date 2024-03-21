import { useCallback, useContext, useEffect, useState } from "react";
import { WebAppContext } from "../../contexts/WebAppContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { url } from "../../constants";
import TaskCard from "../../components/TaskCard";
import styles from "./TasksPage.module.scss";

interface TasksInterface {
  notStarted: Array<string>;
  inProgress: Array<string>;
  done: Array<string>;
}

function TasksPage() {
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

  const [tasks, setTasks] = useState<TasksInterface>();

  useEffect(() => {
    axios
      .get(`${url}/get-tasks`, {
        params: { organization_name: params.organizationName },
      })
      .then((resp) => {
        setTasks(resp.data);
      });
  }, []);

  return (
    <div className={styles.page}>
      {searchParams.get("user_status") === "Owner" && (
        <button
          type="button"
          className={styles.button}
          onClick={() => {
            navigate(
              `/${
                params.organizationName
              }/createTask?user_id=${searchParams.get(
                "user_id"
              )}&language_code=${searchParams.get("language_code")}`
            );
          }}
        >
          Create new task
        </button>
      )}
      <div className={styles.box}>
        <div className={styles.title}>NOT STARTED ❌</div>
        {tasks?.notStarted.map((task, idx) => {
          return <TaskCard key={idx} />;
        })}
      </div>
      <div className={styles.box}>
        <div className={styles.title}>IN PROGRESS 💻</div>
        {tasks?.inProgress.map((task, idx) => {
          return <TaskCard key={idx} />;
        })}
      </div>
      <div className={styles.box}>
        <div className={styles.title}>DONE ✅</div>
        {tasks?.done.map((task, idx) => {
          return <TaskCard key={idx} />;
        })}
      </div>
    </div>
  );
}

export default TasksPage;
