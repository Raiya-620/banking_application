import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "../context/AuthContext";
import Link from "next/link";
import styles from "./login.module.css";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Use AuthContext login to centralize token storage
      await login(credentials);
      router.push("/dashboard");
    } catch (err) {
      // Use warn instead of error to avoid Next dev overlay for handled login errors
      console.warn("Login failed: invalid credentials", err);
      setError(err?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign in to your account</h2>
        <p className={styles.subtitle}>
          Welcome back — enter your details to continue.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
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
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              required
              onChange={handleChange}
              className={styles.input}
              placeholder="Your password"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div>
            <button type="submit" disabled={loading} className={styles.btn}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className={styles.footer}>
          Don&#39;t have an account?{" "}
          <Link href="/register" className={styles.link}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
