const prometh = require('prom-client');
// const express = require('express');
// const app = express();

const PORT = 5001;
const HOST = '0.0.0.0';

const collectDefaultMetrics = prometh.collectDefaultMetrics({ timeout: 5000 });

//const interval = collectDefaultMetrics();

const histogram = new 
  prometh.Histogram({
    name :'http_req_duration_microsec',
    help : 'Duration of hhtp in Microsec',
    labelNames : ['Url'],
    buckets : [0.10,5, 15, 50, 100, 200, 300, 400, 500]
});

const counter = new prometh.Counter({
    name: 'node_request_operations_total',
    help: 'The total number of processed requests'
  });
  



module.exports.promControler = (app) => {

//     app.use((req,res,next) => {
//         console.log(req.Url);
//         httpRequestDurationMicroSec
//             .labels(req.Url.path)
//             .observe(responseTimeInMs);
//         next();
//     })

//   app.get('/prom/metrics', (req, res) => {
//     res.set('Content-Type', Prometheus.register.contentType)
//     res.end(Prometheus.register.metrics())
//   });
app.get('/', (req, res) => {
    var start = new Date()
    var simulateTime = 1000

    setTimeout(function(argument) {
    // execution time simulated with setTimeout function
        var end = new Date() - start
        histogram.observe(end / 1000); //convert to seconds
        }, simulateTime)

        counter.inc();

        res.send('Hello world\n');
    });


    // Metrics endpoint
    app.get('/prom/metrics', (req, res) => {
        res.set('Content-Type', prometh.register.contentType)
        res.end(prometh.register.metrics())
    })

    app.listen(PORT, HOST);

}
