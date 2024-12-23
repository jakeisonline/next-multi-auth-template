import { v4 as uuidv4 } from "uuid"

export interface ServerActionResponse {
  status: "success" | "error"
  data?: object
  messages?: [
    {
      code?: string
      title: string
      body: string
    },
  ]
}

export type UUID = ReturnType<typeof uuidv4>
