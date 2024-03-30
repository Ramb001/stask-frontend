import { useNavigate, useSearchParams } from "react-router-dom";
import GoIcon from "../../assets/icons/GoIcon";
import { OrganizationInterface, url } from "../../constants";
import styles from "./OrganizationCard.module.scss";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";

type propsType = {
  type: "profile" | "main";
  organization: OrganizationInterface;
  setData?: Dispatch<SetStateAction<Array<OrganizationInterface>>>;
};

function OrganizationCard({ props }: { props: propsType }) {
  const { type, organization, setData } = props;

  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();

  function handleButtonProfileCLick() {
    axios
      .post(
        `${url}${
          organization.user_status === "Owner"
            ? "/delete-organization"
            : "/leave-organization"
        }`,
        organization.user_status === "Owner"
          ? { organization_id: organization.id }
          : {
              organization_id: organization.id,
              user_id: searchParams.get("user_id"),
            }
      )
      .then(() => {
        axios
          .get(`${url}/get-organizations`, {
            params: { user_id: searchParams.get("user_id") },
          })
          .then((resp) => {
            setData && setData(resp.data);
          });
      });
  }

  return (
    <div
      className={styles.card}
      onClick={() => {
        type === "main" &&
          navigate(
            `/${organization.id}?user_id=${searchParams.get(
              "user_id"
            )}&language_code=${searchParams.get("language_code")}&user_status=${
              organization.user_status
            }`
          );
      }}
    >
      <div className={styles.mainInfo}>
        <div className={styles.title}>{organization.name}</div>
        <div className={styles.subtext}>{organization.user_status}</div>
      </div>
      <div className={styles.icon}>
        {type === "main" ? (
          <GoIcon width="16px" height="16px" />
        ) : (
          type === "profile" && (
            <button
              onClick={handleButtonProfileCLick}
              className={styles.button}
            >
              {organization.user_status === "Owner" ? "Delete" : "Leave"}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default OrganizationCard;
