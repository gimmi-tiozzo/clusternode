const express = require("express");
const app = express();
const port = process.env.PORT ?? 3000;

function doWork(duration) {
    const start = Date.now();
    while (Date.now() - start < duration) {}
}

app.get("/", (_req, resp) => {
    console.log(`Ricezione processo: ${process.pid}`);
    doWork(10000);
    resp.send("Terminato");
});

app.listen(port, () => {
    console.log(`In ascolto sulla porta ${port}`);
});
