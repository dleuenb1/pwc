import * as React from "react";
import { useAuth } from "./context/AuthContext";
import WorkSheetView from "./view/WorksheetView";
import AuthView from "./view/AuthView";
import { useCommonStyles } from "./styles/common.styles";
import Header from "./components/Header";

const App: React.FC = () => {

  const commonStyles = useCommonStyles();
  const { authStatus } = useAuth();
  
  return (
      <div className={commonStyles.columnContainer} style={{width: '100%', minHeight: "100vh"}}>
        <Header title="AIExc"/>
        {authStatus && authStatus.result ? <WorkSheetView /> : <AuthView />}
      </div>
  );
};

export default App;