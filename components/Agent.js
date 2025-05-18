"use client";

import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Using constants instead of enum
const CallStatus = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

/**
 * Interview Agent Component
 * @param {Object} props
 * @param {string} props.userName - Name of the user
 * @param {string} props.userId - ID of the user
 * @param {string} [props.interviewId] - ID of the interview
 * @param {string} [props.feedbackId] - ID of the feedback
 * @param {'generate'|'feedback'} props.type - Type of interview
 * @param {string[]} [props.questions] - Array of questions
 */
const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error) => {
      console.log("Error:", error);
    };

    // Assuming vapi is available globally
    const vapi = window.vapi;

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages) => {
      console.log("handleGenerateFeedback");

      try {
        const response = await axios.post("/api/createFeedback", {
          interviewId: interviewId,
          userId: userId,
          transcript: messages,
          feedbackId,
        });

        if (response.data.success && response.data.feedbackId) {
          router.push(`/interview/${interviewId}/feedback`);
        } else {
          console.log("Error saving feedback");
          router.push("/");
        }
      } catch (error) {
        console.error("Error creating feedback:", error);
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    // Assuming vapi is available globally
    const vapi = window.vapi;

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions && questions.length) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(process.env.NEXT_PUBLIC_INTERVIEWER_ID, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    // Assuming vapi is available globally
    const vapi = window.vapi;
    vapi.stop();
  };

  return (
    <>
      <div className="w-full max-w-6xl flex flex-col gap-10 px-2 mx-auto pt-5 pb-10">
        {/* AI Interviewer and User Profile Cards */}
        <div className="flex justify-between items-center gap-8 flex-wrap">
          {/* AI Interviewer Card */}
          <div className="flex flex-col items-center p-6 bg-blue-500 rounded-3xl shadow-xl text-white">
            <div className="relative mb-3">
              <Image
                src="/ai-avatar.png"
                alt="AI Interviewer"
                width={65}
                height={65}
                className="rounded-full object-cover"
              />
              {isSpeaking && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
              )}
            </div>
            <h3 className="text-lg font-medium">AI Interviewer</h3>
          </div>

          {/* User Profile Card */}
          <div className="flex flex-col items-center p-6 bg-gray-100 rounded-3xl shadow-xl border-2 border-gray-200">
            <div className="mb-3">
              <Image
                src="/user-avatar.png"
                alt="User"
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
            </div>
            <h3 className="text-lg font-medium">{userName}</h3>
          </div>
        </div>

        {/* Transcript Display */}
        {messages.length > 0 && (
          <div className="w-full border-2 border-gray-200 rounded-2xl p-1">
            <div className="bg-gray-50 p-5 rounded-xl w-full">
              <p className="transition-opacity duration-500 animate-fadeIn opacity-100">
                {lastMessage}
              </p>
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="w-full flex justify-center">
          {callStatus !== CallStatus.ACTIVE ? (
            <button
              className={`relative px-8 py-3 rounded-full text-white font-medium transition-all ${
                callStatus === CallStatus.CONNECTING
                  ? "bg-yellow-500"
                  : "bg-blue-500 hover:bg-blue-600 hover:scale-[1.03]"
              }`}
              onClick={() => handleCall()}
              disabled={callStatus === CallStatus.CONNECTING}
            >
              {callStatus === CallStatus.CONNECTING && (
                <span className="absolute inset-0 rounded-full bg-yellow-400 opacity-75 animate-ping" />
              )}
              <span className="relative">
                {callStatus === CallStatus.INACTIVE ||
                callStatus === CallStatus.FINISHED
                  ? "Start Interview"
                  : "Connecting..."}
              </span>
            </button>
          ) : (
            <button
              className="px-8 py-3 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 hover:scale-[1.03] transition-all"
              onClick={() => handleDisconnect()}
            >
              End Interview
            </button>
          )}
        </div>
      </div>

      {/* Add global CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes ping {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes pulse {
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
};

export default Agent;
