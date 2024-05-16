import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Panel from "./components/Panel";
import Footer from "./components/Footer";

export default function Report() {
  const [reportType, setReportType] = useState("");
  const [description, setDescription] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    /*event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${router.basePath}/api/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reportType,
          description,
          identifier,
        }),
      });
      const data = await response.json();
      setMessage(data.message);
      alert(data.message);
      setReportType("");
      setDescription("");
      setIdentifier("");
    } catch (error) {
      console.error("Failed to submit report:", error);
      alert("Failed to submit report");
      setSubmitting(false);
    }*/
    alert("Report submitted");
  };

  return (
    <>
      <Panel title="Report an Issue">
        <br />
        <form onSubmit={handleSubmit}>
          <label>
            Report Type:
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="">Select a Type</option>
              <option value="inappropiate">Inappropiate Content</option>
              <option value="plagiarism">Plagiarism</option>
              <option value="copyright">Copyright</option>
              <option value="duplicate">Duplicate</option>
              <option value="scam">Scam</option>
              <option value="other">Other</option>
            </select>
          </label>
          <br />
          <br />
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <br />
          <br />
          <button type="submit" disabled={submitting} className="button">
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </form>
        <br />
      </Panel>
      <Footer></Footer>
    </>
  );
}
