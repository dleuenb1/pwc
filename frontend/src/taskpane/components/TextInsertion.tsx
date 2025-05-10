import * as React from "react";
import { useState } from "react";
import { Button, Field, Input, tokens, makeStyles } from "@fluentui/react-components";

interface TextInsertionProps {
  label: string;
  buttonComponent: React.ReactElement;
  insertText: (text: string) => void;
}

const useStyles = makeStyles({
  instructions: {
    fontWeight: tokens.fontWeightSemibold,
    marginTop: "20px",
    marginBottom: "10px",
  },
  textPromptAndInsertion: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textAreaField: {
    marginLeft: "20px",
    marginTop: "30px",
    marginBottom: "20px",
    marginRight: "20px",
    maxWidth: "50%",
  },
});

const TextInsertion: React.FC<TextInsertionProps> = (props: TextInsertionProps) => {
  const [text, setText] = useState<string>(null);

  const handleTextInsertion = async () => {
    await props.insertText(text);
  };

  const handleTextChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const styles = useStyles();

  return (
    <div className={styles.textPromptAndInsertion}>
      <Field className={styles.textAreaField} size="large" label={props.label}>
        <Input size="large" value={text} onChange={handleTextChange} />
      </Field>
      <Button appearance="primary" disabled={!text || text.length === 0} size="large" onClick={handleTextInsertion}>
        {props.buttonComponent}
      </Button>
    </div>
  );
};

export default TextInsertion;
