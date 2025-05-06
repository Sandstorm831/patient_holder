import { useEffect, useState } from "react";
import { PGliteWorker } from "@electric-sql/pglite/worker";
import { live, type LiveNamespace } from "@electric-sql/pglite/live";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type rowObject = {
  id: number;
  name: string;
};

function isRowObjectType(item: { [key: string]: unknown }): item is rowObject {
  return (
    typeof item === "object" &&
    item !== null &&
    typeof item["id"] === "number" &&
    typeof item["name"] === "string"
  );
}

type dbworker = (PGliteWorker & { live: LiveNamespace }) | null;
let db: dbworker = null;

function App() {
  // let items: { [key: string]: any }[] = [];
  const [items, setItems] = useState<{ [key: string]: any }[]>([]);
  async function insertor(formData: FormData) {
    const name = formData.get("name");
    if (db) {
      await db.query("INSERT INTO people (name) VALUES ($1)", [name]);
      console.log(`${name} is inserted into the db`);
    } else {
      console.log("db is undefined");
      console.log("printing the undefined items rows");
      console.log(items);
    }
  }

  useEffect(() => {
    //////// Creator function //////////////
    async function creator() {
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
      db = pg;
      console.log("table creation done");
      await pg.live.query(`SELECT * FROM people`, [], (res) => {
        console.log("printing result");
        console.log(res.rows);
        const x = res.rows;
        setItems(x);
        console.log("printing item rows");
        console.log(items);
      });
      console.log("are you coming here??");
      db = pg;
    }
    /////////////////////////////////////////

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
    creator();
  }, []);

  return (
    <>
      <div className="w-full h-1/2 bg-gray-300">
        <div className="text-gray-300">Hello</div>
        <form action={insertor}>
          <input name="name" />
          <button type="submit">Insert</button>
        </form>
      </div>
      <div className="flex flex-col grow-1">
        {items && items.length
          ? items.map((item, id: number) => {
              if (isRowObjectType(item)) {
                return <div key={id}>{item.name}</div>;
              } else {
                return null;
              }
            })
          : null}
      </div>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </>
  );
}

export default App;
