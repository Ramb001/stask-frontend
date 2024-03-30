import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { url, TaskInterface } from "../../constants";
import TaskCard from "../TaskCard";
import styles from "./OrganizationTasks.module.scss";

function OrganizationTasks() {
  const [tasks, setTasks] = useState<Array<TaskInterface>>();

  const [searchParams, _] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${url}/get-tasks`, {
        params: { organization: params.organization_id },
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
              `/${params.organization_id}/createTask?user_id=${searchParams.get(
                "user_id"
              )}&language_code=${searchParams.get(
                "language_code"
              )}&user_status=${searchParams.get("user_status")}`
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

export default OrganizationTasks;
