import { makeStyles } from "@fluentui/react-components";

export const useCommonStyles = makeStyles({
    textWrap: {
        textWrap: "wrap"
    },
    columnContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        rowGap: "0.75rem",
    }
});