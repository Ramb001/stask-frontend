import { useEffect, useState } from "react";
import { RequestInterface, url } from "../../constants";
import axios from "axios";
import { useParams } from "react-router-dom";
import RequestCard from "../RequestCard";
import styles from "./OrganizationRequests.module.scss";

function OrganizationRequests() {
  const [requests, setRequests] = useState<Array<RequestInterface>>([]);

  const params = useParams();
  useEffect(() => {
    axios
      .get(`${url}/get-requests`, {
        params: { organization_id: params.organization_id },
      })
      .then((resp) => {
        setRequests(resp.data);
      });
  }, []);

  return requests.length !== 0 ? (
    <div className={styles.cards}>
      {requests.map((request) => {
        return (
          <RequestCard props={{ request: request, setData: setRequests }} />
        );
      })}
    </div>
  ) : (
    <h1 className={styles.errorTitle}>No requests</h1>
  );
}
export default OrganizationRequests;
