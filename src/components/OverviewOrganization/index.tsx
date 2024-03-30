import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "../../constants";
import { useParams, useSearchParams } from "react-router-dom";
import styles from "./OverviewOrganization.module.scss";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import Clipboard from "react-clipboard-animation";
import { CircularProgress } from "@mui/material";

type Orgtype = {
  name: string;
  owner: string;
  workers: Array<{ id: string; name: string; value: "name" | "username" }>;
  ref_link: string;
  tasks: {
    not_started?: number | null;
    in_progress?: number | null;
    done?: number;
  } | null;
};

function OverviewOrganization() {
  const [organization, setOrganization] = useState<Orgtype>();

  const [searchParams, _] = useSearchParams();
  const params = useParams();

  useEffect(() => {
    axios
      .get(`${url}/get-organization-info`, {
        params: { organization_id: params.organization_id },
      })
      .then((resp) => {
        setOrganization(resp.data);
      });
  }, []);

  function handleDeleteWorker(worker_id: string) {
    axios
      .post(`${url}/delete-worker`, {
        organization_id: params.organization_id,
        worker_id: worker_id,
      })
      .then((resp) => {
        if (resp.data === false) {
          alert("You can't delete owner of organization!");
        } else {
          axios
            .get(`${url}/get-organization-info`, {
              params: { organization_id: params.organization_id },
            })
            .then((resp) => {
              setOrganization(resp.data);
            });
        }
      });
  }

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <div className={styles.page}>
      {organization ? (
        <>
          <div className={styles.subDiv}>
            <h3 className={styles.title}>Organization name</h3>
            <p className={styles.text}>{organization?.name}</p>
          </div>
          <div className={styles.subDiv}>
            <h3 className={styles.title}>Organization owner</h3>
            <p className={styles.text}>{organization?.owner}</p>
          </div>
          <div className={styles.subDiv}>
            <h3 className={styles.title}>Workers</h3>
            <div className={styles.listDiv}>
              {organization?.workers.map((worker) => {
                return (
                  <div className={styles.listItem}>
                    <div>
                      {worker.value !== "username" ? "" : "@"}
                      {worker.name}
                    </div>
                    {searchParams.get("user_status") === "Owner" && (
                      <div
                        onClick={() => {
                          handleDeleteWorker(worker.id);
                        }}
                        className={styles.deleteIcon}
                      >
                        <DeleteIcon width="18px" height="18px" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {searchParams.get("user_status") === "Owner" && (
            <div className={styles.subDiv}>
              <h3 className={styles.title}>Referral code</h3>
              <div className={styles.copyDiv}>
                <p>{organization?.ref_link}</p>
                <Clipboard
                  copied={copied}
                  setCopied={setCopied}
                  text={organization?.ref_link}
                  color="white"
                />
              </div>
            </div>
          )}
          <div className={styles.subDiv}>
            <h3 className={styles.title}>Tasks</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.cell}>
                    Not <br />
                    started ❌
                  </th>
                  <th>In progress 💻</th>
                  <th>Done ✅</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.cell}>
                    {organization?.tasks?.not_started ?? 0}
                  </td>
                  <td>{organization?.tasks?.in_progress ?? 0}</td>
                  <td>{organization?.tasks?.done ?? 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <CircularProgress
          style={{ color: "var(--tg-theme-button-color)" }}
          size={64}
        />
      )}
    </div>
  );
}

export default OverviewOrganization;
