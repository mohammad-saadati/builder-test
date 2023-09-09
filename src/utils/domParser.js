export function generateDomObject(element) {
  const domObject = {
    isReactComponent: false,
    tagName: element.tagName,
    attributes: {},
    children: [],
  };

  // Detect if it's a React component
  console.log(element.type);
  if (element.type && element.type.prototype.isReactComponent) {
    domObject.isReactComponent = true;
  }

  // Collect attributes
  for (const { name, value } of element.attributes) {
    domObject.attributes[name] = value;
  }

  // Process child nodes
  for (const childNode of element.childNodes) {
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      const childDomObject = generateDomObject(childNode);
      domObject.children.push(childDomObject);
    }
  }

  return domObject;
}

export function printHierarchy(domObject, depth = 0) {
  const indent = "  ".repeat(depth);

  const tagInfo = domObject.isReactComponent
    ? `${domObject.tagName} (react component)`
    : domObject.tagName;

  let hierarchyString = `${indent} ${tagInfo}\n`;

  for (const child of domObject.children) {
    hierarchyString += printHierarchy(child, depth + 1);
  }

  hierarchyString += `${indent} ${tagInfo}\n`;
  return hierarchyString;
}

// Application code starts
class CompA extends React.Component {
  render() {
    return (
      <div style={{ color: "green" }}>
        <div>
          Click on any element to see the name of its parent component in
          console.
          <br />
          Component A wraps everything including this one.{" "}
        </div>
        <CompB />
        <CompC />
        <div>Component A continues</div>
      </div>
    );
  }
}

function CompB() {
  return (
    <div style={{ color: "blue" }}>
      <div>Component B starts here</div>
      <div>Inside Component B 1</div>
      <div>Inside Component B 2</div>
    </div>
  );
}

function CompC() {
  return (
    <div style={{ color: "red" }}>
      <div>Component C is here</div>
      <div>Which is a sibling of B</div>
    </div>
  );
}

const jsxRenderTree = ReactDOM.render(
  <CompA />,
  document.getElementById("container")
);

// Application code ends

////////////////////////////////
// Meta code below

isNodeSimple = (node) => {
  return typeof node.type === "string" || node.type === null;
};

traverse = (node) => {
  if (node.child) {
    if (!isNodeSimple(node) && typeof node.child.type === "string") {
      node.child.stateNode.addEventListener("click", (ev) => {
        console.log("Clicked inside component: " + node.type.name);
        ev.stopPropagation();
      });
      /* console.log('Set event listener for '+ node.type.name) */
    }
    traverse(node.child);
  }
  node.sibling && traverse(node.sibling);
};

findComponent = (node, name) => {
  if (!isNodeSimple(node) && node.type.name === name) {
    console.log("Found node with name " + node.type.name);

    if (node.child) {
      let innerNode = node.child;
      console.log("Highlighting its inner nodes in yellow");

      highlightNode(node, true);
    }
  }
  node.child && findComponent(node.child, name);
  node.sibling && findComponent(node.sibling, name);
};

highlightNode = (node, ignoreSibling = false) => {
  if (isNodeSimple(node)) {
    node.stateNode.style.backgroundColor = "yellow";
  } else {
    node.child && highlightNode(node.child);
  }
  !ignoreSibling && node.sibling && highlightNode(node.sibling);
};

traverse(jsxRenderTree._reactInternalFiber);

findComponent(jsxRenderTree._reactInternalFiber, "CompB");
