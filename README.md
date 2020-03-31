# basicnodeapp

To run Prometheus first run this docker command
 sudo docker run -p 9090:9090 -v "$(pwd)/prometheus-data":/prometheus-data prom/prometheus --config.file=/prometheus-data/prometheus.yml
 
Then go to http://localhost:9090
