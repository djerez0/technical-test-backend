import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { join } from "path";

export type User = {
  id: number;
  username: string;
  password: string;
};

export type Task = {
  id: number;
  title: string;
  description?: string;
  createdBy: number;
};

export type TokenBlackList = {
  id: number;
  access_token: string;
};

type Data = {
  users: User[];
  tasks: Task[];
  tokenBlackList: TokenBlackList[];
};

const file = join(__dirname, "../../db.json");
const adapter = new JSONFile<Data>(file);
export const db = new Low<Data>(adapter, {
  tasks: [],
  users: [],
  tokenBlackList: [],
});

export async function initDB(): Promise<void> {
  await db.read();
  db.data ||= { users: [], tasks: [], tokenBlackList: [] };
  await db.write();
}
