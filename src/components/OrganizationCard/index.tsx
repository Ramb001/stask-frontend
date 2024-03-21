import GoIcon from "../../assets/icons/GoIcon";
import { OrganizationInterface } from "../../constants";
import styles from "./OrganixationCard.module.scss";

function OrganizationCard({ params }: { params: OrganizationInterface }) {
  return (
    <div className={styles.card}>
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
