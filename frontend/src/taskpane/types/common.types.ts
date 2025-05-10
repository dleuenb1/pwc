export type Status = {
  type: "info" | "error";
  message: string;
};

export type ValidationResult<T> = {
  status: Status;
  result?: T;
};