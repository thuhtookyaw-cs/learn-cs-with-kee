const res = fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        language: "python",
        version: "3.10.0",
        files: [{ content: "print('Hello from Piston!')\nimport sys\nprint(sys.version)" }]
    })
}).then(r => r.json()).then(console.log).catch(console.error);
