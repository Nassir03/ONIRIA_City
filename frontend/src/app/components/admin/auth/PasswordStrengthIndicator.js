"use client";

const checks = [
  ["length", "At least 12 characters", (value) => value.length >= 12],
  ["upper", "Uppercase letter", (value) => /[A-Z]/.test(value)],
  ["lower", "Lowercase letter", (value) => /[a-z]/.test(value)],
  ["number", "Number", (value) => /\d/.test(value)],
  ["special", "Special character", (value) => /[^A-Za-z0-9]/.test(value)],
];

export default function PasswordStrengthIndicator({ password }) {
  return (
    <ul className="adminPasswordStrength" aria-label="Password requirements">
      {checks.map(([key, label, passes]) => (
        <li className={passes(password) ? "isMet" : ""} key={key}>
          {label}
        </li>
      ))}
    </ul>
  );
}
