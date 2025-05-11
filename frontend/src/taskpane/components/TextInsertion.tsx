import * as React from "react";
import { useState } from "react";
import { Button, Field, Input, tokens, makeStyles } from "@fluentui/react-components";

interface TextInsertionProps {
  label: string;
  buttonComponent: React.ReactElement;
  insertText: (text: string) => void;
}

const useStyles = makeStyles({
  textPromptAndInsertion: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  textAreaField: {
    marginTop: "30px",
    marginBottom: "20px",
    maxWidth: "90%",
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
