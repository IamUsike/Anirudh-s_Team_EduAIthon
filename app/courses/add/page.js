"use client";
import { useState } from "react";
import { PlusCircle, Trash2, ChevronDown, ChevronUp, Save } from "lucide-react";

export default function AddCourse() {
  const [isExpanded, setIsExpanded] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("beginner");
  const [modules, setModules] = useState([
    {
      id: 1,
      title: "",
      description: "",
      lessons: [
        {
          title: "",
          content: "",
          questions: [],
          completionCriteria: "both",
          passingScore: 70,
        },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleExpand = (
    type,
    moduleIndex,
    lessonIndex = null,
    questionIndex = null,
  ) => {
    const key = `${type}-${moduleIndex}${lessonIndex !== null ? `-${lessonIndex}` : ""}${questionIndex !== null ? `-${questionIndex}` : ""}`;
    setIsExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAddModule = () => {
    setModules([
      ...modules,
      {
        id: modules.length + 1,
        title: "",
        description: "",
        lessons: [
          {
            title: "",
            content: "",
            questions: [],
            completionCriteria: "both",
            passingScore: 70,
          },
        ],
      },
    ]);
  };

  const handleRemoveModule = (moduleIndex) => {
    const newModules = [...modules];
    newModules.splice(moduleIndex, 1);
    // Update IDs
    newModules.forEach((mod, idx) => {
      mod.id = idx + 1;
    });
    setModules(newModules);
  };

  const handleAddLesson = (moduleIndex) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons.push({
      title: "",
      content: "",
      questions: [],
      completionCriteria: "both",
      passingScore: 70,
    });
    setModules(newModules);
  };

  const handleRemoveLesson = (moduleIndex, lessonIndex) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons.splice(lessonIndex, 1);
    setModules(newModules);
  };

  const handleAddQuestion = (moduleIndex, lessonIndex) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons[lessonIndex].questions.push({
      text: "",
      type: "multiple-choice",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
      correctAnswer: "",
      points: 10,
      explanation: "",
      difficulty: "beginner",
    });
    setModules(newModules);
  };

  const handleRemoveQuestion = (moduleIndex, lessonIndex, questionIndex) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons[lessonIndex].questions.splice(
      questionIndex,
      1,
    );
    setModules(newModules);
  };

  const handleOptionChange = (
    moduleIndex,
    lessonIndex,
    questionIndex,
    optionIndex,
    value,
  ) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons[lessonIndex].questions[
      questionIndex
    ].options[optionIndex].text = value;
    setModules(newModules);
  };

  const handleCorrectOptionChange = (
    moduleIndex,
    lessonIndex,
    questionIndex,
    optionIndex,
  ) => {
    const newModules = [...modules];
    // Reset all options to false
    newModules[moduleIndex].lessons[lessonIndex].questions[
      questionIndex
    ].options.forEach((opt, idx) => {
      opt.isCorrect = idx === optionIndex;
    });
    setModules(newModules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          difficulty,
          modules,
        }),
      });

      console.log("courses before the error", res);

      if (res.ok) {
        setSuccess("Course created successfully!");
        // Reset form after successful submission
        setTitle("");
        setDescription("");
        setDifficulty("beginner");
        setModules([
          {
            id: 1,
            title: "",
            description: "",
            lessons: [
              {
                title: "",
                content: "",
                questions: [],
                completionCriteria: "both",
                passingScore: 70,
              },
            ],
          },
        ]);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to create course");
      }
    } catch (err) {
      setError("An error occurred while creating the course");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Create New Course
      </h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Course Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Title
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter course description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {modules.map((mod, modIdx) => (
            <div
              key={modIdx}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div
                className="bg-gray-100 p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand("module", modIdx)}
              >
                <h3 className="text-lg font-medium">
                  Module {mod.id}: {mod.title || "Untitled Module"}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveModule(modIdx);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                  {isExpanded[`module-${modIdx}`] ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>
              </div>

              {isExpanded[`module-${modIdx}`] && (
                <div className="p-4 bg-white">
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Module Title
                      </label>
                      <input
                        placeholder="Module Title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={mod.title}
                        onChange={(e) => {
                          const m = [...modules];
                          m[modIdx].title = e.target.value;
                          setModules(m);
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Module Description
                      </label>
                      <textarea
                        placeholder="Module Description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={mod.description}
                        onChange={(e) => {
                          const m = [...modules];
                          m[modIdx].description = e.target.value;
                          setModules(m);
                        }}
                        required
                        rows="2"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <h4 className="text-md font-medium text-gray-700">
                      Lessons
                    </h4>

                    {mod.lessons.map((lesson, lessonIdx) => (
                      <div
                        key={lessonIdx}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div
                          className="bg-gray-50 p-3 flex justify-between items-center cursor-pointer"
                          onClick={() =>
                            toggleExpand("lesson", modIdx, lessonIdx)
                          }
                        >
                          <h5 className="font-medium">
                            Lesson {lessonIdx + 1}:{" "}
                            {lesson.title || "Untitled Lesson"}
                          </h5>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveLesson(modIdx, lessonIdx);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                            {isExpanded[`lesson-${modIdx}-${lessonIdx}`] ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </div>
                        </div>

                        {isExpanded[`lesson-${modIdx}-${lessonIdx}`] && (
                          <div className="p-4 bg-white">
                            <div className="grid grid-cols-1 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Lesson Title
                                </label>
                                <input
                                  placeholder="Lesson Title"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={lesson.title}
                                  onChange={(e) => {
                                    const m = [...modules];
                                    m[modIdx].lessons[lessonIdx].title =
                                      e.target.value;
                                    setModules(m);
                                  }}
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Lesson Content
                                </label>
                                <textarea
                                  placeholder="Lesson Content (Markdown supported)"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={lesson.content}
                                  onChange={(e) => {
                                    const m = [...modules];
                                    m[modIdx].lessons[lessonIdx].content =
                                      e.target.value;
                                    setModules(m);
                                  }}
                                  required
                                  rows="6"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Completion Criteria
                                  </label>
                                  <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={lesson.completionCriteria}
                                    onChange={(e) => {
                                      const m = [...modules];
                                      m[modIdx].lessons[
                                        lessonIdx
                                      ].completionCriteria = e.target.value;
                                      setModules(m);
                                    }}
                                  >
                                    <option value="view">View Content</option>
                                    <option value="quiz-pass">Pass Quiz</option>
                                    <option value="both">Both</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Passing Score (%)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={lesson.passingScore}
                                    onChange={(e) => {
                                      const m = [...modules];
                                      m[modIdx].lessons[
                                        lessonIdx
                                      ].passingScore = Number.parseInt(
                                        e.target.value,
                                      );
                                      setModules(m);
                                    }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Questions Section */}
                            <div className="mt-6">
                              <div className="flex justify-between items-center mb-3">
                                <h5 className="text-md font-medium text-gray-700">
                                  Questions
                                </h5>
                                <button
                                  type="button"
                                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                                  onClick={() =>
                                    handleAddQuestion(modIdx, lessonIdx)
                                  }
                                >
                                  <PlusCircle size={16} className="mr-1" /> Add
                                  Question
                                </button>
                              </div>

                              {lesson.questions.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">
                                  No questions added yet.
                                </p>
                              ) : (
                                <div className="space-y-3">
                                  {lesson.questions.map((question, qIdx) => (
                                    <div
                                      key={qIdx}
                                      className="border border-gray-200 rounded-lg overflow-hidden"
                                    >
                                      <div
                                        className="bg-gray-50 p-3 flex justify-between items-center cursor-pointer"
                                        onClick={() =>
                                          toggleExpand(
                                            "question",
                                            modIdx,
                                            lessonIdx,
                                            qIdx,
                                          )
                                        }
                                      >
                                        <h6 className="font-medium text-sm">
                                          Question {qIdx + 1}:{" "}
                                          {question.text.substring(0, 40)}
                                          {question.text.length > 40
                                            ? "..."
                                            : ""}
                                        </h6>
                                        <div className="flex items-center space-x-2">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleRemoveQuestion(
                                                modIdx,
                                                lessonIdx,
                                                qIdx,
                                              );
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                          {isExpanded[
                                            `question-${modIdx}-${lessonIdx}-${qIdx}`
                                          ] ? (
                                            <ChevronUp size={16} />
                                          ) : (
                                            <ChevronDown size={16} />
                                          )}
                                        </div>
                                      </div>

                                      {isExpanded[
                                        `question-${modIdx}-${lessonIdx}-${qIdx}`
                                      ] && (
                                        <div className="p-4 bg-white">
                                          <div className="grid grid-cols-1 gap-4">
                                            <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Question Text
                                              </label>
                                              <textarea
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Enter your question"
                                                value={question.text}
                                                onChange={(e) => {
                                                  const m = [...modules];
                                                  m[modIdx].lessons[
                                                    lessonIdx
                                                  ].questions[qIdx].text =
                                                    e.target.value;
                                                  setModules(m);
                                                }}
                                                rows="2"
                                              />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                  Question Type
                                                </label>
                                                <select
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  value={question.type}
                                                  onChange={(e) => {
                                                    const m = [...modules];
                                                    m[modIdx].lessons[
                                                      lessonIdx
                                                    ].questions[qIdx].type =
                                                      e.target.value;
                                                    setModules(m);
                                                  }}
                                                >
                                                  <option value="multiple-choice">
                                                    Multiple Choice
                                                  </option>
                                                  <option value="true-false">
                                                    True/False
                                                  </option>
                                                  <option value="coding">
                                                    Coding
                                                  </option>
                                                  <option value="short-answer">
                                                    Short Answer
                                                  </option>
                                                </select>
                                              </div>

                                              <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                  Points
                                                </label>

                                                <input
                                                  type="number"
                                                  min="1"
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  value={question.points ?? ""} // fallback to empty string if undefined/null
                                                  onChange={(e) => {
                                                    const value =
                                                      e.target.value;
                                                    const m = [...modules];

                                                    // Set value to number if not empty, otherwise undefined (optional)
                                                    m[modIdx].lessons[
                                                      lessonIdx
                                                    ].questions[qIdx].points =
                                                      value === ""
                                                        ? undefined
                                                        : Number(value);

                                                    setModules(m);
                                                  }}
                                                />
                                              </div>
                                            </div>

                                            {question.type ===
                                              "multiple-choice" && (
                                              <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                  Answer Options
                                                </label>
                                                <div className="space-y-2">
                                                  {question.options.map(
                                                    (option, optIdx) => (
                                                      <div
                                                        key={optIdx}
                                                        className="flex items-center space-x-2"
                                                      >
                                                        <input
                                                          type="radio"
                                                          checked={
                                                            option.isCorrect
                                                          }
                                                          onChange={() =>
                                                            handleCorrectOptionChange(
                                                              modIdx,
                                                              lessonIdx,
                                                              qIdx,
                                                              optIdx,
                                                            )
                                                          }
                                                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        <input
                                                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                          placeholder={`Option ${optIdx + 1}`}
                                                          value={option.text}
                                                          onChange={(e) =>
                                                            handleOptionChange(
                                                              modIdx,
                                                              lessonIdx,
                                                              qIdx,
                                                              optIdx,
                                                              e.target.value,
                                                            )
                                                          }
                                                        />
                                                      </div>
                                                    ),
                                                  )}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                  Select the radio button next
                                                  to the correct answer.
                                                </p>
                                              </div>
                                            )}

                                            {question.type !==
                                              "multiple-choice" && (
                                              <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                  Correct Answer
                                                </label>
                                                <input
                                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  placeholder="Enter the correct answer"
                                                  value={question.correctAnswer}
                                                  onChange={(e) => {
                                                    const m = [...modules];
                                                    m[modIdx].lessons[
                                                      lessonIdx
                                                    ].questions[
                                                      qIdx
                                                    ].correctAnswer =
                                                      e.target.value;
                                                    setModules(m);
                                                  }}
                                                />
                                              </div>
                                            )}

                                            <div>
                                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Explanation (Optional)
                                              </label>
                                              <textarea
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Explain why this answer is correct"
                                                value={question.explanation}
                                                onChange={(e) => {
                                                  const m = [...modules];
                                                  m[modIdx].lessons[
                                                    lessonIdx
                                                  ].questions[
                                                    qIdx
                                                  ].explanation =
                                                    e.target.value;
                                                  setModules(m);
                                                }}
                                                rows="2"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => handleAddLesson(modIdx)}
                    >
                      <PlusCircle size={16} className="mr-1" /> Add Lesson
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleAddModule}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle size={16} className="mr-2" /> Add Module
          </button>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" /> Save Course
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
