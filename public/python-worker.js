'use strict';

let pythonPromise;
let inputLines = [];
self.onmessage = async event => {
  let ok = false;
  try {
    if (!pythonPromise) {
      importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');
      pythonPromise = loadPyodide({
        indexURL:'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
        stdout:text => self.postMessage({type:'output',text}),
        stderr:text => self.postMessage({type:'output',text}),
        stdin:() => inputLines.length ? inputLines.shift() : null
      }).catch(error => { pythonPromise = undefined; throw error; });
    }
    const python = await pythonPromise;
    self.postMessage({type:'ready'});
    inputLines = event.data.input ? event.data.input.split(/\r?\n/) : [];
    // A fresh namespace prevents variables from earlier runs changing a new program.
    const namespace = python.toPy({__name__:'__main__'});
    try { await python.runPythonAsync(event.data.code, {globals:namespace}); }
    finally { namespace.destroy(); }
    ok = true;
  } catch (error) {
    self.postMessage({type:'error',text:String(error)});
  } finally {
    self.postMessage({type:'done',ok});
  }
};
