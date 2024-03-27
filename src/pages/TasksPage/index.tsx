import { useCallback, useContext, useEffect, useState } from "react";
import { WebAppContext } from "../../contexts/WebAppContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { url, TaskInterface } from "../../constants";
import TaskCard from "../../components/TaskCard";
import styles from "./TasksPage.module.scss";

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

  const [tasks, setTasks] = useState<Array<TaskInterface>>();

  useEffect(() => {
    axios
      .get(`${url}/get-tasks`, {
        params: { organization: params.organizationName },
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
        {tasks?.map((task, idx) => {
          return (
            task.status === "not_started" && (
              <TaskCard
                props={{ task: task, data: tasks, setData: setTasks }}
                key={idx}
              />
            )
          );
        })}
      </div>
      <div className={styles.box}>
        <div className={styles.title}>IN PROGRESS 💻</div>
        {tasks?.map((task, idx) => {
          return (
            task.status === "in_progress" && (
              <TaskCard
                props={{ task: task, data: tasks, setData: setTasks }}
                key={idx}
              />
            )
          );
        })}
      </div>
      <div className={styles.box}>
        <div className={styles.title}>DONE ✅</div>
        {tasks?.map((task, idx) => {
          return (
            task.status === "done" && (
              <TaskCard
                props={{ task: task, data: tasks, setData: setTasks }}
                key={idx}
              />
            )
          );
        })}
      </div>
    </div>
  );
}

export default TasksPage;
