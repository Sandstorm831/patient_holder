import { usePGlite, useLiveQuery } from "@electric-sql/pglite-react";

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

function App() {
  const db = usePGlite();
  const items = useLiveQuery(`SELECT * FROM people`);
  console.log(typeof items);
  console.log(items);
  function insertor(formData: FormData) {
    const name = formData.get("name");
    db.query("INSERT INTO people (name) VALUES ($1)", [name]);
    console.log(`${name} is inserted into the db`);
  }

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
        {items
          ? items.rows.map((item, id: number) => {
              if (isRowObjectType(item)) {
                return <div key={id}>{item.name}</div>;
              } else {
                return null;
              }
            })
          : null}
      </div>
    </>
  );
}

export default App;
