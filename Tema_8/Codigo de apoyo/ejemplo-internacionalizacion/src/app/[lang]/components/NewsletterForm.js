"use client";

import { useState } from "react";
import styles from "./NewsletterForm.module.css";

/**
 * Client Component que recibe traducciones via props.
 * Demuestra el patrón de pasar traducciones desde Server Components.
 *
 * @param {string} title - Título del formulario (traducido)
 * @param {string} placeholder - Placeholder del input (traducido)
 * @param {string} buttonText - Texto del botón (traducido)
 */
export default function NewsletterForm({ title, placeholder, buttonText }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulación de envío
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>
          {buttonText}
        </button>
      </form>
      {submitted && (
        <p className={styles.success}>✓</p>
      )}
    </div>
  );
}

