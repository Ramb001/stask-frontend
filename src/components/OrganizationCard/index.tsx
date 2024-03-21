import { useNavigate, useSearchParams } from "react-router-dom";
import GoIcon from "../../assets/icons/GoIcon";
import { OrganizationInterface } from "../../constants";
import styles from "./OrganixationCard.module.scss";

function OrganizationCard({ params }: { params: OrganizationInterface }) {
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      onClick={() =>
        navigate(
          `/${params.name}/tasks?user_id=${searchParams.get(
            "user_id"
          )}&language_code=${searchParams.get("language_code")}&user_status=${
            params.user_status
          }`
        )
      }
    >
      <div className={styles.mainInfo}>
        <div className={styles.title}>{params.name}</div>
        <div className={styles.subtext}>{params.user_status}</div>
      </div>
      <div className={styles.icon}>
        <GoIcon width="16px" height="16px" />
      </div>
    </div>
  );
}

export default OrganizationCard;
