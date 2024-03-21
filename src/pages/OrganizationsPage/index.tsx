import { useState, useEffect } from "react";
import { OrganizationInterface, url } from "../../constants";
import { useSearchParams } from "react-router-dom";
import OrganizationCard from "../../components/OrganizationCard";
import axios from "axios";
import styles from "./OrganizationsPage.module.scss";

function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Array<OrganizationInterface>>([]);
  const [searchParams, _] = useSearchParams();
  const user_id = searchParams.get("user_id") || "";

  useEffect(() => {
    axios
      .get(`${url}/get_organizations`, {
        params: { user_id: user_id },
      })
      .then((response) => setOrgs(response.data));
  }, [user_id]);

  return (
    <div className={styles.cards}>
      {orgs.map((org: OrganizationInterface, idx) => {
        return <OrganizationCard params={org} key={idx} />;
      })}
    </div>
  );
}

export default OrganizationsPage;
