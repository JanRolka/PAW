import { useEffect, useState } from "react";
import styles from "../styles/AuthForm.module.css";
import { useNavigate } from "react-router-dom";
import { initBackend, registerPatient, login } from "../backend/Services";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  const [backend, setBackend] = useState(
    localStorage.getItem("backend") || "firebase"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    initBackend(backend);
    localStorage.setItem("backend", backend);
  }, [backend]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      onLogin({ email, password });
    } else {
      onRegister({
        email,
        password,
        firstName,
        surname
      });
    }
  };

  const onRegister = async ({ email, password, firstName, surname }) => {
    await registerPatient(email, password, {
      firstName,
      surname
    });
  };

  const onLogin = async ({ email, password }) => {
    try {
      const user = await login(email, password); // backend assigns role from DB
      if (!user) {
        alert("Login failed: user not found"); // ✅ show popup
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userId", user.id);

      if (user.role === "doctor") {
        navigate("/doctor");
      } else if (user.role === "patient") {
        navigate("/patient");
      } else {
        navigate("/dashboard"); 
      }
    } catch (err) {
      alert(`Login error: ${err.message}`);
      console.error("Login error:", err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>{isLogin ? "Zaloguj się" : "Rejestracja pacjenta"}</h2>

      {/* Backend choice */}
      <div className={styles.field}>
        <label>Backend</label>
        <select value={backend} onChange={(e) => setBackend(e.target.value)}>
          <option value="firebase">Firebase</option>
          <option value="server">Server</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {!isLogin && (
          <>
            <div className={styles.field}>
              <label>Imię</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Nazwisko</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Hasło</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.submit}>
          {isLogin ? "Zaloguj się" : "Zarejestruj się"}
        </button>
      </form>

      {/* Toggle */}
      <p className={styles.toggleText}>
        {isLogin ? "Nie masz konta?" : "Masz już konto?"}{" "}
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setIsLogin((prev) => !prev)}
        >
          {isLogin ? "Zarejestruj się" : "Zaloguj się"}
        </button>
      </p>
    </div>
  );
}

export default AuthForm;
