var ultimate = false;
const out = document.getElementById("out");

async function call() { 
    let res = await axios.post("/alld");
    return res;
}

async function exe() {
    let res = await call();
    let data = res.data;
    let resources = data.resources;
    let avail = [];

    for (let a of resources) {
        let d = {
            id: a._id,
            units: a.units
        };
        avail.push(d);
    }

    console.log(avail);
    let processes = data.processes;
    let executedProcesses = [];
    let totalProcesses = processes.length;

    while (executedProcesses.length < totalProcesses) {
        let executedInThisCycle = false;

        for (let p of processes) {
            if (executedProcesses.includes(p._id)) continue;

            let execute = true;

            for (let i = 0; i < avail.length; i++) {
                if (p.allocation[i].rid === avail[i].id) {
                    let n = p.allocation[i].need - p.allocation[i].units;
                    if (n > avail[i].units) {
                        execute = false;
                        break;
                    }
                }
            }

            if (execute) {
                let send = await axios.post(`/execute/${p._id}`);
                setTimeout(() => {
                    
                }, 1000);
                console.log(send.data.message);
                ultimate = true;

                let textd = document.createElement("p");
                textd.innerText = `Process ${p.name} is being executed as all its needs are less than or equal to available resources.`;
                out.appendChild(textd);
                setTimeout(() => {
                    
                }, 2000);

                for (let i = 0; i < avail.length; i++) {
                    avail[i].units += p.allocation[i].units;
                }

                executedProcesses.push(p._id);
                executedInThisCycle = true;
            } else {
                let textd = document.createElement("p");
                textd.innerText = `Process ${p.name} is not being executed now as its need is greater than available resources.`;
                out.appendChild(textd);
                setTimeout(() => {
                    
                }, 2000);
            }
        }

        if (!executedInThisCycle) {
            alert("unsafe");
            return;
        }
    }

    if (executedProcesses.length === totalProcesses) {
        alert("safe");
    }
}



      

        document.getElementById('terminateBtn').addEventListener('click', function() {
            fetch('/terminate', {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                window.location.reload(); 
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while terminating data.');
            });
        });