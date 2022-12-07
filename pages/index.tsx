import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

const Home = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const onChange = (event: any) => {
    setInput(event.target.value);
  };

  const generateAction = useCallback(async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    const response = await fetch("/api/generateText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });
    const data = await response.json();
    const { baseChoice, finalChoice } = data;
    setOutput(
      `Article Title:${finalChoice.text}\n\Your Article:\n${input}${baseChoice.text}`
    );

    setIsGenerating(false);
  }, [input, isGenerating]);

  useEffect(() => {
    const keydownHandler = async (event: any) => {
      if ((event.metaKey || event.ctrlKey) && event.code === "Enter") {
        event.preventDefault();
        console.log("Hellooooo");
        await generateAction();
      }
    };

    window.addEventListener("keydown", keydownHandler);

    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [generateAction]);

  return (
    <div className="root">
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Tealfeed Article Generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>Write your article based on some theme</h2>
          </div>
        </div>
        <div className="prompt-container">
          <textarea className="prompt-box" value={input} onChange={onChange} />
          <div className="prompt-buttons">
            <div className="key-stroke">
              <p>cmd/ctrl + enter</p>
            </div>
            <div className="or">
              <p>OR</p>
            </div>
            <a
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={generateAction}
            >
              <div className="generate">
                {isGenerating ? (
                  <span className="loader"></span>
                ) : (
                  <p>Generate</p>
                )}
              </div>
            </a>
          </div>
        </div>
        {output && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Output</h3>
              </div>
            </div>
            <div className="output-content">
              <p>{output}</p>
            </div>
          </div>
        )}
      </div>
      <div className="badge-container grow">
        <div className="badge">
          {/* <Image src={buildspaceLogo} alt="buildspace logo" /> */}
          <p>build with Tealfeed</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
