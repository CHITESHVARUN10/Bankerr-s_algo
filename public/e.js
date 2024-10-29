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

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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

            let textd = document.createElement("p");
            if (execute) {
                let send = await axios.post(`/execute/${p._id}`);
                await delay(1000);  // Delay before the message

                // Show execution message
                textd.innerText = `Process ${p.name} is being executed as all its needs are less than or equal to available resources.`;
                textd.classList.add('fade-in');  // Apply fade-in animation
                out.appendChild(textd);
                
                ultimate = true;
                await delay(2000);  // Delay before updating resources

                // Update available resources
                for (let i = 0; i < avail.length; i++) {
                    avail[i].units += p.allocation[i].units;
                }
                
                executedProcesses.push(p._id);
                executedInThisCycle = true;
            } else {
                // Show "not executed" message
                textd.innerText = `Process ${p.name} is not being executed now as its need is greater than available resources.`;
                textd.classList.add('fade-in');
                out.appendChild(textd);
                await delay(2000);
            }
        }

        if (!executedInThisCycle) {
            await delay(1000);  // Delay before unsafe alert
            alert("unsafe");
            return;
        }
    }

    // All processes executed, display safe alert
    if (executedProcesses.length === totalProcesses) {
        await delay(1000);
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