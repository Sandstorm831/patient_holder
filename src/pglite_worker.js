// my-pglite-worker.js
import { PGlite } from "@electric-sql/pglite";
import { worker } from "@electric-sql/pglite/worker";

try {
  worker({
    async init(options) {
      const meta = options.meta;
      // Do something with additional metadata.
      // or even run your own code in the leader along side the PGlite
      return new PGlite({
        dataDir: options.dataDir,
      });
    },
  });

  console.log("Worker process started");
} catch (e) {
  console.log("worker shat itself");
  postMessage({ message: "shatting_error", error: e });
}
