const { cpus } = require("os");
const cluster = require("cluster");

//esegui il master (clustern manager). Avvia i worker e rileva la loro chiusura
if (cluster.isMaster) {
    let numCpu = cpus.length;

    if (numCpu === 0) {
        numCpu = 4;
    }

    console.log(`Esecuzione master process id: ${process.pid}`);
    console.log(`Numero di CPU su cui clusterizzare ${numCpu}`);

    //avvia i worker
    for (let i = 0; i < numCpu; i++) {
        cluster.fork();
    }

    //sottoscrivi ad evento di uscita di un worker
    cluster.on("exit", (worker, _code, _signal) => {
        console.log(`worker ${worker.process.pid} morto`);
    });
} else {
    //avviamento worker
    console.log(`Esecuzione slave (worker) process id: ${process.pid}`);
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
}
