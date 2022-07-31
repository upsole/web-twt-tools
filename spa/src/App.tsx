import { useState } from "react";
// import "./App.css";
import { useMutation } from "@tanstack/react-query";
import { getOk, getUserArchive } from "./data";

import Form from "./Form";


function App() {
  // const [healthcheck, setHealthCheck] = useState("");
  // const ok = useMutation(() => getOk(), {
  //   onSuccess: (res) => {
  //     console.log(res);
  //     setHealthCheck("up");
  //   },
  //   onError: () => {
  //     console.log("Server is down");
  //     setHealthCheck("down");
  //   },
  // });

  return (
    <div className="flex flex-col h-screen">
      <main className="mx-auto mt-8">
        <Form />
      </main>
    </div>
  );
}

export default App;
