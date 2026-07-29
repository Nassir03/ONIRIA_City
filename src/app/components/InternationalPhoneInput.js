"use client";

import PhoneInput from "react-phone-number-input";

export default function InternationalPhoneInput({
  id,
  value,
  onChange,
  error,
}) {
  return (
    <div className={`internationalPhoneField ${error ? "hasError" : ""}`}>
      <PhoneInput
        id={id}
        className="internationalPhoneInput"
        defaultCountry="TZ"
        countryCallingCodeEditable={false}
        international
        value={value || undefined}
        onChange={(nextValue) => onChange(nextValue || "")}
        placeholder="Enter phone number"
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p className="formInlineError" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
