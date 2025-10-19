import { useState } from "react";
import api from "../services/api.js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./register.module.css";

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [emailExistsPrompt, setEmailExistsPrompt] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // clear that field's error when user starts typing
    setFieldErrors((prev) => {
      if (!prev || !prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });
    // if user edits email, hide duplicate-email prompt
    if (name === "email") setEmailExistsPrompt(false);
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.registerUser(formData);
      router.push("/login");
    } catch (err) {
      // Use warn instead of error to avoid Next dev overlay for handled validation errors
      console.warn("Registration failed:", err);
      // If backend returned a validation object, set per-field errors
      const resp = err?.response;
      if (resp && typeof resp === "object") {
        setFieldErrors(resp);
        // detect duplicate-email message and set a small CTA prompt
        const emailMsg =
          resp.email &&
          (Array.isArray(resp.email)
            ? resp.email.join(" ")
            : String(resp.email));
        if (emailMsg && /already exists/i.test(emailMsg)) {
          setEmailExistsPrompt(true);
        } else {
          setEmailExistsPrompt(false);
        }
        // show a summary message too
        setError(Object.values(resp).flat().join(" "));
      } else {
        setError(
          err?.message ||
            "Registration failed. Please check your details and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create an account</h2>
        <p className={styles.subtitle}>
          Join now to manage your finances securely.
        </p>

        <form onSubmit={registerUser} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.field}>
            <label className={styles.label}>First name</label>
            <input
              name="first_name"
              type="text"
              required
              onChange={handleChange}
              className={styles.input}
              placeholder="John"
            />
            {fieldErrors.first_name && (
              <p className={styles.fieldError}>
                {Array.isArray(fieldErrors.first_name)
                  ? fieldErrors.first_name.join(" ")
                  : String(fieldErrors.first_name)}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Last name</label>
            <input
              name="last_name"
              type="text"
              required
              onChange={handleChange}
              className={styles.input}
              placeholder="Doe"
            />
            {fieldErrors.last_name && (
              <p className={styles.fieldError}>
                {Array.isArray(fieldErrors.last_name)
                  ? fieldErrors.last_name.join(" ")
                  : String(fieldErrors.last_name)}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              required
              onChange={handleChange}
              className={styles.input}
              placeholder="you@example.com"
            />
            {/* {fieldErrors.email && (
              <p className={styles.fieldError}>{
                Array.isArray(fieldErrors.email) ? fieldErrors.email.join(' ') : String(fieldErrors.email)
              }</p>
            )}
            {emailExistsPrompt && (
              <p className={styles.fieldError}>
                It looks like an account already exists for this email. <Link href="/login" className={styles.link}>Sign in instead</Link>.
              </p>
            )} */}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              required
              onChange={handleChange}
              className={styles.input}
              placeholder="Choose a strong password"
            />
            {fieldErrors.password && (
              <p className={styles.fieldError}>
                {Array.isArray(fieldErrors.password)
                  ? fieldErrors.password.join(" ")
                  : String(fieldErrors.password)}
              </p>
            )}
          </div>

          <div>
            <button type="submit" disabled={loading} className={styles.btn}>
              {loading ? "Creating..." : "Create account"}
            </button>
          </div>
        </form>

        <div className={styles.footer}>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
