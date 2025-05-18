import CourseCard from "@/app/learn/CourseCard";

const page = () => {
  const courses = [
    {
      name: "cpp",
      title: "Introduction to C++",
      desc: "C++ is a high-level, general-purpose programming language created by Danish computer scientist Bjarne Stroustrup.",
      progress: 50,
      image: "/cpp.png",
    },
    {
      name: "Operating-Systems",
      title: "Fundamentals of Operating Systems",
      desc: "An operating system manages hardware and software, allowing programs to run and users to interact with the computer. It handles tasks like memory, processes, files, and devices.",
      image: "/python.png",
      progress: 70,
    },
    {
      name: "javascript",
      title: "Introduction to JavaScript",
      desc: "JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification.",
      image: "/javascript.png",
      progress: 30,
    },
    {
      name: "java",
      title: "Introduction to Java",
      desc: "Java is a high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.",
      image: "/java.png",
      progress: 90,
    },
    {
      name: "c",
      title: "Introduction to C",
      desc: "C is a general-purpose, procedural computer programming language supporting structured programming, lexical variable scope, and recursion, with a static type system.",
      image: "/c.png",
      progress: 80,
    },
  ];

  return (
    <div className="w-full min-h-[92vh] max-w-6xl mx-auto flex justify-center flex-wrap my-12 gap-6">
      {courses.map((course, index) => (
        <CourseCard
          key={index}
          name={course.name}
          title={course.title}
          desc={course.desc}
          progress={course.progress}
          image={course.image}
        />
      ))}
    </div>
  );
};

export default page;

