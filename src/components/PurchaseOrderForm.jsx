import React, { useState } from "react";
import "../styles/PurchaseOrderForm.css";
const PurchaseOrderDetails = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    orderType: "",
    orderNo: "",
    receivedOn: "",
    receivedFrom: { name: "", email: "" },
    poStartDate: "",
    poEndDate: "",
    budget: "",
    currency: "",
    talentDetails: [
      {
        jobTitle: "",
        reqId: "",
        talents: [],
      },
    ],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reqsByClient = {
    "Collbera INC": [
      { reqId: "REQ001", jobTitle: "Application - Development", talents: ["Monika Goyal", "Shalili Khatri"] },
      { reqId: "REQ002", jobTitle: "IOS Developer", talents: ["Chitnu", "SR Singh"] },
    ],
    "HCL": [
      { reqId: "REQ003", jobTitle: "Web Developer", talents: ["Bablu", "Snehil Chorasiya"] },
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("receivedFrom")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        receivedFrom: { ...formData.receivedFrom, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleJobTitleChange = (reqIndex, value) => {
    const selectedREQ = reqsByClient[formData.clientName]?.find(
      (req) => req.jobTitle === value
    );

    const updatedTalentDetails = [...formData.talentDetails];
    updatedTalentDetails[reqIndex] = {
      ...updatedTalentDetails[reqIndex],
      jobTitle: value,
      reqId: selectedREQ?.reqId || "",
      talents: selectedREQ?.talents.map((name) => ({
        name,
        isSelected: false,
        details: "",
      })) || [],
    };
    setFormData({ ...formData, talentDetails: updatedTalentDetails });
  };

  const handleTalentChange = (reqIndex, talentIndex, field, value) => {
    const updatedTalentDetails = [...formData.talentDetails];
    updatedTalentDetails[reqIndex].talents[talentIndex][field] = value;
    setFormData({ ...formData, talentDetails: updatedTalentDetails });
  };

  const addNewREQ = () => {
    setFormData({
      ...formData,
      talentDetails: [
        ...formData.talentDetails,
        {
          jobTitle: "",
          reqId: "",
          talents: [],
        },
      ],
    });
  };

  const resetForm = () => {
    setFormData({
      clientName: "",
      orderType: "",
      orderNo: "",
      receivedOn: "",
      receivedFrom: { name: "", email: "" },
      poStartDate: "",
      poEndDate: "",
      budget: "",
      currency: "",
      talentDetails: [
        {
          jobTitle: "",
          reqId: "",
          talents: [],
        },
      ],
    });
    setErrors({});
    setIsSubmitted(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName) newErrors.clientName = "Client Name is required.";
    if (!formData.orderType) newErrors.orderType = "Order Type is required.";
    if (!formData.orderNo) newErrors.orderNo = "Order Number is required.";
    if (!formData.receivedOn) newErrors.receivedOn = "Received On is required.";
    if (!formData.receivedFrom.name)
      newErrors.receivedFromName = "Received From Name is required.";
    if (!formData.receivedFrom.email)
      newErrors.receivedFromEmail = "Received From Email is required.";
    if (!formData.poStartDate)
      newErrors.poStartDate = "PO Start Date is required.";
    if (!formData.poEndDate)
      newErrors.poEndDate = "PO End Date is required.";
    if (formData.poEndDate < formData.poStartDate) {
      newErrors.poEndDate = "PO End Date cannot be earlier than Start Date.";
    }
    if (!formData.budget) newErrors.budget = "Budget is required.";
    if (!formData.currency) newErrors.currency = "Currency is required.";

    formData.talentDetails.forEach((req, reqIndex) => {
      if (!req.jobTitle) {
        newErrors[`talentDetails_${reqIndex}`] = "Job Title is required.";
      }
      const selectedTalents = req.talents.filter((talent) => talent.isSelected);
      if (formData.orderType === "Individual PO" && selectedTalents.length !== 1) {
        newErrors.talentDetails = "Select exactly one talent for Individual PO.";
      }
      if (formData.orderType === "Group PO" && selectedTalents.length < 2) {
        newErrors.talentDetails =
          "Select at least two talents for Group PO.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
    } else {
      alert("Please fix the errors in the form.");
    }
  };

  if (isSubmitted) {
    return (
      <div>
        <h2>Form Submitted</h2>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
        <button onClick={resetForm}>Reset Form</button>
      </div>
    );
  }

  return (
    <form className="purchase-order-details" onSubmit={handleSubmit}>
      <h2>Purchase Order Details</h2>
      <div className="form-row">
        <div className="form-group">
          <label>Client Name:</label>
          <select name="clientName" value={formData.clientName} onChange={handleChange}>
            <option value="">Select Client</option>
            {Object.keys(reqsByClient).map((client) => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
          </select>
          {errors.clientName && <span className="error">{errors.clientName}</span>}
        </div>
        <div className="form-group">
          <label>Purchase Order Type:</label>
          <select name="orderType" value={formData.orderType} onChange={handleChange}>
            <option value="">Select Type</option>
            <option value="Group PO">Group PO</option>
            <option value="Individual PO">Individual PO</option>
          </select>
          {errors.orderType && <span className="error">{errors.orderType}</span>}
        </div>
        <div className="form-group">
          <label>Order No.:</label>
          <input
            type="text"
            name="orderNo"
            value={formData.orderNo}
            onChange={handleChange}
            placeholder="Enter Order Number"
          />
          {errors.orderNo && <span className="error">{errors.orderNo}</span>}
        </div>
        <div className="form-group">
          <label>Received On:</label>
          <input
            type="date"
            name="receivedOn"
            value={formData.receivedOn}
            onChange={handleChange}
          />
          {errors.receivedOn && <span className="error">{errors.receivedOn}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Received From (Name):</label>
          <input
            type="text"
            name="receivedFrom.name"
            value={formData.receivedFrom.name}
            onChange={handleChange}
            placeholder="Enter Name"
          />
          {errors.receivedFromName && <span className="error">{errors.receivedFromName}</span>}
        </div>
        <div className="form-group">
          <label>Received From (Email):</label>
          <input
            type="email"
            name="receivedFrom.email"
            value={formData.receivedFrom.email}
            onChange={handleChange}
            placeholder="Enter Email"
          />
          {errors.receivedFromEmail && <span className="error">{errors.receivedFromEmail}</span>}
        </div>
        <div className="form-group">
          <label>PO Start Date:</label>
          <input
            type="date"
            name="poStartDate"
            value={formData.poStartDate}
            onChange={handleChange}
          />
          {errors.poStartDate && <span className="error">{errors.poStartDate}</span>}
        </div>
        <div className="form-group">
          <label>PO End Date:</label>
          <input
            type="date"
            name="poEndDate"
            value={formData.poEndDate}
            onChange={handleChange}
          />
          {errors.poEndDate && <span className="error">{errors.poEndDate}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Budget:</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Enter Budget"
            max="99999"
          />
          {errors.budget && <span className="error">{errors.budget}</span>}
        </div>
        <div className="form-group">
          <label>Currency:</label>
          <select name="currency" value={formData.currency} onChange={handleChange}>
            <option value="">Select Currency</option>
            <option value="USD">USD</option>
            <option value="INR">INR</option>
          </select>
          {errors.currency && <span className="error">{errors.currency}</span>}
        </div>
      </div>
<div className="talent-details-row">
  <h3>Talent Details</h3>
  {formData.orderType === "Group PO" && (
    <button type="button" className="add-another-btn" onClick={addNewREQ}>
      Add Another
    </button>
  )}
</div>
{formData.talentDetails.map((req, reqIndex) => (
  <div className="talent-section" key={reqIndex}>
    <div className="form-group">
      <label>Job Title/REQ Name:</label>
      <select
        value={req.jobTitle}
        onChange={(e) => handleJobTitleChange(reqIndex, e.target.value)}
      >
        <option value="">Select Job</option>
        {reqsByClient[formData.clientName]?.map((req) => (
          <option key={req.reqId} value={req.jobTitle}>
            {req.jobTitle}
          </option>
        ))}
      </select>
      {errors[`talentDetails_${reqIndex}`] && (
        <span className="error">{errors[`talentDetails_${reqIndex}`]}</span>
      )}
    </div>
    <div className="form-group">
      <label>REQ ID:</label>
      <input type="text" value={req.reqId} readOnly />
    </div>

    {req.talents.map((talent, talentIndex) => (
      <div key={talentIndex} className="talent-row">
        <label>
          <input
            type="checkbox"
            checked={talent.isSelected}
            onChange={(e) =>
              handleTalentChange(reqIndex, talentIndex, "isSelected", e.target.checked)
            }
          />
          {talent.name}
        </label>
{talent.isSelected && (
  <div className="talent-details-fields">
    <div className="form-group">
      <label>Contract Duration:</label>
      <input
        type="text"
        value={talent.contractDuration || ""}
        onChange={(e) =>
          handleTalentChange(reqIndex, talentIndex, "contractDuration", e.target.value)
        }
        placeholder="Enter Contract Duration"
      />
    </div>
    <div className="form-group">
      <label>Bill Rate:</label>
      <input
        type="number"
        value={talent.billRate || ""}
        onChange={(e) =>
          handleTalentChange(reqIndex, talentIndex, "billRate", e.target.value)
        }
        placeholder="Enter Bill Rate"
      />
    </div>
    <div className="form-group">
      <label>Currency:</label>
      <select
        value={talent.billRateCurrency || ""}
        onChange={(e) =>
          handleTalentChange(reqIndex, talentIndex, "billRateCurrency", e.target.value)
        }
      >
        <option value="">Select Currency</option>
        <option value="USD">USD</option>
        <option value="INR">INR</option>
      </select>
    </div>
    <div className="form-group">
      <label>Standard Time BR:</label>
      <input
        type="number"
        value={talent.standardTimeBR || ""}
        onChange={(e) =>
          handleTalentChange(reqIndex, talentIndex, "standardTimeBR", e.target.value)
        }
        placeholder="Enter Standard Time BR"
      />
    </div>
    <div className="form-group">
      <label>Currency:</label>
      <select
        value={talent.standardTimeCurrency || ""}
        onChange={(e) =>
          handleTalentChange(reqIndex, talentIndex, "standardTimeCurrency", e.target.value)
        }
      >
        <option value="">Select Currency</option>
        <option value="USD">USD</option>
        <option value="INR">INR</option>
      </select>
    </div>
    <div className="form-group">
      <label>Over Time BR:</label>
      <input
        type="number"
        value={talent.overTimeBR || ""}
        onChange={(e) =>
          handleTalentChange(reqIndex, talentIndex, "overTimeBR", e.target.value)
        }
        placeholder="Enter Over Time BR"
      />
    </div>
    <div className="form-group">
      <label>Currency:</label>
      <select
        value={talent.overTimeCurrency || ""}
        onChange={(e) =>
          handleTalentChange(reqIndex, talentIndex, "overTimeCurrency", e.target.value)
        }
      >
        <option value="">Select Currency</option>
        <option value="USD">USD</option>
        <option value="INR">INR</option>
      </select>
    </div>
  </div>
)}

      </div>
    ))}
  </div>
))}
      <div className="form-buttons">
        <button type="submit">Submit</button>
        <button type="button" onClick={resetForm}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default PurchaseOrderDetails;

