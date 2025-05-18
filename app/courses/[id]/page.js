"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Split from "react-split";
import Quiz from "@/components/courses/quiz";
import { Loader2, BookOpen, CheckCircle2 } from "lucide-react";

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id;
  console.log("course id is", courseId);

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [moduleData, setModuleData] = useState([]);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [content, setContent] = useState("");
  const [lessonProgress, setLessonProgress] = useState({});
  const [error, setError] = useState("");

  async function fetchCourseData() {
    try {
      const res = await fetch(`/api/courses`);
      if (!res.ok) throw new Error("Failed to fetch courses");

      const data = await res.json();
      console.log("res from api courses", res);

      return data;
    } catch (err) {
      setError("Error loading course data. Please try again later.");
      console.error(err);
      return [];
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchCourseData().then((data) => {
      const foundCourse = data.find((course) => course.title === courseId);

      if (foundCourse) {
        setCourse(foundCourse);
        setModuleData(foundCourse.modules);

        if (
          foundCourse.modules.length > 0 &&
          foundCourse.modules[0].lessons.length > 0
        ) {
          setContent(foundCourse.modules[0].lessons[0].content);
        }
      } else {
        setError("Course not found");
      }

      setLoading(false);
    });
  }, [courseId]);

  const handleModuleSelect = (moduleIndex) => {
    setActiveModule(moduleIndex);

    if (moduleData[moduleIndex]?.lessons.length > 0) {
      setActiveLesson(0);
      setContent(moduleData[moduleIndex].lessons[0].content);
      setShowQuiz(false);
    }
  };

  const handleLessonSelect = (lessonIndex) => {
    setActiveLesson(lessonIndex);
    setContent(moduleData[activeModule].lessons[lessonIndex].content);
    setShowQuiz(false);

    // Mark lesson as viewed
    setLessonProgress((prev) => ({
      ...prev,
      [`${activeModule}-${lessonIndex}`]: {
        ...prev[`${activeModule}-${lessonIndex}`],
        viewed: true,
      },
    }));
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = (results) => {
    // Update lesson progress with quiz results
    setLessonProgress((prev) => ({
      ...prev,
      [`${activeModule}-${activeLesson}`]: {
        ...prev[`${activeModule}-${activeLesson}`],
        quizCompleted: true,
        quizPassed: results.passed,
        quizScore: results.score,
      },
    }));
  };

  const isLessonComplete = (moduleIndex, lessonIndex) => {
    const progress = lessonProgress[`${moduleIndex}-${lessonIndex}`];
    if (!progress) return false;

    const lesson = moduleData[moduleIndex]?.lessons[lessonIndex];
    if (!lesson) return false;

    if (lesson.completionCriteria === "view") {
      return progress.viewed;
    } else if (lesson.completionCriteria === "quiz-pass") {
      return progress.quizPassed;
    } else {
      return progress.viewed && progress.quizPassed;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[92vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[92vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-[92vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600">
            The course you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const currentLesson = moduleData[activeModule]?.lessons[activeLesson];
  const hasQuestions =
    currentLesson?.questions && currentLesson.questions.length > 0;

  return (
    <div className="w-full h-[92vh] flex max-md:flex-col">
      <Split
        className="flex h-full"
        sizes={[25, 75]}
        minSize={[200, 400]}
        gutterSize={8}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
      >
        <div className="h-full overflow-auto bg-gray-50 border-r">
          <div className="p-4">
            <h1 className="text-xl font-bold mb-4 text-gray-800">
              {course.title}
            </h1>

            <div className="space-y-4">
              {moduleData.map((module, moduleIndex) => (
                <div
                  key={moduleIndex}
                  className="border rounded-lg overflow-hidden bg-white shadow-sm"
                >
                  <button
                    className={`w-full text-left p-3 font-medium flex justify-between items-center ${
                      activeModule === moduleIndex
                        ? "bg-blue-50 text-blue-700"
                        : "bg-white text-gray-700"
                    }`}
                    onClick={() => handleModuleSelect(moduleIndex)}
                  >
                    <span>
                      Module {module.id}: {module.title}
                    </span>
                  </button>

                  {activeModule === moduleIndex && (
                    <div className="p-2 border-t">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <button
                          key={lessonIndex}
                          className={`w-full text-left p-2 text-sm rounded flex items-center ${
                            activeLesson === lessonIndex &&
                            activeModule === moduleIndex
                              ? "bg-blue-100 text-blue-800"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                          onClick={() => handleLessonSelect(lessonIndex)}
                        >
                          {isLessonComplete(moduleIndex, lessonIndex) ? (
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                          ) : (
                            <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                          )}
                          <span>{lesson.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-full overflow-auto bg-white p-4">
          {showQuiz ? (
            <Quiz
              questions={currentLesson.questions}
              onComplete={handleQuizComplete}
              passingScore={currentLesson.passingScore}
            />
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-1 text-gray-800">
                  {currentLesson?.title}
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <span>
                    Module {moduleData[activeModule]?.id}:{" "}
                    {moduleData[activeModule]?.title}
                  </span>
                </div>
              </div>

              <div className="prose max-w-none mb-8">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>

              {hasQuestions && (
                <div className="mt-8 border-t pt-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Test Your Knowledge</h3>
                    <button
                      onClick={handleStartQuiz}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Start Quiz
                    </button>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Complete the quiz to test your understanding of this lesson.
                    {currentLesson.completionCriteria === "quiz-pass" ||
                    currentLesson.completionCriteria === "both" ? (
                      <span>
                        {" "}
                        You need to score at least {currentLesson.passingScore}%
                        to complete this lesson.
                      </span>
                    ) : null}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Split>
    </div>
  );
}
