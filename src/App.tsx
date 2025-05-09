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

// const global_color_code = "rgb(135, 38, 87)";
// const global_color_code_hex = "#872657";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<{ [key: string]: any }[]>([]);
  const [query, setQuery] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [qres, setQres] = useState<{ [key: string]: any }[]>([]);
  async function insertor(formData: FormData) {
    const name = formData.get("name");
    const age = formData.get("age");
    const gender = formData.get("gender");
    if (db) {
      await db.query(
        "INSERT INTO patient (name, age, gender) VALUES ($1, $2, $3)",
        [name, age, gender]
      );
    } else {
      console.log("db is undefined");
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await db.query<{ [key: string]: any }>(dbquery);
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

      await pg.exec(`
      CREATE TABLE IF NOT EXISTS patient (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          age INTEGER NOT NULL,
          gender VARCHAR(10) NOT NULL
      );
      `);
      db = pg;
      await pg.live.query(`SELECT * FROM patient`, [], (res) => {
        const x = res.rows;
        setItems(x);
      });
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
    // Uncomment to listen to worker and log the messages
    // worker.onmessage = (m: MessageEvent) => {
    //   console.log("Some message recieved from worker");
    //   console.log(m);
    // };
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return loading ? (
    <div className="h-screen w-full flex flex-col justify-center">
      <div className="w-full flex justify-center">
        <Cardio size="100" stroke="4" speed="1.2" color={`rgb(135, 38, 87)`} />
      </div>
    </div>
  ) : (
    <div className="h-full w-full max-md:px-1 max-md:py-2 md:p-5">
      <Tabs defaultValue="register_patient" className="w-full">
        <TabsList className="w-full h-16">
          <TabsTrigger
            value="register_patient"
            className={`w-1/2 md:text-3xl text-[rgb(135, 38, 87)] font-mono`}
          >
            Register patient
          </TabsTrigger>
          <TabsTrigger
            value="query_patient"
            className={`w-1/2 max-md:text-sm md:text-3xl text-[rgb(135, 38, 87)] font-mono`}
          >
            Find patient record
          </TabsTrigger>
        </TabsList>
        <TabsContent value="register_patient" className="w-full">
          <Dialog>
            <div className="w-full flex justify-center max-md:h-16 md:h-12 my-5">
              <DialogTrigger
                className={`w-2/5 flex flex-col justify-center max-lg:text-md lg:text-3xl bg-[#872657] text-gray-200 rounded-lg shadow-sm hover:shadow-lg transition duration-200 hover:scale-101 cursor-pointer font-mono`}
              >
                <div>Input patient details</div>
              </DialogTrigger>
            </div>
            <DialogContent className="w-full md:m-5">
              <DialogHeader>
                <DialogTitle className="w-full flex justify-center max-md:text-md md:text-3xl text-[#872657]">
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
                      <label className="text-gray-700 font-medium w-full flex">
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
          <TableComp items={items} />
        </TabsContent>
        <TabsContent value="query_patient">
          {/* Insert for querying logic */}
          <div className="w-full flex justify-center mb-5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter the name of patient"
              type="text"
              className="max-lg:h-12 lg:h-16 w-4/5 px-8 lg:py-2 max-lg:text-md lg:text-2xl border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <TableComp items={qres} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TableComp({
  items,
}: {
  items: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }[];
}) {
  return (
    <div className="flex justify-center w-full font-mono">
      <div className="w-4/5 grid grid-cols-4 grid-auto-flow-row auto-rows-[50px] bg-[#872657] border rounded-lg">
        <div className="border-[#872657] rounded-lg bg-[#872657] text-[#fffefc] max-lg:text-sm lg:text-3xl flex justify-center w-full">
          <div className="flex flex-col h-full justify-center">PatientId</div>
        </div>
        <div className="border-[#872657] rounded-lg bg-[#872657] text-[#fffefc] max-lg:text-sm lg:text-3xl flex justify-center w-full">
          <div className="flex flex-col h-full justify-center">Name</div>
        </div>
        <div className="border-[#872657] rounded-lg bg-[#872657] text-[#fffefc] max-lg:text-sm lg:text-3xl flex justify-center w-full">
          <div className="flex flex-col h-full justify-center">Age</div>
        </div>
        <div className="border-[#872657] rounded-lg bg-[#872657] text-[#fffefc] max-lg:text-sm lg:text-3xl flex justify-center w-full">
          <div className="flex flex-col h-full justify-center">Gender</div>
        </div>
        {items && items.length
          ? items.map((item, id: number) => {
              if (isRowObjectType(item)) {
                return (
                  <React.Fragment key={id}>
                    <div className="px-2 h-full bg-white text-black max-md:text-sm md:text-xl flex justify-center w-full font-mono">
                      <div className="flex flex-col justify-center">
                        {item.id}
                      </div>
                    </div>
                    <div className="px-2 h-full bg-white text-black max-md:text-sm md:text-xl flex justify-center w-full font-mono">
                      <div className="flex flex-col justify-center">
                        {item.name}
                      </div>
                    </div>
                    <div className="px-2 h-full bg-white text-black max-md:text-sm md:text-xl flex justify-center w-full font-mono">
                      <div className="flex flex-col justify-center">
                        {item.age}
                      </div>
                    </div>
                    <div className="px-2 h-full bg-white text-black max-md:text-sm md:text-xl flex justify-center w-full font-mono">
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
  );
}

export default App;
