import { Form, Formik } from "formik";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { getUserArchive, getThreadPDF } from "./data";
import { tweetUrlParser, userUrlParser } from "./lib";

const UrlForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>();
  const userArchiveMutation = useMutation(
    (url: string) => getUserArchive(url),
    {
      onSuccess: (res) => console.log(res),
    }
  );

  const threadPDFMutation = useMutation((url: string) => getThreadPDF(url), {
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
  });

  return (
    <Formik
      initialValues={{ url: "" }}
      onSubmit={(values, actions) => {
        // get user archive
        // let parsedUrl = userUrlParser(values.url);
        // userArchiveMutation.mutate(parsedUrl);

        // get thread pdf
        let parsedUrl = tweetUrlParser(values.url);
        setLoading(true);
        threadPDFMutation.mutate(parsedUrl);
        actions.resetForm();
      }}
    >
      {({ values, handleChange }) => (
        <Form className="">
          <div className="m-8 flex">
            <input
              className="p-4  w-[40em] font-semibold text-black rounded rounded-r-none shadow shadow-black focus:outline-none focus:outline-purple-600/90 "
              type="text"
              placeholder="Url of user..."
              name="url"
              value={values.url}
              onChange={handleChange}
            />
            <button
              className={`bg-purple-600 p-4 rounded rounded-l-none shadow-inner font-semibold hover:bg-purple-400`}
              type="submit"
            >
              {loading ? "Loading" : "Submit"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UrlForm;
