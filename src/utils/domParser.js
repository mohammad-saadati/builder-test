export function generateDomObject(element) {
  const domObject = {
    tagName: element.tagName,
    attributes: {},
    children: [],
  };

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

  const componentName = domObject.attributes["data-component-name"];
  const tagInfo = componentName
    ? `${componentName} (react component)`
    : domObject.tagName;

  let hierarchyString = `${indent} ${tagInfo}\n`;

  for (const child of domObject.children) {
    hierarchyString += printHierarchy(child, depth + 1);
  }

  hierarchyString += `${indent} ${tagInfo}\n`;
  return hierarchyString;
}
