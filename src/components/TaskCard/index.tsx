import { Option, Select } from "@mui/joy";
import { TaskInterface, statuses, url } from "../../constants";
import styles from "./TaskCard.module.scss";
import { SetStateAction, useState, Dispatch } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import VerifiedIcon from "../../assets/icons/VerifiedIcon";
import RequestedIcon from "../../assets/icons/RequestedIcon";

type propsType = {
  task: TaskInterface;
  setData: Dispatch<SetStateAction<Array<TaskInterface>>>;
};

function TaskCard({ props }: { props: propsType }) {
  const { task, setData } = props;
  const [status, setStatus] = useState<string>(task.status);

  const [searchParams, _] = useSearchParams();
  const params = useParams();

  function handleChangeStatus(
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) {
    axios
      .post(`${url}/change-task-status`, {
        task_id: task.id,
        status: newValue,
        user_status: searchParams.get("user_status"),
      })
      .then(() => {
        axios
          .get(`${url}/get-tasks`, {
            params: { organization_id: params.organization_id },
          })
          .then((resp) => {
            setData(resp.data);
          });
      });
  }

  const [height, setHeight] = useState<string | number>(2);

  return (
    <div className={styles.taskCard}>
      <div className={styles.mainInfo}>
        <div className={styles.info}>
          <div className={styles.title}>{task.title}</div>
          <div className={styles.text}>Till: {task.deadline}</div>
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
        <div className={styles.subDiv}>
          {task.workers.map((worker, idx) => {
            return (
              <div className={styles.text} key={idx}>
                {worker.value === "username" && "@"}
                {worker.name}
              </div>
            );
          })}
        </div>
        <div className={styles.subDiv}>
          <Select
            value={status}
            onChange={handleChangeStatus}
            className={styles.select}
          >
            {statuses.map((status, idx) => {
              return (
                <Option
                  value={status.value}
                  key={idx}
                  className={styles.option}
                >
                  {status.name}
                </Option>
              );
            })}
          </Select>
          {status === "done" &&
            (task.requested ? (
              <div className={styles.taskStatusDiv}>
                <RequestedIcon width="15px" height="15px" />
                <div className={styles.text}>Requested</div>
              </div>
            ) : (
              task.verified && (
                <div className={styles.taskStatusDiv}>
                  <VerifiedIcon width="17px" height="17px" />
                  <div className={styles.text}>Verified</div>
                </div>
              )
            ))}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
