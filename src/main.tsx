import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { PGliteWorker } from "@electric-sql/pglite/worker";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { live } from "@electric-sql/pglite/live";

import App from "./App.tsx";
const worker = new Worker(new URL("./pglite_worker.js", import.meta.url), {
  type: "module",
});
worker.onerror = (e: ErrorEvent) => {
  console.log("some worker error occured");
  throw e;
};
worker.onmessage = (m: MessageEvent) => {
  console.log("Some message recieved from worker");
  console.log(m);
};
const pg = await PGliteWorker.create(worker, {
  dataDir: "idb://my-db",
  extensions: {
    live,
  },
});

console.log("Creating table...");

await pg.exec(`
CREATE TABLE IF NOT EXISTS people (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);
`);

console.log("table creation done");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PGliteProvider db={pg}>
      <App />
    </PGliteProvider>
  </StrictMode>
);
