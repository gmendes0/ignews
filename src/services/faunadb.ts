import { Client } from "faunadb";

export const fauna = new Client({
  secret: process.env.FAUNADB_KEY || "",
  domain: process.env.FAUNADB_DOMAIN || "db.us.fauna.com",
  port: 443,
  scheme: "https",
});
