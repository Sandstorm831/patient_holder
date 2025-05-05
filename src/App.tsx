function App() {
  function insertor(formData: FormData) {
    const name = formData.get("name");
    pg.query("INSERT INTO people (name) VALUES ($1)", [name]);
    console.log(`${name} is inserted into the db`);
  }

  return (
    <>
      <div className="text-gray-300">Hello</div>
      <form action={insertor}>
        <input name="name" />
        <button type="submit">Insert</button>
      </form>
    </>
  );
}

export default App;
