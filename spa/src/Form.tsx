import { Form, Formik } from "formik";

const UrlForm: React.FC = () => {
  return (
    <Formik
      initialValues={{ url: "" }}
      onSubmit={(values) => console.log(values)}
    >
      {({ values, handleChange }) => (
        <Form className="">
          <input
            className="p-4 m-8 w-[40em] font-semibold text-black rounded shadow shadow-black focus:outline-none focus:outline-purple-600/90 "
            type="text"
            placeholder="Url of user..."
            name="url"
            value={values.url}
            onChange={handleChange}
          />
        </Form>
      )}
    </Formik>
  );
};

export default UrlForm;
