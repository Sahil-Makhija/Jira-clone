import { hc as honoClient } from "hono/client";

import { APP_URL } from "@/config";
import { AppType } from "@/app/api/[[...route]]/route";

export const client = honoClient<AppType>(APP_URL);
