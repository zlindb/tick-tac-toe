const documentMock = (() => ({ 
   //reason why there's parantesis here cuz object literal notation 
  querySelector: (selector) => ({
    innerHTML: null,
  }),
}))();

const Formatter = (function(doc) {
  const log = (message) => console.log(`[${Date.now()}] Logger: ${message}`);

  const makeUppercase = (text) => {
    log("Making uppercase");
    return text.toUpperCase();
  };

  const writeToDOM = (selector, message) => {
    doc.querySelector(selector).innerHTML = message;
  }

  return {
    makeUppercase,
    writeToDOM,
  }
})(document || documentMock);

console.log(Formatter.writeToDom())