import {useEffect, useRef, useState} from "react"
import {generateDomObject, printHierarchy} from "../utils/domParser.js"

function Home() {
  const iframeRef = useRef(null)
  const [hirarcy, setHierarchy] = useState(null)

  useEffect(() => {
    const iframe = iframeRef.current;

    const handleIframeLoad = () => {
      const iframeContent = iframe.contentWindow.document.body.innerHTML;

      const parser = new DOMParser();
      const doc = parser.parseFromString(iframeContent, "text/html");
      const rootElement = doc.querySelector("body");

      const domTree = generateDomObject(rootElement);
      
      const hierarchyString = printHierarchy(domTree);

// Create a <pre> element to display the hierarchy string
      const preElement = document.createElement("pre");
      preElement.textContent = hierarchyString;

      // Append the <pre> element to a div
      const outputDiv = document.getElementById("output"); // Replace "output" with the ID of your div
      outputDiv.appendChild(preElement);

    };

    iframe.addEventListener("load", handleIframeLoad);

    return () => {
      iframe.removeEventListener("load", handleIframeLoad);
    };
  }, [])

  
  return (
    <div className="w-full min-h-screen flex gap-10">
      <aside className="w-[400px] bg-slate-900 text-white py-5 overflow-y-auto max-h-screen" id="output"></aside>
      <iframe
        ref={iframeRef}
        className="flex flex-1 m-10 rounded-2xl shadow-lg"
        src="/template"
      />
    </div>
  );
}

export default Home;
