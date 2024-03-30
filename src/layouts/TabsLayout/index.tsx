import { StyledEngineProvider, Tab, Tabs } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import styles from "./TabsLayout.module.scss";

type propsType = {
  tabs: Array<string>;
  activeTab: string;
  setTab: Dispatch<SetStateAction<string>>;
};

function TabsLayout({ props }: { props: propsType }) {
  return (
    <StyledEngineProvider injectFirst>
      <Tabs
        className={styles.box}
        value={props.activeTab}
        onChange={(_: React.SyntheticEvent, newValue: string) => {
          props.setTab(newValue);
        }}
        centered
      >
        {props.tabs.map((tab, idx) => {
          return (
            <Tab className={styles.tab} key={idx} value={tab} label={tab} />
          );
        })}
      </Tabs>
    </StyledEngineProvider>
  );
}

export default TabsLayout;
