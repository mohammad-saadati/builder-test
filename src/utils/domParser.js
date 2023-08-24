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
