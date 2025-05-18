// In the parent component (e.g., Room.js):
// <OutputWindow outputDetails={outputDetails} additionalStyles="..." />

// In OutputWindow.js:
import React from "react";

const OutputWindow = ({ outputDetails, additionalStyles }) => {
  return (
    <div className={`!w-full flex-grow flex flex-col ${additionalStyles}`}>
      <h3 className="font-bold text-lg mb-2">Output</h3>

      {/* Access outputDetails.run, outputDetails.submitted etc. */}
      {outputDetails ? ( 
        outputDetails.submitted ? ( 
          <div className="w-full flex flex-col flex-grow bg-dark-2 rounded-lg text-white p-2 font-mono text-sm overflow-y-auto">
            <p className="text-lg">
              Status:{" "}
              <span
                className={`${outputDetails.accepted ? "text-green-500" : "text-red-500"}`}
              >
                {outputDetails.accepted ? "ACCEPTED" : "REJECTED"}
              </span>
            </p>
            {!outputDetails.accepted && (
              <textarea
                value={outputDetails.output || ""}
                className="flex-grow bg-dark-2 resize-none text-xs"
                disabled
              ></textarea>
            )}
          </div>
        ) : (
          outputDetails.run ? ( 
            <div className="w-full flex flex-col flex-grow bg-dark-2 rounded-lg text-white p-2 font-mono text-sm overflow-y-auto">
              <p className="text-xs text-blue-500">
                {/* Make sure cpuTime and memory are accessed from outputDetails.run */}
                CPUTime: {outputDetails.run.cpuTime !== undefined ? `${outputDetails.run.cpuTime}ms` : 'N/A'}
              </p>
              <p className="text-xs text-blue-500 mb-2">
                Memory: {outputDetails.run.memory !== undefined ? `${outputDetails.run.memory}b` : 'N/A'}
              </p>
              <textarea
                value={outputDetails.run.stdout || ""}
                className="flex-grow bg-dark-2 resize-none"
                disabled
              ></textarea>
              {/* Optionally, display stderr if it exists */}
              {outputDetails.run.stderr && (
                <textarea
                  value={outputDetails.run.stderr}
                  className="flex-grow bg-dark-2 resize-none text-red-500 mt-2" 
                  disabled
                ></textarea>
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col flex-grow bg-dark-2 rounded-lg text-white p-2 font-mono text-sm overflow-y-auto">
              <p>Run details not available.</p>
            </div>
          )
        )
      ) : (
        <div className="w-full flex flex-col flex-grow bg-dark-2 rounded-lg text-white p-2 font-mono text-sm overflow-y-auto">
          <p>No output yet...</p>
        </div>
      )}
    </div>
  );
};

export default OutputWindow;
