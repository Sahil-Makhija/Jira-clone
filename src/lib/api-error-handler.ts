// TODO: Create an ErrorHandler for all api errors

import { ContentfulStatusCode } from "hono/utils/http-status";
import { AppwriteException } from "node-appwrite";

type IErrorHandler = (error: unknown) => {
  error: string;
  code: ContentfulStatusCode;
};

export const apiErrorHandler: IErrorHandler = (error) => {
  if (error instanceof AppwriteException) {
    switch (error.code) {
      case 400:
        return {
          code: 400,
          error: "Bad request.",
        };
      case 401:
        return {
          code: 401,
          error: "Authentication failed. Please check your credentials.",
        };
      case 404:
        return {
          code: 404,
          error: "Resource not found.",
        };
      case 409:
        return {
          code: 409,
          error: "Resource already exists.",
        };
      case 429:
        return {
          code: 429,
          error: "Too many requests. Please try again later.",
        };
      default:
        // For any other Appwrite error codes
        return {
          code: error.code as ContentfulStatusCode,
          error: error.message,
        };
    }
  }
  console.error("Unexpected Error:", error);
  return { error: "Something went wrong", code: 500 };
};
