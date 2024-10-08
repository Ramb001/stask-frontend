import { useState, useEffect } from "react";
import { OrganizationInterface, url } from "../../constants";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import OrganizationCard from "../../components/OrganizationCard";
import axios from "axios";
import styles from "./OrganizationsPage.module.scss";

function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<
    Array<OrganizationInterface>
  >([]);
  const [searchParams, _] = useSearchParams();
  const user_id = searchParams.get("user_id") || "";
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${url}/get-organizations`, {
        params: { user_id: user_id },
      })
      .then((response) => setOrganizations(response.data));
  }, [user_id]);

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.button}
        onClick={() => {
          navigate(
            `/createOrganization?user_id=${searchParams.get(
              "user_id"
            )}&language_code=${searchParams.get("language_code")}`
          );
        }}
      >
        Create new organization
      </button>
      {organizations.map((organization: OrganizationInterface, idx) => {
        return (
          <OrganizationCard
            props={{ type: "main", organization: organization }}
            key={idx}
          />
        );
      })}
    </div>
  );
}

export default OrganizationsPage;
