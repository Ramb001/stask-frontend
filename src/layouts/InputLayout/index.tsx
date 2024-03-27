import { Dispatch, SetStateAction } from "react";
import styles from "./InputLayout.module.scss";

type propsType = {
  type: "text" | "number";
  title: string;
  placeholder: string;
  value: string | number;
  setValue: Dispatch<SetStateAction<string>>;
};

function InputLayout({ props }: { props: propsType }) {
  const { type, title, placeholder, value, setValue } = props;
  return (
    <div className={styles.inputDiv}>
      <p className={styles.title}>{title}</p>
      <input
        className={styles.input}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

export default InputLayout;
