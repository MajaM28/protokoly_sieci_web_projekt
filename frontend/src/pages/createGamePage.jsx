import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import * as Yup from "yup";

export default function CreateGamePage() {
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      gameName: "",
      maxPlayers: "",
    },
    validationSchema: Yup.object({
      gameName: Yup.string()
        .required("Game Name is required!")
        .max(20, "Name can't be longer then 20 char"),
      maxPlayers: Yup.number()
        .required("The max number of players is required!")
        .typeError("max players must be a number")
        .max(10, "There can only be up to ten players"),
    }),
    onSubmit: async (values) => {
      setError("");
      try {
        const response = await fetch("http://localhost:3000/api/games", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            hostId: userId,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          navigate(`/game/${data.id}`);
        } else {
          setError(data);
        }
      } catch (err) {
        console.error("Game creation error:", err);
        setError("Server error. Please try again.");
      }
    },
  });

  let errorMess;
  if (error) {
    errorMess = <p className="errorText">{error}</p>;
  }
  return (
    <div className="gameFormContainer">
      <form className="gameForm" onSubmit={formik.handleSubmit}>
        <input
          name="gameName"
          type="text"
          placeholder="game name"
          value={formik.values.gameName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.gameName && formik.errors.gameName && (
          <div className="formOneError">{formik.errors.gameName}</div>
        )}
        <input
          name="maxPlayers"
          type="number"
          placeholder="max numbers of players"
          value={formik.values.maxPlayers}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.maxPlayers && formik.errors.maxPlayers && (
          <div className="formOneError">{formik.errors.maxPlayers}</div>
        )}
        <button
          className="formOneButton"
          type="submit"
          disabled={formik.isSubmitting}
        >
          Create Game!
        </button>
        <button type="button" onClick={() => navigate("/lobby")}>
          Cancel
        </button>
      </form>
    </div>
  );
}
