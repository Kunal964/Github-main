import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import "./createRepo.css";

const CreateRepo = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true); // true = public
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Repository name is required.");
      return;
    }

    const owner = localStorage.getItem("userId");
    if (!owner) {
      setError("You must be logged in to create a repository.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:3000/repo/create", {
        name: name.trim(),
        description: description.trim(),
        visibility,
        owner,
        content: [],
        issues: [],
      });
      navigate("/");
    } catch (err) {
      console.error("Error creating repository:", err);
      setError(
        err?.response?.data?.error || "Failed to create repository. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-repo-page">
        <div className="create-repo-container">
          <div className="create-repo-header">
            <h1>Create a new repository</h1>
            <p>
              A repository contains all project files, including the revision
              history.
            </p>
          </div>

          <hr className="divider" />

          <form onSubmit={handleCreate} className="create-repo-form">
            {/* Repository Name */}
            <div className="form-group">
              <label htmlFor="repo-name" className="form-label">
                Repository name <span className="required">*</span>
              </label>
              <input
                id="repo-name"
                className="form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="my-awesome-project"
                autoComplete="off"
              />
              <span className="form-hint">
                Great repository names are short and memorable.
              </span>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="repo-description" className="form-label">
                Description <span className="optional">(optional)</span>
              </label>
              <input
                id="repo-description"
                className="form-input"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of your repository..."
                autoComplete="off"
              />
            </div>

            <hr className="divider" />

            {/* Visibility */}
            <div className="form-group">
              <p className="form-label">Visibility</p>
              <div
                className={`visibility-option ${visibility ? "selected" : ""}`}
                onClick={() => setVisibility(true)}
              >
                <div className="visibility-icon">🌍</div>
                <div className="visibility-text">
                  <strong>Public</strong>
                  <span>Anyone on the internet can see this repository.</span>
                </div>
                <div className="visibility-radio">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === true}
                    onChange={() => setVisibility(true)}
                  />
                </div>
              </div>

              <div
                className={`visibility-option ${!visibility ? "selected" : ""}`}
                onClick={() => setVisibility(false)}
              >
                <div className="visibility-icon">🔒</div>
                <div className="visibility-text">
                  <strong>Private</strong>
                  <span>
                    You choose who can see and commit to this repository.
                  </span>
                </div>
                <div className="visibility-radio">
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === false}
                    onChange={() => setVisibility(false)}
                  />
                </div>
              </div>
            </div>

            <hr className="divider" />

            {/* Error */}
            {error && <div className="form-error">{error}</div>}

            {/* Submit */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn-create"
                disabled={loading || !name.trim()}
              >
                {loading ? "Creating..." : "Create repository"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRepo;
