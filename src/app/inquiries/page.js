"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import PublicPageHero from "../components/PublicPageHero";
import Footer from "../components/Footer";

const initialFormData = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  inquiryType: "",
  propertyCollection: "",
  bedrooms: "",
  budget: "",
  preferredContact: "",
  preferredDate: "",
  message: "",
  consent: false,
};

const allowedInquiryTypes = [
  "property-information",
  "site-visit",
  "consultation",
  "brochure",
  "commercial",
];

const allowedCollections = [
  "villas",
  "residences",
  "v-avenue",
  "commercial",
];

export default function InquiriesPage() {
  const [formData, setFormData] = useState(initialFormData);

  const [status, setStatus] = useState({
    type: "",
    message: "",
    reference: "",
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const inquiryType = searchParams.get("type");
    const collection = searchParams.get("collection");
    const property = searchParams.get("property");

    setFormData((current) => ({
      ...current,

      inquiryType: allowedInquiryTypes.includes(inquiryType)
        ? inquiryType
        : current.inquiryType,

      propertyCollection: allowedCollections.includes(collection)
        ? collection
        : current.propertyCollection,

      message: property
        ? `I would like more information about ${property
            .replaceAll("-", " ")
            .replace(/\b\w/g, (letter) => letter.toUpperCase())}.`
        : current.message,
    }));
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (status.message) {
      setStatus({
        type: "",
        message: "",
        reference: "",
      });
    }
  }

  function createReferenceNumber() {
    const date = new Date();

    const datePart = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("");

    const randomPart = Math.floor(10000 + Math.random() * 90000);

    return `ON-${datePart}-${randomPart}`;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.inquiryType ||
      !formData.consent
    ) {
      setStatus({
        type: "error",
        message:
          "Please complete your full name, email, phone number, inquiry type and communication consent.",
        reference: "",
      });

      return;
    }

    const reference = createReferenceNumber();

    setStatus({
      type: "success",
      message:
        "Thank you. Your ONIRIA inquiry has been recorded successfully in this prototype.",
      reference,
    });

    setFormData(initialFormData);
  }

  return (
    <main>
      <Header />

      <PublicPageHero
        eyebrow="REGISTER YOUR INTEREST"
        title="Begin Your ONIRIA Journey"
        description="Tell us what you are interested in and our team will guide you through the next step."
        image="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=2000&q=85"
      />

      <section className="inquiryPageSection" id="page-content">
        <div className="inquiryPageHeading">
          <div>
            <p className="sectionLabel">PROPERTY INQUIRY</p>

            <h2>Tell us what you are looking for</h2>
          </div>

          <p>
            Use this form to request property information, arrange a site
            visit, ask for a consultation or explore commercial opportunities.
          </p>
        </div>

        <div className="inquiryPageLayout">
          <aside className="inquirySidebar">
            <p className="sectionLabel">YOUR OPTIONS</p>

            <div className="inquirySidebarItem">
              <span>01</span>

              <h3>Property information</h3>

              <p>
                Request verified details about villas, residences, apartments
                or commercial spaces.
              </p>
            </div>

            <div className="inquirySidebarItem">
              <span>02</span>

              <h3>Site visit</h3>

              <p>
                Ask the team to contact you about visiting the project
                location.
              </p>
            </div>

            <div className="inquirySidebarItem">
              <span>03</span>

              <h3>Consultation</h3>

              <p>
                Arrange a conversation about property selection, investment or
                business opportunities.
              </p>
            </div>

            <div className="inquirySidebarItem">
              <span>04</span>

              <h3>WhatsApp</h3>

              <p>
                Continue through WhatsApp when you prefer a direct
                conversation.
              </p>
            </div>
          </aside>

          <form className="inquiryForm" onSubmit={handleSubmit}>
            <div className="formSection">
              <p className="formSectionLabel">
                01 · PERSONAL INFORMATION
              </p>

              <div className="formGrid">
                <div className="formField">
                  <label htmlFor="inquiry-full-name">
                    Full name *
                  </label>

                  <input
                    id="inquiry-full-name"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="formField">
                  <label htmlFor="inquiry-email">
                    Email address *
                  </label>

                  <input
                    id="inquiry-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                </div>

                <div className="formField">
                  <label htmlFor="inquiry-phone">
                    Phone number *
                  </label>

                  <input
                    id="inquiry-phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+255"
                  />
                </div>

                <div className="formField">
                  <label htmlFor="inquiry-country">
                    Country
                  </label>

                  <input
                    id="inquiry-country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter your country"
                  />
                </div>
              </div>
            </div>

            <div className="formSection">
              <p className="formSectionLabel">
                02 · YOUR INTEREST
              </p>

              <div className="formGrid">
                <div className="formField">
                  <label htmlFor="inquiry-type">
                    Inquiry type *
                  </label>

                  <select
                    id="inquiry-type"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select inquiry type
                    </option>

                    <option value="property-information">
                      Property information
                    </option>

                    <option value="site-visit">
                      Site visit
                    </option>

                    <option value="consultation">
                      Consultation
                    </option>

                    <option value="brochure">
                      Brochure request
                    </option>

                    <option value="commercial">
                      Commercial opportunity
                    </option>
                  </select>
                </div>

                <div className="formField">
                  <label htmlFor="property-collection">
                    Property collection
                  </label>

                  <select
                    id="property-collection"
                    name="propertyCollection"
                    value={formData.propertyCollection}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select collection
                    </option>

                    <option value="villas">
                      ONIRIA Villas
                    </option>

                    <option value="residences">
                      ONIRIA Residences
                    </option>

                    <option value="v-avenue">
                      V Avenue
                    </option>

                    <option value="commercial">
                      Commercial spaces
                    </option>
                  </select>
                </div>

                <div className="formField">
                  <label htmlFor="inquiry-bedrooms">
                    Preferred bedrooms
                  </label>

                  <select
                    id="inquiry-bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                  >
                    <option value="">
                      Any
                    </option>

                    <option value="1">
                      1 bedroom
                    </option>

                    <option value="2">
                      2 bedrooms
                    </option>

                    <option value="3">
                      3 bedrooms
                    </option>

                    <option value="4">
                      4 bedrooms
                    </option>

                    <option value="5-plus">
                      5+ bedrooms
                    </option>
                  </select>
                </div>

                <div className="formField">
                  <label htmlFor="inquiry-budget">
                    Budget preference
                  </label>

                  <select
                    id="inquiry-budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                  >
                    <option value="">
                      Prefer not to say
                    </option>

                    <option value="entry">
                      Entry collection
                    </option>

                    <option value="premium">
                      Premium collection
                    </option>

                    <option value="signature">
                      Signature collection
                    </option>

                    <option value="commercial">
                      Commercial opportunity
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="formSection">
              <p className="formSectionLabel">
                03 · CONTACT PREFERENCE
              </p>

              <div className="formGrid">
                <div className="formField">
                  <label htmlFor="preferred-contact">
                    Preferred contact method
                  </label>

                  <select
                    id="preferred-contact"
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select method
                    </option>

                    <option value="email">
                      Email
                    </option>

                    <option value="phone">
                      Telephone
                    </option>

                    <option value="whatsapp">
                      WhatsApp
                    </option>
                  </select>
                </div>

                <div className="formField">
                  <label htmlFor="preferred-date">
                    Preferred contact or visit date
                  </label>

                  <input
                    id="preferred-date"
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="formField formFieldFull">
                  <label htmlFor="inquiry-message">
                    Additional information
                  </label>

                  <textarea
                    id="inquiry-message"
                    name="message"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your preferred property, questions or visit requirements"
                  />
                </div>
              </div>
            </div>

            <label className="consentField">
              <input
                name="consent"
                type="checkbox"
                checked={formData.consent}
                onChange={handleChange}
              />

              <span>
                I agree that the ONIRIA team may contact me regarding this
                inquiry. *
              </span>
            </label>

            {status.message && (
              <div
                className={`formStatus ${
                  status.type === "success"
                    ? "formStatusSuccess"
                    : "formStatusError"
                }`}
              >
                <p>{status.message}</p>

                {status.reference && (
                  <strong>
                    Reference: {status.reference}
                  </strong>
                )}
              </div>
            )}

            <button type="submit" className="formSubmitButton">
              Submit inquiry
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}