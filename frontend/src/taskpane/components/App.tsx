import * as React from "react";
import Header from "./Header";
import { makeStyles } from "@fluentui/react-components";
import HeaderSelector from "./HeaderSelector";
import { WorkbookProvider } from "../context/WorkbookContext";
import WorksheetStatus from "./WorksheetStatus";
import SubmitButton from "./SubmitButton";

interface AppProps {
  title: string;
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "16px"
  },
});

const App: React.FC<AppProps> = () => {
  const styles = useStyles();
  return (
    <WorkbookProvider>
      <div className={styles.root}>
        <Header title="AIExc"/>
        <HeaderSelector/>
        <WorksheetStatus/>
        <SubmitButton />
      </div>
    </WorkbookProvider>
  );
};

export default App;
