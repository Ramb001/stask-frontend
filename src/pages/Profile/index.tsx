import { useState, useEffect } from "react";
import { OrganizationInterface, url } from "../../constants";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import styles from "./Profile.module.scss";
import DoneIcon from "../../assets/icons/DoneIcon";
import EditIcon from "../../assets/icons/EditIcon";
import OrganizationCard from "../../components/OrganizationCard";

function Profile() {
  const [organizations, setOrganizations] = useState<
    Array<OrganizationInterface>
  >([]);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState("");

  const [searchParams, _] = useSearchParams();
  const user_id = searchParams.get("user_id") || "";

  useEffect(() => {
    async function getData() {
      await axios
        .get(`${url}/get-organizations`, {
          params: { user_id: user_id },
        })
        .then((response) => setOrganizations(response.data));
      await axios
        .get(`${url}/get-user-name`, {
          params: { user_id: user_id },
        })
        .then((response) => setName(response.data));
    }
    getData();
  }, [user_id]);

  function handleEditClick() {
    axios
      .post(`${url}/update-user-name`, {
        user_id: searchParams.get("user_id"),
        new_name: name,
      })
      .then(() => {
        setEdit(false);
      });
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Profile</h1>
      <div className={styles.subDiv}>
        <h3 className={styles.subTitle}>Name</h3>
        <div className={styles.editDiv}>
          {edit ? (
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          ) : (
            <div>{name}</div>
          )}
          <div
            className={styles.editButton}
            onClick={() => {
              edit ? handleEditClick() : setEdit(true);
            }}
          >
            {edit ? (
              <DoneIcon width="18px" height="18px" />
            ) : (
              <EditIcon width="18px" height="18px" />
            )}
          </div>
        </div>
      </div>
      <div className={styles.subDiv}>
        <h3 className={styles.subTitle}>Organizations</h3>
        <div className={styles.orgDiv}>
          {organizations.map((organization, idx) => {
            return (
              <OrganizationCard
                props={{
                  type: "profile",
                  organization: organization,
                  setData: setOrganizations,
                }}
                key={idx}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Profile;
