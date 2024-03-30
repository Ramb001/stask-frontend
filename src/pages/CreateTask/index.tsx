import { useCallback, useContext, useEffect, useState } from "react";
import { WebAppContext } from "../../contexts/WebAppContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styles from "./CreateTask.module.scss";
import {
  WorkersInterface,
  maxNumberOfDescriptionCharaters,
  url,
} from "../../constants";
import axios from "axios";
import InputLayout from "../../layouts/InputLayout";
import { Option, Select, Textarea, Typography } from "@mui/joy";
import InputMask from "react-input-mask";

function CreateTask() {
  const { WebApp } = useContext(WebAppContext);
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workers, setWorkers] = useState<Array<string>>([]);
  const [deadline, setDeadline] = useState("");

  const sendDataToTelegram = useCallback(() => {
    {
      WebApp?.sendData(
        JSON.stringify({
          action: "create_task",
          data: {
            organization_id: params.organization_id,
            title: title,
            description: description,
            creator: searchParams.get("user_id"),
            workers: workers,
            deadline: deadline,
          },
        })
      );
    }
  }, [WebApp, title, description, workers, deadline]);

  const backToTasks = useCallback(() => {
    WebApp?.MainButton.hide();
    WebApp?.BackButton.hide();
    navigate(
      `/${params.organization_id}?user_id=${searchParams.get(
        "user_id"
      )}&language_code=${searchParams.get(
        "language_code"
      )}&user_status=${searchParams.get("user_status")}`
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

  const [allWorkers, setAllWorkers] = useState<Array<WorkersInterface>>([]);

  useEffect(() => {
    axios
      .get(`${url}/get-workers`, {
        params: { organization_id: params.organization_id },
      })
      .then((resp) => {
        setAllWorkers(resp.data);
      });
  }, []);

  function handleChangeWorkers(
    event: React.SyntheticEvent | null,
    newValue: string | null
  ) {
    if (newValue) {
      const temp: string[] = [...newValue];
      setWorkers(temp);
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Create <br /> Task
      </h1>
      <InputLayout
        props={{
          type: "text",
          title: "",
          placeholder: "Task title",
          value: title,
          setValue: setTitle,
        }}
      />
      <Textarea
        placeholder="Description"
        slotProps={{
          textarea: {
            pattern: "[A-Za-z]",
          },
        }}
        className={styles.inputDesc}
        endDecorator={
          <Typography
            fontSize={12}
            sx={{ ml: "auto", color: "var(--tg-theme-text-color)" }}
          >
            {description.length}/{maxNumberOfDescriptionCharaters} character(s)
          </Typography>
        }
        value={description}
        onChange={(e) => {
          e.target.value.length <= maxNumberOfDescriptionCharaters
            ? setDescription(e.target.value)
            : "";
        }}
      />
      <Select
        className={styles.select}
        placeholder="Select workers"
        multiple={true}
        value={workers}
        onChange={handleChangeWorkers}
      >
        {allWorkers.map((worker, idx) => {
          return (
            <Option value={worker} key={idx}>{`${
              worker.name !== "" ? "" : "@"
            }${worker.name !== "" ? worker.name : worker.username}`}</Option>
          );
        })}
      </Select>
      <InputMask
        mask="99/99/9999"
        placeholder="Deadline"
        value={deadline}
        onChange={(e: any) => setDeadline(e.target.value)}
        className={styles.dateInput}
      />
    </div>
  );
}

export default CreateTask;
