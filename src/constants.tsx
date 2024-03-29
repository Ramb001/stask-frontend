export const url = "https://stask-bot.ru";

export interface OrganizationInterface {
  name: string;
  user_status: string;
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
