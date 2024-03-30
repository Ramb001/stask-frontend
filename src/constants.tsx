export const url = "https://stask-bot.ru";

export const maxNumberOfDescriptionCharaters = 2500;

export interface OrganizationInterface {
  id: string;
  name: string;
  user_status: string;
}

export interface WorkersInterface {
  id: string;
  name: string;
  username: string;
  tg_id: string;
  chat_id: string;
}

export interface TaskInterface {
  id: string;
  title: string;
  description: string;
  status: string;
  workers: Array<{ name: string; value: "name" | "username" }>;
  deadline: string;
  requested: boolean;
  verified: boolean;
}

interface statusesInterface {
  name: "Not Started" | "In progress" | "Done";
  value: "not_started" | "in_progress" | "done";
}

export const statuses: Array<statusesInterface> = [
  { name: "Not Started", value: "not_started" },
  { name: "In progress", value: "in_progress" },
  { name: "Done", value: "done" },
];

export interface RequestInterface {
  id: string;
  title: string;
  description: string;
  status: string;
  workers: Array<{ name: string; value: "name" | "username" }>;
  deadline: string;
}
