import { Form, Formik } from "formik";

const UrlForm: React.FC = () => {
  return (
    <Formik
      initialValues={{ url: "" }}
      onSubmit={(values) => console.log(values)}
    >
      {({ values, handleChange }) => (
        <Form>
          <input
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
