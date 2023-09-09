import { useEffect, useRef, useState } from "react";
import { getInternalReact } from "react-devtools";

function Home() {
  const iframeRef = useRef(null);
  const [hierarchyString, setHierarchyString] = useState("");

  useEffect(() => {
    const iframe = iframeRef.current;

    const handleIframeLoad = () => {
      const internalReact = getInternalReact();
      if (!internalReact) {
        console.error("React DevTools not found.");
        return;
      }

      const fiberRoot = internalReact.findFiberRoot(iframe.contentWindow);

      const hierarchyString = traverseFiberTree(fiberRoot.current);
      setHierarchyString(hierarchyString);

      iframe.removeEventListener("load", handleIframeLoad);
    };

    iframe.addEventListener("load", handleIframeLoad);

    return () => {
      iframe.removeEventListener("load", handleIframeLoad);
    };
  }, []);

  const traverseFiberTree = (node, depth = 0) => {
    const indent = "  ".repeat(depth);
    let hierarchyString = `${indent}${node.type.displayName || node.type.name || "Unknown"}\n`;

    if (node.child) {
      hierarchyString += traverseFiberTree(node.child, depth + 1);
    }
    if (node.sibling) {
      hierarchyString += traverseFiberTree(node.sibling, depth);
    }

    return hierarchyString;
  };

  return (
    <div className="w-full min-h-screen flex gap-10">
      <aside className="w-[400px] bg-slate-900 text-white py-5 overflow-y-auto max-h-screen">
        <pre>{hierarchyString}</pre>
      </aside>
      <iframe
        ref={iframeRef}
        className="flex flex-1 m-10 rounded-2xl shadow-lg"
        src="/template"
      />
    </div>
  );
}

export default Home;
