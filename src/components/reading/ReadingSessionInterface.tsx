import React, { useState } from 'react';

// This is a demonstration component showing how the reading interface might look
// using DaisyUI components
const ReadingSessionInterface = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isReading, setIsReading] = useState(false);
  const [wcpm, setWcpm] = useState(0);
  const [attempt, setAttempt] = useState(1);

  // Sample text for demonstration
  const sampleText = "The little rabbit hopped across the green field. He was looking for carrots to eat. The sun was warm on his soft fur. He saw a butterfly flying near some flowers. The rabbit watched the butterfly for a while. Then he continued his search for food.";

  const startReading = () => {
    setIsReading(true);
    // In a real implementation, this would start the speech recognition
    // and timer functionality
  };

  const finishReading = () => {
    setIsReading(false);
    // In a real implementation, this would calculate the WCPM
    // and show results
    setWcpm(attempt === 1 ? 65 : 72);
  };

  const startNextAttempt = () => {
    setAttempt(2);
    setTimeLeft(60);
  };

  return (
    <div className="flex flex-col items-center p-4 max-w-4xl mx-auto">
      {/* Header with student info and timer */}
      <div className="navbar bg-base-100 shadow-lg rounded-box mb-4 w-full">
        <div className="flex-1">
          <span className="text-xl font-bold">Reading Rally</span>
        </div>
        <div className="flex-none gap-2">
          <div className="badge badge-primary badge-lg">{timeLeft}s</div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="https://via.placeholder.com/40" alt="Student avatar" />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><a>Profile</a></li>
              <li><a>Progress</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reading instructions or results */}
      {!isReading && (
        <div className="card w-full bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-center text-2xl">
              {attempt === 1 ? 'Ready to Read?' : 'Great Job!'}
            </h2>
            {attempt === 1 ? (
              <p className="text-center">Read the passage out loud as clearly as you can. Try to read as many words correctly as you can in one minute!</p>
            ) : (
              <div className="stats shadow w-full">
                <div className="stat">
                  <div className="stat-title">First Try</div>
                  <div className="stat-value text-primary">65</div>
                  <div className="stat-desc">words per minute</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Second Try</div>
                  <div className="stat-value text-secondary">72</div>
                  <div className="stat-desc">words per minute</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Improvement</div>
                  <div className="stat-value text-accent">+7</div>
                  <div className="stat-desc">That's amazing!</div>
                </div>
              </div>
            )}
            <div className="card-actions justify-center mt-4">
              {attempt === 1 ? (
                <button className="btn btn-primary btn-lg" onClick={startReading}>
                  Start Reading
                </button>
              ) : (
                <div className="flex flex-col gap-2 items-center">
                  <div className="badge badge-lg badge-accent gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    New Badge: Speed Reader
                  </div>
                  <button className="btn btn-primary btn-lg mt-2">
                    Continue to Next Text
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reading area */}
      <div className={`card w-full bg-base-100 shadow-xl ${isReading ? 'border-4 border-primary' : ''}`}>
        <div className="card-body">
          <div className="reading-container font-reading text-xl leading-relaxed p-4">
            {sampleText}
          </div>
          {isReading && (
            <div className="card-actions justify-center mt-4">
              <button className="btn btn-accent btn-lg" onClick={finishReading}>
                I'm Done Reading
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error correction area (shown after first reading) */}
      {!isReading && attempt === 1 && wcpm > 0 && (
        <div className="card w-full bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            <h2 className="card-title text-xl">Let's review these words:</h2>
            <div className="flex flex-wrap gap-3 my-4">
              <div className="badge badge-lg badge-outline badge-error gap-2">butterfly</div>
              <div className="badge badge-lg badge-outline badge-error gap-2">continued</div>
            </div>
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Listen to these words and try to say them. Then try reading again to improve your score!</span>
            </div>
            <div className="card-actions justify-center mt-4">
              <button className="btn btn-secondary btn-lg" onClick={startNextAttempt}>
                Try Reading Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingSessionInterface;
