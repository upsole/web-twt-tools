import { Form, Formik } from "formik";
import { useState } from "react";
import {
  useMutation,
  UseMutateFunction,
  UseMutationResult,
} from "@tanstack/react-query";
import { getUserArchive, getThreadPDF } from "./data";
import { tweetUrlParser, userUrlParser } from "./lib";
import { AxiosResponse, AxiosError } from "axios";

type EnumEndpoint = "user-archive" | "thread";

type GenericFormParams = {
  button: string;
  placeholder: string;
  parser: any;
  mutation: UseMutationResult<AxiosResponse, AxiosError, string>;
};

interface GenericForm {
  endpoint?: EnumEndpoint;
}

const GenericForm: React.FC<GenericForm> = ({ endpoint }) => {
  const [loading, setLoading] = useState<boolean>();
  let mutation: any;
  let formParams: GenericFormParams;
  console.log("Rendered with param: ", endpoint);
  if (endpoint === "thread") {
    const threadPDFMutation = useMutation<AxiosResponse, AxiosError, string>(
      (url: string) => getThreadPDF(url),
      {
        onSuccess: ({ data }) => {
          const downloadUrl = window.URL.createObjectURL(
            new File([data], "file.pdf", { type: "application/pdf" })
          );
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.setAttribute("download", "file.pdf"); //any other extension
          document.body.appendChild(link);
          link.click();
          link.remove();
          setLoading(false);
        },
      }
    );
    formParams = {
      button: "Get Thread",
      placeholder: "last tweet in thread",
      parser: tweetUrlParser,
      mutation: threadPDFMutation,
    };
    // mutation = threadPDFMutation;
  } else if (endpoint === "user-archive") {
    const userArchiveMutation = useMutation<AxiosResponse, AxiosError, string>(
      (url: string) => getUserArchive(url),
      {
        onSuccess: (res) => console.log(res),
      }
    );
    formParams = {
      button: "Get Archive",
      placeholder: "user archive",
      parser: userUrlParser,
      mutation: userArchiveMutation,
    };
  } else {
    mutation = () => {
      return;
    };
  }

  return (
    <Formik
      initialValues={{ url: "" }}
      onSubmit={(values, actions) => {
        let parsedUrl = formParams.parser(values.url);
        setLoading(true);
        formParams.mutation.mutate(parsedUrl);
        actions.resetForm();
      }}
    >
      {({ values, handleChange }) => (
        <Form className="">
          <div className="m-8 flex">
            <input
              className="p-4  w-[40em] font-semibold text-black rounded rounded-r-none shadow shadow-black focus:outline-none focus:outline-purple-600/90 "
              type="text"
              placeholder={`Url of ${formParams.placeholder}...`}
              name="url"
              value={values.url}
              onChange={handleChange}
            />
            <button
              className={`bg-purple-600 p-4 rounded rounded-l-none shadow-inner font-semibold hover:bg-purple-400`}
              type="submit"
            >
              {loading ? "Loading" : `${formParams.button}`}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const FormSelector: React.FC = () => {
  const [endpoint, setEndPoint] = useState<EnumEndpoint>("thread");
  return (
    <div>
      <div className="flex justify-between w-1/2 m-auto">
        <button
          onClick={() => setEndPoint("thread")}
          className={`p-2 rounded ${endpoint === "thread" ? "bg-orange-500" : "bg-orange-600/80"
            }`}
        >
          Thread
        </button>
        <button
          onClick={() => setEndPoint("user-archive")}
          className={`p-2 rounded ${endpoint === "user-archive" ? "bg-orange-500" : "bg-orange-600/80"
            }`}
        >
          Archive
        </button>
      </div>
      <GenericForm endpoint={endpoint} />
    </div>
  );
};

export default FormSelector;
