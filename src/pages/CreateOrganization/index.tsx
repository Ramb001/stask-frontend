import { useCallback, useContext, useEffect, useState } from "react";
import { WebAppContext } from "../../contexts/WebAppContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./CreateOrganization.module.scss";
import InputLayout from "../../layouts/InputLayout";
import Clipboard from "react-clipboard-animation";

function CreateOrganization() {
  const { WebApp } = useContext(WebAppContext);
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [ref_link, setRef_link] = useState(
    Math.random().toString(36).slice(-6) + Math.random().toString(36).slice(-12)
  );

  const sendDataToTelegram = useCallback(() => {
    if (name.length !== 0) {
      WebApp?.sendData(
        JSON.stringify({
          action: "create_organization",
          data: {
            name: name,
            owner: searchParams.get("user_id"),
            ref_link: ref_link,
          },
        })
      );
    }
  }, [WebApp, name, ref_link]);

  const backToMenu = useCallback(() => {
    WebApp?.MainButton.hide();
    WebApp?.BackButton.hide();
    navigate(
      `/?user_id=${searchParams.get(
        "user_id"
      )}&language_code=${searchParams.get("language_code")}`
    );
  }, [WebApp, navigate]);

  useEffect(() => {
    WebApp?.BackButton.onClick(backToMenu);
    return () => {
      WebApp?.BackButton.onClick(backToMenu);
    };
  }, [WebApp, backToMenu]);

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

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) setCopied(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Create <br /> Organization
      </h1>
      <InputLayout
        props={{
          type: "text",
          title: "",
          placeholder: "Organization name",
          value: name,
          setValue: setName,
        }}
      />
      <div className={styles.reflinkDiv}>
        <div className={styles.subTitle}>Organization referal code</div>
        <div className={styles.copyDiv}>
          <p className={styles.reflink}>{ref_link}</p>
          <Clipboard
            copied={copied}
            setCopied={setCopied}
            text={ref_link}
            color="white"
          />
        </div>
      </div>
    </div>
  );
}

export default CreateOrganization;
