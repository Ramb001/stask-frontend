import { Option, Select } from "@mui/joy";
import { TaskInterface, statuses, url } from "../../constants";
import styles from "./TaskCard.module.scss";
import { SetStateAction, useState, Dispatch } from "react";
import axios from "axios";

type propsType = {
  task: TaskInterface;
  data: Array<TaskInterface>;
  setData: Dispatch<SetStateAction<Array<TaskInterface> | undefined>>;
};

function TaskCard({ props }: { props: propsType }) {
  const { task, data, setData } = props;

  const [status, setStatus] = useState<string>(task.status);

  function handleChangeStatus(
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) {
    axios
      .post(`${url}/change-task-status`, {
        task_id: task.id,
        status: newValue,
      })
      .then((resp) => {
        if (resp.status === 200) {
          let temp = [...data];
          temp.map((obj) => {
            if (obj.id === task.id) {
              obj.status = newValue ?? obj.status;
            }
          });
          setData(temp);
          setStatus(newValue ?? "");
        }
      });
  }

  const [height, setHeight] = useState<string | number>(2);

  return (
    <div className={styles.taskCard}>
      <div className={styles.mainInfo}>
        <div className={styles.info}>
          <div className={styles.title}>{task.title}</div>
          <div className={styles.text}>Deadline: {task.deadline}</div>
        </div>
        <div
          className={styles.description}
          onClick={() => setHeight(height === 2 ? "unset" : 2)}
          style={{ WebkitLineClamp: height, whiteSpace: "pre-wrap" }}
        >
          {task.description}
        </div>
      </div>
      <div className={styles.subInfo}>
        <div className={styles.workers}>
          {task.workers.map((worker, idx) => {
            return (
              <div className={styles.text} key={idx}>
                {worker.value === "username" && "@"}
                {worker.name}
              </div>
            );
          })}
        </div>
        <Select
          value={status}
          onChange={handleChangeStatus}
          className={styles.select}
        >
          {statuses.map((status, idx) => {
            return (
              <Option value={status.value} key={idx} className={styles.option}>
                {status.name}
              </Option>
            );
          })}
        </Select>
      </div>
    </div>
  );
}

export default TaskCard;
