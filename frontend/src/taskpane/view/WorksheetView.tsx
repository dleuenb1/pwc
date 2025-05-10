import * as React from "react";
import { makeStyles } from "@fluentui/react-components";
import HeaderSelector from "../components/HeaderSelector";
import { WorkbookProvider } from "../context/WorkbookContext";
import WorksheetStatus from "../components/WorksheetStatus";
import SubmitButton from "../components/SubmitButton";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "16px"
  },
});

const WorkSheetView: React.FC = () => {
  const styles = useStyles();
  return (
    <WorkbookProvider>
      <div className={styles.root}>
        <HeaderSelector/>
        <WorksheetStatus/>
        <SubmitButton />
      </div>
    </WorkbookProvider>
  );
};

export default WorkSheetView;
