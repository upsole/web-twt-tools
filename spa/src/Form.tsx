import { Form, Formik } from "formik";
import { useState } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { getUserArchive, getThreadPDF } from "./data";
import { tweetUrlParser, userUrlParser } from "./lib";
import { AxiosResponse, AxiosError } from "axios";

type EnumEndpoint = "user-archive" | "thread";

type GenericFormParams = {
  type: EnumEndpoint;
  button: string;
  placeholder: string;
  parser: any;
  mutation: UseMutationResult<AxiosResponse, AxiosError, string>;
};

interface GenericForm {
  endpoint: EnumEndpoint;
}

const GenericForm: React.FC<GenericForm> = ({ endpoint }) => {
  const [loading, setLoading] = useState<boolean>();
  let formParams: GenericFormParams;
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
      type: endpoint,
      button: "Get Thread",
      placeholder: "last tweet in thread",
      parser: tweetUrlParser,
      mutation: threadPDFMutation,
    };
  } else if (endpoint === "user-archive") {
    const userArchiveMutation = useMutation<AxiosResponse, AxiosError, string>(
      (url: string) => getUserArchive(url),
      {
        // onSuccess: ({ data }) => {
        //   let myWindow = window.open("", "_blank", "resizable=yes");
        //   myWindow!.document.write(data);
        //   setLoading(false);
        // },
        onSuccess: ({ data }) => {
          const downloadUrl = window.URL.createObjectURL(
            new File([data], "archive.html", { type: "text/html" })
          );
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.target = '_blank';
          // link.setAttribute("download", "file.pdf"); //any other extension
          document.body.appendChild(link);
          link.click();
          link.remove();
          setLoading(false);
        },
      }
    );
    formParams = {
      type: endpoint,
      button: "Get Archive",
      placeholder: "user archive",
      parser: userUrlParser,
      mutation: userArchiveMutation,
    };
  }

  if (!formParams!) {
    return <h3> Oops, formParams not set </h3>;
  }

  const SubmitBtn: React.FC<{kind: EnumEndpoint, text: string}> = ({kind, text}) => {
    let kindStyle: string = "";
    if (kind === "user-archive") {
      kindStyle = "bg-orange-500"
    } else if (kind === "thread") {
      kindStyle = "bg-purple-600"
    } 
    return (
      <button
        className={`${kindStyle} p-4 rounded rounded-l-none shadow-inner font-semibold hover:bg-purple-400`}
        type="submit"
      >
        {loading ? "Loading" : `${text}`}
      </button>
    );
  };

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
              <SubmitBtn kind={endpoint} text={formParams.button}/>
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
