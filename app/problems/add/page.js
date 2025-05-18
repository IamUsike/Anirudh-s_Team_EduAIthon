"use client";
import { useState } from "react";

export default function AddProblem() {
  const [problem, setProblem] = useState({
    id: "",
    title: "",
    problemStatement: "",
    inputFormat: "",
    outputFormat: "",
    sampleInput: "",
    sampleOutput: "",
    order: 0,
    category: "",
    constraints: "",
    companies: [],
    starterCode: "",
    difficulty: "Easy",
    totalpoints: 0,
    points: 1,
    solution: "",
    videoId: "",
    testCases: [{ input: [""], output: [""] }],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblem((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...problem.testCases];
    updated[index][field] = value.split("\n"); // Each line as array entry
    setProblem((prev) => ({ ...prev, testCases: updated }));
  };

  const addTestCase = () => {
    setProblem((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: [""], output: [""] }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(problem),
      });

      if (res.ok) {
        alert("Problem added successfully!");
        location.reload();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add problem");
      }
    } catch (err) {
      setError("Error occurred while adding problem");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add Problem</h1>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="grid gap-4">
        {[
          "id",
          "title",
          "problemStatement",
          "inputFormat",
          "outputFormat",
          "sampleInput",
          "sampleOutput",
          "category",
          "constraints",
          "starterCode",
          "solution",
          "videoId",
        ].map((field) => (
          <input
            key={field}
            name={field}
            value={problem[field]}
            onChange={handleChange}
            placeholder={field}
            className="border p-2"
            required={["id", "title", "problemStatement"].includes(field)}
          />
        ))}

        <input
          name="order"
          type="number"
          value={problem.order}
          onChange={handleChange}
          placeholder="Order"
          className="border p-2"
        />

        <input
          name="companies"
          value={problem.companies.join(",")}
          onChange={(e) =>
            setProblem({ ...problem, companies: e.target.value.split(",") })
          }
          placeholder="Companies (comma-separated)"
          className="border p-2"
        />

        <select
          name="difficulty"
          value={problem.difficulty}
          onChange={handleChange}
          className="border p-2"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          name="points"
          value={problem.points}
          onChange={(e) =>
            setProblem({ ...problem, points: parseInt(e.target.value) })
          }
          className="border p-2"
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>

         {/* not required */}
        {/* <input */}
        {/*   name="totalpoints" */}
        {/*   type="number" */}
        {/*   value={problem.totalpoints} */}
        {/*   onChange={handleChange} */}
        {/*   placeholder="Total Points" */}
        {/*   className="border p-2" */}
        {/* /> */}

        <div className="bg-gray-100 p-2">
          <h2 className="font-semibold mb-2">Test Cases</h2>
          {problem.testCases.map((tc, i) => (
            <div key={i} className="mb-2">
              <textarea
                placeholder="Input (newline-separated)"
                value={tc.input.join("\n")}
                onChange={(e) =>
                  handleTestCaseChange(i, "input", e.target.value)
                }
                className="border p-2 w-full mb-1"
              />
              <textarea
                placeholder="Output (newline-separated)"
                value={tc.output.join("\n")}
                onChange={(e) =>
                  handleTestCaseChange(i, "output", e.target.value)
                }
                className="border p-2 w-full"
              />
            </div>
          ))}
          <button
            type="button"
            className="text-sm text-blue-600 mt-1"
            onClick={addTestCase}
          >
            + Add Test Case
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Problem"}
        </button>
      </form>
    </div>
  );
}

