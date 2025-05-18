"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { generateColor } from "./utils";
import Meeting from "@/components/interview/Meeting";
import "./Room.css";
import { languagesData } from "@/constants";
import Loader from "@/components/shared/Loader";
import CustomInput from "@/components/shared/CustomInput";
import OutputWindow from "@/components/shared/OutputWindow";
import LanguagesDropdown from "@/components/shared/LanguagesDropdown";
import ThemeDropdown from "@/components/shared/ThemeDropdown";
import FontSizeDropdown from "@/components/shared/FontSizeDropdown";
import Timer from "@/components/shared/Timer";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import CodeEditorWindow from "@/components/shared/CodeEditorWindow";
import axios from "axios";

export default function Room({ socket }) {
  const navigate = useRouter();
  const { roomId } = useParams();
  const [fetchedUsers, setFetchedUsers] = useState(() => []);
  const [fetchedCode, setFetchedCode] = useState(() => "");
  const [language, setLanguage] = useState({ "value": "python3", "label": "Python" });
  const [theme, setTheme] = useState({ value: "dark", label: "Dark" });
  const [fontSize, setFontSize] = useState({ value: "14", label: "14px" });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [isCodeRunning, setIsCodeRunning] = useState(false);

  function onChange(newValue) {
    setFetchedCode(newValue);
    socket.emit("update code", { roomId, code: newValue });
    socket.emit("syncing the code", { roomId: roomId });
  }

  function handleLanguageChange(e) {
    setLanguage(e);
    socket.emit("update language", { roomId, languageUsed: e });
    socket.emit("syncing the language", { roomId: roomId });
  }

  function handleLeave() {
    socket.disconnect();
    if (!socket.connected) navigate.push("/", { replace: true, state: {} });
  }

  function copyToClipboard(text) {
    try {
      navigator.clipboard.writeText(text);
    } catch (exp) {
      console.error(exp);
    }
  }

  useEffect(() => {
    socket.on("updating client list", ({ userslist }) => {
      setFetchedUsers(userslist);
    });

    socket.on("on language change", ({ languageUsed }) => {
      setLanguage(languageUsed);
    });

    socket.on("on code change", ({ code }) => {
      setFetchedCode(code);
    });

    socket.on("new member joined", ({ username }) => {});

    socket.on("member left", ({ username }) => {});

    const backButtonEventListner = window.addEventListener(
      "popstate",
      function (e) {
        const eventStateObj = e.state;
        if (!("usr" in eventStateObj) || !("username" in eventStateObj.usr)) {
          socket.disconnect();
        }
      }
    );

    return () => {
      window.removeEventListener("popstate", backButtonEventListner);
    };
  }, [socket]);

  const handleCompile = async (input) => {
    setIsCodeRunning(true);
  setOutputDetails(null);
 const payload = {
      language: language.value, // e.g., "python3", "javascript"
      version: "*",             // Use "*" for the latest version of the language
      files: [
        {
          // name: "main.py", // Optional: Piston assigns a default if not provided.
                              // You could derive extension from language if needed.
          content: fetchedCode, // Your code string
        },
      ],
      stdin: input, // Standard input for the code
      // args: [], // Optional: command line arguments
      // compile_timeout: 10000, // Optional: in milliseconds
      // run_timeout: 3000, // Optional: in milliseconds
    };
    const options = {
      method: "POST",
      // url: "https://f0dfebd274msh8c7267b0fe45ca7p1bbf00jsna4546a2dd8d9/v1/compile",
      url: "https://emkc.org/api/v2/piston/execute",
      // url: "https://emkc.org/api/v2/piston/runtimes",
      headers: {
        "content-type": "application/json",
      },
      data: payload
    };

    try {
      console.log("Sending API request to Piston: ",options);
      const response = await axios.request(options);
      console.log("Piston API response:", JSON.stringify(response.data, null, 2)); 
      setOutputDetails(response.data);
if (response.data && response.data.run) {
    console.log("Piston STDOUT:", response.data.run.stdout);
    console.log("Piston STDERR:", response.data.run.stderr);
    console.log("Piston COMBINED OUTPUT:", response.data.run.output);
  } else {
        console.error("Unexpected API response structure:", response.data);
        setOutputDetails({ run: { output: "Error: Unexpected API response from Piston." } });
        setIsCodeRunning(false);
        return "Error: Unexpected API response.";
      }

    } catch (error) {
      setIsCodeRunning(false);
      console.error("Axios error during compilation:", error);
      let errorMessage = "An error occurred while running the code.";
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        errorMessage = `API Error ${error.response.status}: ${error.response.data?.message || 'Failed to compile or run code.'}`;
        // Set outputDetails to show the error message from the API if available
        setOutputDetails({
          run: {
            output: errorMessage,
            stderr: error.response.data?.message || (typeof error.response.data === 'string' ? error.response.data : ''),
            stdout: ''
          }
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        errorMessage = "Network Error: No response received from the server.";
        setOutputDetails({ run: { output: errorMessage } });
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        errorMessage = `Request Setup Error: ${error.message}`;
        setOutputDetails({ run: { output: errorMessage } });
      }
      // Depending on how you want to handle errors, you might re-throw or return the message
      return errorMessage; // Or simply let setOutputDetails handle UI update
    }
  };


  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    function exitHandler(e) {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
        return;
      }
      setIsFullScreen(true);
    }

    if (document.addEventListener) {
      document.addEventListener("fullscreenchange", exitHandler);
      document.addEventListener("webkitfullscreenchange", exitHandler);
      document.addEventListener("mozfullscreenchange", exitHandler);
      document.addEventListener("MSFullscreenChange", exitHandler);
    }
  }, [isFullScreen]);

  return (
    <div className="room">
      <div className="w-full flex flex-col">
        <div className="roomSidebarUsersWrapper mb-3">
          <p>Connected Users:</p>
          <div className="roomSidebarUsers">
            {fetchedUsers.map((each, index) => (
              <div key={index} className="roomSidebarUsersEach">
                <div
                  className="roomSidebarUsersEachAvatar"
                  style={{ backgroundColor: `${generateColor(each)}` }}
                >
                  {each.slice(0, 2).toUpperCase()}
                </div>
                <div className="roomSidebarUsersEachName">{each}</div>
              </div>
            ))}
          </div>
        </div>

        <Meeting roomId={roomId} />
        <div className="flex my-2 justify-center items-center gap-4">
          <button
            className="bg-blue-500 text-light-1  hover:bg-blue-600 transition-all px-4 py-2 rounded-lg"
            onClick={() => {
              copyToClipboard(roomId);
            }}
          >
            Copy Invite code
          </button>
          <button
            className="bg-red-500 text-light-1  hover:bg-red-600 transition-all px-4 py-2 rounded-lg"
            onClick={() => {
              handleLeave();
            }}
          >
            Leave
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col">
        <div className="flex gap-2 justify-between flex-wrap">
          <div className="flex flex-wrap gap-2">
            <LanguagesDropdown
              value={language}
              onSelectChange={(e) => handleLanguageChange(e)}
            />
            <ThemeDropdown handleThemeChange={(th) => setTheme(th)} />
            <FontSizeDropdown onSelectChange={(f) => setFontSize(f)} />
          </div>
          <div className="flex gap-2 items-center">
            <Timer />
            <button
              onClick={handleFullScreen}
              className="hover:bg-light-3 hover:border-light-4 rounded-lg p-1"
            >
              <div className="h-6 w-6 font-bold text-2xl text-dark-4">
                {!isFullScreen ? (
                  <AiOutlineFullscreen />
                ) : (
                  <AiOutlineFullscreenExit />
                )}
              </div>
            </button>
          </div>
        </div>

        <div className="!w-full flex-grow flex flex-col items-start pt-4">
          <CodeEditorWindow
            code={fetchedCode}
            onChange={onChange}
            language={language.value}
            theme={theme.value}
            fontSize={fontSize.value}
            forProblemsPage={false}
            isInterview={true}
          />

          <div className="!w-full min-h-[30%] flex flex-col">
            <div className="flex justify-end items-center gap-3">
              <button
                onClick={() => handleCompile(customInput)}
                className={`px-8 py-2 bg-green-500 text-light-1 mt-2 rounded-lg text-sm`}
              >
                {isCodeRunning ? <Loader /> : "Run"}
              </button>
            </div>

            <div className="flex gap-5 flex-grow max-sm:flex-col">
              <div className="!w-full flex flex-col h-[250px]">
                <h1 className="font-bold text-lg">Custom Input</h1>
                <CustomInput
                  customInput={customInput}
                  setCustomInput={setCustomInput}
                />
              </div>
              <OutputWindow outputDetails={outputDetails} additionalStyles={'h-[250px]'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
