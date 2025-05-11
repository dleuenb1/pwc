import * as React from "react";
import { useState } from "react";
import { useCommonStyles } from "../styles/common.styles";
import TextInsertion from "../components/TextInsertion";
import { useAuth } from "../context/AuthContext";
import { Text, Spinner } from "@fluentui/react-components";

const AuthView: React.FC = () => {
    const [ loading, setLoading ] = useState<boolean>(false);
    const commonStyles = useCommonStyles();
    const { authStatus, setLicenseKey } = useAuth();

    const sendLicenseKey = (key: string) => {
        setLoading(true);
        setLicenseKey(key).finally(() => setLoading(false));
    };

    return (
        <div className={commonStyles.columnContainer} style={{width: '100%'}}>
            <TextInsertion
                label="Wypełnij klucz licencyjny"
                buttonComponent={loading ? <Spinner size="tiny" label="Wysyłanie..." /> : <>Sprawdź klucz</>}
                insertText={sendLicenseKey}
            />
            {authStatus && !authStatus.result ? <Text size={200}
                style={{ marginBottom: 4, color: "red" }}
                className={commonStyles.textWrap}>
                    {authStatus.status.message}
                </Text> : <></>}
        </div>
    );
}

export default AuthView;