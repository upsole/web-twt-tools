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
    <div className="App">
      <h1> Tweeter Tools</h1>
      <button onClick={() => ok.mutate()}>healthcheck</button>
      {healthcheck && (healthcheck === "up" ? (
        <h3> Server is running! </h3>
      ) : (
        <h3> Server is down! </h3>
      ))}
      <Form />
    </div>
  );
}

export default App;
