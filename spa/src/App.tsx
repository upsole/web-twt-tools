import { useState } from "react";
// import "./App.css";
import { useMutation } from "@tanstack/react-query";
import { getOk, getUserArchive } from "./data";

import Form from "./Form";


function App() {
  const [healthcheck, setHealthCheck] = useState("");
  const ok = useMutation(() => getOk(), {
    onSuccess: (res) => {
      console.log(res);
      setHealthCheck("up");
    },
    onError: () => {
      console.log("Server is down");
      setHealthCheck("down");
    },
  });

  return (
    <div className="flex flex-col h-screen">
      <main className="mx-auto mt-8">
        <button className="border border-black rounded-lg p-2"
          onClick={() => ok.mutate()}>healthcheck</button>
        {healthcheck && (healthcheck === "up" ? (
          <h3> Server is running! </h3>
        ) : (
          <h3> Server is down! </h3>
        ))}
        <Form />
      </main>
    </div>
  );
}

export default App;
