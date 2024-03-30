import { Dispatch, SetStateAction, useState } from "react";
import { RequestInterface, url } from "../../constants";
import styles from "./RequestCard.module.scss";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";

type propsType = {
  request: RequestInterface;
  setData: Dispatch<SetStateAction<Array<RequestInterface>>>;
};

function RequestCard({ props }: { props: propsType }) {
  const { request, setData } = props;

  const [height, setHeight] = useState<string | number>(2);

  const [searchParams, _] = useSearchParams();
  const params = useParams();

  function handleButtonClick(event: "accept" | "decline") {
    axios
      .post(`${url}/change-task-status`, {
        task_id: request.id,
        status: event === "accept" ? "done" : "in_progress",
        user_status: searchParams.get("user_status"),
      })
      .then(() => {
        axios
          .get(`${url}/get-requests`, {
            params: { organization_id: params.organization_id },
          })
          .then((resp) => {
            setData(resp.data);
          });
      });
  }

  return (
    <div className={styles.requestCard}>
      <div className={styles.mainInfo}>
        <div className={styles.info}>
          <div className={styles.title}>{request.title}</div>
          <div className={styles.text}>Till: {request.deadline}</div>
        </div>
        <div
          className={styles.desc}
          onClick={() => setHeight(height === 2 ? "unset" : 2)}
          style={{ WebkitLineClamp: height, whiteSpace: "pre-wrap" }}
        >
          {request.description}
        </div>
      </div>
      <div className={styles.subInfo}>
        <div className={styles.workers}>
          {request.workers.map((worker, idx) => {
            return (
              <div className={styles.text} key={idx}>
                {worker.value === "username" && "@"}
                {worker.name}
              </div>
            );
          })}
        </div>
        <div className={styles.buttonsDiv}>
          <button
            className={styles.button}
            type="button"
            onClick={() => {
              handleButtonClick("decline");
            }}
          >
            Decline
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => {
              handleButtonClick("accept");
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestCard;
