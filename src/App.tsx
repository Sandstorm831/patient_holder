import React, { useEffect, useState } from "react";
import { PGliteWorker } from "@electric-sql/pglite/worker";
import { live, type LiveNamespace } from "@electric-sql/pglite/live";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cardio } from "ldrs/react";
import "ldrs/react/Cardio.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const global_color_code = "rgb(135, 38, 87)";
const global_color_code_hex = "#872657";

type rowObject = {
  id: number;
  name: string;
  age: number;
  gender: string;
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
let timeout: NodeJS.Timeout | null = null;

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<{ [key: string]: any }[]>([]);
  const [query, setQuery] = useState<string>("");
  const [qres, setQres] = useState<{ [key: string]: any }[]>([]);
  async function insertor(formData: FormData) {
    const name = formData.get("name");
    const age = formData.get("age");
    const gender = formData.get("gender");
    console.log(name, age, gender);
    if (db) {
      await db.query(
        "INSERT INTO patient (name, age, gender) VALUES ($1, $2, $3)",
        [name, age, gender]
      );
      console.log(`${name} is inserted into the db`);
    } else {
      console.log("db is undefined");
      console.log("printing the undefined items rows");
      console.log(items);
    }
  }

  async function runQuery() {
    if (query.length == 0) {
      setQres([]);
      return;
    }
    if (db) {
      const dbquery = `SELECT * 
      FROM patient
      WHERE name ILIKE '%${query}%'
      LIMIT 10;`;
      console.log(dbquery);
      const res = await db.query<{ [key: string]: any }>(dbquery);
      console.log("printing result array");
      console.log(res);
      setQres(res.rows);
    } else {
      console.log("db is not defined");
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
      CREATE TABLE IF NOT EXISTS patient (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          age INTEGER NOT NULL,
          gender VARCHAR(10) NOT NULL
      );
      `);
      db = pg;
      console.log("table creation done");
      await pg.live.query(`SELECT * FROM patient`, [], (res) => {
        console.log("printing result");
        console.log(res.rows);
        const x = res.rows;
        setItems(x);
        console.log("printing item rows");
        console.log(items);
      });
      console.log("are you coming here??");
      setLoading(false);
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

  useEffect(() => {
    timeout = setTimeout(() => {
      runQuery();
    }, 1000);

    return () => {
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }
    };
  }, [query]);

  return loading ? (
    <div className="h-screen w-full flex flex-col justify-center">
      <div className="w-full flex justify-center">
        <Cardio size="100" stroke="4" speed="1.2" color={`rgb(135, 38, 87)`} />
      </div>
    </div>
  ) : (
    <div className="h-full w-full p-5">
      <Tabs defaultValue="register_patient" className="w-full">
        <TabsList className="w-full h-16">
          <TabsTrigger
            value="register_patient"
            className={`w-1/2 text-3xl text-[rgb(135, 38, 87)] `}
          >
            Register Patient
          </TabsTrigger>
          <TabsTrigger
            value="query_patient"
            className={`w-1/2 text-3xl text-[rgb(135, 38, 87)] `}
          >
            Find patient record
          </TabsTrigger>
        </TabsList>
        <TabsContent value="register_patient" className="w-full">
          <Dialog>
            <div className="w-full flex justify-center h-12 my-5">
              <DialogTrigger
                className={`w-2/5 flex flex-col justify-center text-3xl bg-[#872657] text-gray-200 rounded-lg shadow-sm hover:shadow-lg transition duration-200 hover:scale-101 cursor-pointer font-mono`}
              >
                <div>Input patient details</div>
              </DialogTrigger>
            </div>
            <DialogContent className="w-full m-5">
              <DialogHeader>
                <DialogTitle className="w-full flex justify-center text-3xl text-[#872657]">
                  Enter patient's data
                </DialogTitle>
                <DialogDescription>
                  <form action={insertor}>
                    {/* Input component */}
                    <div className="relative h-14 w-full my-4 flex justify-center">
                      <input
                        className="peer text-[#444746] static outline-none bg-white w-full h-full border border-[#444746] rounded-md p-4 focus:border-[#0B57D0] transition duration-200 ease-out"
                        type="text"
                        placeholder=" "
                        name="name"
                        required
                      />
                      <label className="absolute bg-white text-[#444746] left-4 bottom-4 peer-focus:-translate-x-[5px] peer-focus:-translate-y-[31px] peer-focus:scale-95 peer peer-focus:text-[#0B57D0] transition duration-200 ease-out peer-[:not(:placeholder-shown)]:-translate-x-[5px] peer-[:not(:placeholder-shown)]:-translate-y-[31px] peer-[:not(:placeholder-shown)]:scale-95">
                        Full Name
                      </label>
                    </div>
                    {/* Upto here */}

                    {/* My radio button component */}
                    <div className="flex flex-col space-y-2 my-4 ms-1 w-full">
                      <label className="text-gray-700 font-medium w-96">
                        Gender
                      </label>

                      <div className="flex items-center space-x-6">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            required
                            className="peer hidden"
                          />
                          <div className="w-5 h-5 rounded-full border-2 border-gray-400 peer-checked:border-blue-600 peer-checked:bg-blue-600 flex items-center justify-center transition-colors">
                            <div className="w-2.5 h-2.5 rounded-full bg-white peer-checked:bg-white" />
                          </div>
                          <span className="ml-2 text-gray-800">Male</span>
                        </label>

                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            className="peer hidden"
                          />
                          <div className="w-5 h-5 rounded-full border-2 border-gray-400 peer-checked:border-pink-500 peer-checked:bg-pink-500 flex items-center justify-center transition-colors">
                            <div className="w-2.5 h-2.5 rounded-full bg-white peer-checked:bg-white" />
                          </div>
                          <span className="ml-2 text-gray-800">Female</span>
                        </label>
                      </div>
                    </div>
                    {/* upto here */}
                    {/* Age iput component starts from here */}
                    <div className="relative h-14 w-full my-4 ">
                      <input
                        className="peer text-[#444746] static outline-none bg-white w-full h-full border border-[#444746] rounded-md p-4 focus:border-[#0B57D0] transition duration-200 ease-out"
                        type="number"
                        placeholder=" "
                        name="age"
                        min={0}
                        max={150}
                        required
                      />
                      <label className="absolute bg-white text-[#444746] left-4 bottom-4 peer-focus:-translate-x-[5px] peer-focus:-translate-y-[31px] peer-focus:scale-95 peer peer-focus:text-[#0B57D0] transition duration-200 ease-out peer-[:not(:placeholder-shown)]:-translate-x-[5px] peer-[:not(:placeholder-shown)]:-translate-y-[31px] peer-[:not(:placeholder-shown)]:scale-95">
                        Age
                      </label>
                    </div>
                    {/* Upto here */}
                    <button
                      type="submit"
                      className="h-14 w-full flex justify-center bg-[#872657] text-white text-2xl rounded-lg hover:shadow-lg transition duration-200 cursor-pointer"
                    >
                      <div className="h-full flex flex-col justify-center">
                        Insert
                      </div>
                    </button>
                    {/* <DialogClose asChild>
                        <button type="button">Close</button>
                      </DialogClose> */}
                  </form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <div className="flex justify-center w-full font-mono">
            <div className="w-4/5 grid grid-cols-4 grid-auto-flow-row auto-rows-[50px] bg-[#872657] border rounded-lg">
              <div className="border-[#872657] rounded-lg bg-[#872657] text-[#fffefc] text-3xl flex justify-center w-full">
                <div className="flex flex-col h-full justify-center">
                  PatientId
                </div>
              </div>
              <div className="border-[#872657] rounded-lg bg-[#872657] text-[#fffefc] text-3xl flex justify-center w-full">
                <div className="flex flex-col h-full justify-center">Name</div>
              </div>
              <div className="border-[#872657] rounded-lg bg-[#872657] text-[#fffefc] text-3xl flex justify-center w-full">
                <div className="flex flex-col h-full justify-center">Age</div>
              </div>
              <div className="border-[#872657] rounded-lg bg-[#872657] text-[#fffefc] text-3xl flex justify-center w-full">
                <div className="flex flex-col h-full justify-center">
                  Gender
                </div>
              </div>
              {items && items.length
                ? items.map((item, id: number) => {
                    if (isRowObjectType(item)) {
                      return (
                        <React.Fragment key={id}>
                          <div className="px-2 h-full bg-white text-black text-xl flex justify-center w-full font-mono">
                            <div className="flex flex-col justify-center">
                              {item.id}
                            </div>
                          </div>
                          <div className="px-2 h-full bg-white text-black text-xl flex justify-center w-full font-mono">
                            <div className="flex flex-col justify-center">
                              {item.name}
                            </div>
                          </div>
                          <div className="px-2 h-full bg-white text-black text-xl flex justify-center w-full font-mono">
                            <div className="flex flex-col justify-center">
                              {item.age}
                            </div>
                          </div>
                          <div className="px-2 h-full bg-white text-black text-xl flex justify-center w-full font-mono">
                            <div className="flex flex-col justify-center">
                              {item.gender}
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    } else {
                      return null;
                    }
                  })
                : null}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="query_patient">
          {/* Insert for querying logic */}
          <div className="w-full flex justify-center mb-5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter the name of patient"
              type="text"
              className="h-16 w-4/5 px-8 py-2 text-2xl border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-center w-full font-mono">
            <div className="w-4/5 grid grid-cols-4 grid-auto-flow-row auto-rows-[50px] bg-[#872657] border rounded-lg">
              <div className="border-[#872657] rounded-lg bg-[#872657] text-[#fffefc] text-3xl flex justify-center w-full">
                <div className="flex flex-col h-full justify-center">
                  PatientId
                </div>
              </div>
              <div className="border-[#872657] rounded-lg bg-[#872657] text-[#fffefc] text-3xl flex justify-center w-full">
                <div className="flex flex-col h-full justify-center">Name</div>
              </div>
              <div className="border-[#872657] rounded-lg bg-[#872657] text-[#fffefc] text-3xl flex justify-center w-full">
                <div className="flex flex-col h-full justify-center">Age</div>
              </div>
              <div className="border-[#872657] rounded-lg bg-[#872657] text-[#fffefc] text-3xl flex justify-center w-full">
                <div className="flex flex-col h-full justify-center">
                  Gender
                </div>
              </div>
              {qres && qres.length
                ? qres.map((item, id: number) => {
                    if (isRowObjectType(item)) {
                      return (
                        <React.Fragment key={id}>
                          <div className="px-2 h-full bg-white text-black text-xl flex justify-center w-full font-mono">
                            <div className="flex flex-col justify-center">
                              {item.id}
                            </div>
                          </div>
                          <div className="px-2 h-full bg-white text-black text-xl flex justify-center w-full font-mono">
                            <div className="flex flex-col justify-center">
                              {item.name}
                            </div>
                          </div>
                          <div className="px-2 h-full bg-white text-black text-xl flex justify-center w-full font-mono">
                            <div className="flex flex-col justify-center">
                              {item.age}
                            </div>
                          </div>
                          <div className="px-2 h-full bg-white text-black text-xl flex justify-center w-full font-mono">
                            <div className="flex flex-col justify-center">
                              {item.gender}
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    } else {
                      return null;
                    }
                  })
                : null}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/*  */}

      {/*  */}

      {/* <div className="flex flex-col grow-1">
        {items && items.length
          ? items.map((item, id: number) => {
              if (isRowObjectType(item)) {
                return <div key={id}>{item.name}</div>;
              } else {
                return null;
              }
            })
          : null}
      </div> */}
    </div>
  );
}

export default App;
