// TODO: Create an ErrorHandler for all api errors

import { ContentfulStatusCode } from "hono/utils/http-status";
import { AppwriteException } from "node-appwrite";

type IErrorHandler = (error: unknown) => {
  error_msg: string;
  code: ContentfulStatusCode;
};

export const apiErrorHandler: IErrorHandler = (error) => {
  if (error instanceof AppwriteException) {
    return {
      code: error.code as ContentfulStatusCode,
      error_msg: error.message,
    };
  }
  console.error("Unexpected Error:", error);
  return { error_msg: "Something went wrong", code: 500 };
};
