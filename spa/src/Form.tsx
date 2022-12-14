import { Form, Formik } from "formik";
import { useState } from "react";
import {
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  requestUserArchive,
  requestThread,
  checkJob,
} from "./data";
import { truncateDecimals, sleep, tweetUrlParser, userUrlParser, downloadFile } from "./lib";
import { AxiosResponse, AxiosError } from "axios";

type EnumEndpoint = "user-archive" | "thread";
type MutateArgs = { url: string; limit?: number };

type GenericFormParams = {
  type: EnumEndpoint;
  button: string;
  placeholder: string;
  parser: any;
  mutation: UseMutationResult<AxiosResponse, AxiosError, MutateArgs>;
};

interface GenericForm {
  endpoint: EnumEndpoint;
}


const ProcessInfo: React.FC<{msg: string}> = ({msg}) => {
  /* const [infoMsg, setInfoMsg] = useState(""); */
  return (
    <div className="bg-orange-400 p-4 mx-44 my-4 rounded font-semibold text-center">
      <p className="animate-pulse">{msg}</p>
    </div>
  );
};


const GenericForm: React.FC<GenericForm> = ({ endpoint }) => {
  const [infoMsg, setInfoMsg] = useState("");
  const [loading, setLoading] = useState<boolean>();
  const [serverError, setServerError] = useState("");
  const checkJobLoop = async (url: string, format: string) => {
    setInfoMsg("Your request is being processed")
    let res = await checkJob(url)
    while (res.data.status === "pending") {
      if (res.data.progress === 0 && format === "pdf") {
        setInfoMsg("Scraping thread...")
      } else {
        setInfoMsg(`${truncateDecimals(res.data.progress)}% completed...`)
      }
      await sleep(2000)
      res = await checkJob(url)
    }
    if (res.data.status === "success") {
      await downloadFile(res.data.downloadUrl, format)
      setLoading(false)
      setInfoMsg("")
    } else {
      setServerError("Build Failed")
      setLoading(false)
    }
  }

  let formParams: GenericFormParams;
  if (endpoint === "thread") {
    const requestThreadMutation = useMutation<
      AxiosResponse,
      AxiosError,
      MutateArgs
    >((params: MutateArgs) => requestThread(params.url), {
      onSuccess: async ({ data }) => {
        // checkJobMutation.mutate({ url: data.url, format: "pdf" });
        await checkJobLoop(data.url, "pdf")
      },
      onError: (err) => {
        setServerError(
          err.response?.status! === 400
            ? "Invalid Tweet ID"
            : err.response?.statusText! || "Server down"
        );
        setLoading(false);
        setTimeout(() => setServerError(""), 3000);
      },
    });
    formParams = {
      type: endpoint,
      button: "Get Thread",
      placeholder: "last tweet in thread",
      parser: tweetUrlParser,
      mutation: requestThreadMutation,
    };
  } else if (endpoint === "user-archive") {
    const userArchiveMutation = useMutation<
      AxiosResponse,
      AxiosError,
      MutateArgs
    >((params: MutateArgs) => requestUserArchive(params), {
      onSuccess: async ({ data }) => {
        await checkJobLoop(data.url, "html")
      },
      onError: (err) => {
        //@ts-ignore
        if (err.response?.status.toString() == "0") {
          setServerError("Server down");
        } else {
          //@ts-ignore
          setServerError(err.response.data.detail);
        }
        setLoading(false);
        setTimeout(() => setServerError(""), 3000);
      },
    });
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

  const SubmitBtn: React.FC<{
    text: string;
    disabled?: boolean;
  }> = ({ text, disabled }) => {
    return (
      <button
        className={`${disabled ? "bg-orange-400" : "bg-purple-600 hover:bg-purple-400"
          } mt-4 md:mt-0 p-4 rounded rounded-l-none font-semibold grow-0 flex items-center active:shadow-inner active:shadow-gray-800 active:bg-purple-600`}
        type="submit"
        disabled={disabled}
      >
        {disabled && (
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        <p className="mx-4">{loading ? "Loading" : `${text}`}</p>
      </button>
    );
  };

  return (
    <Formik
      initialValues={{ url: "", limit: 10 }}
      onSubmit={(values) => {
        if (!values.url) {
          setServerError("Please provide a valid URL");
          setTimeout(() => setServerError(""), 3000);
          return;
        }
        let parsedValues = {
          url: formParams.parser(values.url),
          limit: values.limit,
        };
        setLoading(true);
        setServerError("");
        formParams.mutation.mutate(parsedValues);
        /* actions.resetForm(); */
      }}
    >
      {({ values, handleChange }) => (
        <Form className="p-4">
          <div className="m-2 flex flex-wrap justify-center md:m-8 md:flex-row">
            <input
              className="p-4 font-semibold text-black rounded md:rounded-r-none shadow shadow-black focus:outline-none focus:outline-purple-600/90 md:grow"
              type="text"
              placeholder={`Url of ${formParams.placeholder}...`}
              name="url"
              value={values.url}
              onChange={handleChange}
            />
            {formParams.type === "user-archive" && (
              <input
                className={`mt-4 md:mt-0 rounded md:rounded-none p-4 text-black text-xs font-semibold text-opacity-70 md:border-l md:border-l-black shadow-black focus:outline-none grow-0 max-w-[20vw] md:max-w-[8vw] focus:outline-purple-600/90 focus:border-none`}
                type="number"
                min={0}
                name="limit"
                placeholder="Limit (defaults to 10 posts)"
                value={values.limit}
                onChange={handleChange}
              />
            )}
            <SubmitBtn text={formParams.button} disabled={loading} />
          </div>
          {serverError && (
            <div className="bg-red-400 p-4 mx-44 my-4 rounded font-semibold text-center">
              {serverError}
            </div>
          )}

          {loading && infoMsg && <ProcessInfo msg={infoMsg} />}
        </Form>
      )}
    </Formik>
  );
};

const Tab: React.FC<{ text: string; fn: any; active: boolean }> = ({
  text,
  fn,
  active,
}) => {
  return (
    <button
      onClick={() => fn()}
      className={`p-2 text-sm font-bold border-l-8 grow ${active
          ? "bg-zinc-700  border-l-purple-600"
          : "border-l-purple-600 border-opacity-20 hover:border-opacity-100 hover:border-l-purple-400 hover:bg-zinc-600"
        } `}
    >
      {text}
    </button>
  );
};

const InfoPanel: React.FC<{ title: string; rows: string[] }> = ({
  title,
  rows,
}) => {
  return (
    <div className="p-2 mt-12 m-auto rounded w-10/12 text-center text-zinc-200 font-semibold bg-zinc-600">
      <h3>{title}</h3>
      <ul className="text-sm font-normal text-left w-3/4 m-auto">
        {rows.map((r, i) => (
          <li key={i}> - {r} </li>
        ))}
      </ul>
    </div>
  );
};

const infoParams = {
  thread: {
    title: "Convert Thread to PDF",
    rows: [
      "Enter the URL for the last tweet of the thread",
      "It might take a while",
    ],
  },
  "user-archive": {
    title: "User Archive",
    rows: [
      "Enter the URL for the user",
      "By default, retrieves last 10 tweets. 0 Means the whole available archive",
      "Output is HTML",
    ],
  },
};

const FormSelector: React.FC = () => {
  const [endpoint, setEndPoint] = useState<EnumEndpoint>("thread");
  return (
    <>
      <div className="m-auto md:w-[60vw] border-transparent rounded shadow-lg shadow-gray-900">
        <div className="flex m-auto">
          <Tab
            text="Thread"
            fn={() => setEndPoint("thread")}
            active={endpoint === "thread"}
          />
          <Tab
            text="Archive"
            fn={() => setEndPoint("user-archive")}
            active={endpoint === "user-archive"}
          />
        </div>
        <GenericForm endpoint={endpoint} />
      </div>
      <InfoPanel
        title={infoParams[`${endpoint}`].title}
        rows={infoParams[`${endpoint}`].rows}
      />
    </>
  );
};

export default FormSelector;
