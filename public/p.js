const form1 = document.forms.insert;

form1.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form1);
    let formValues = {};
    let allocation = [];

    formData.forEach((value, key) => {
        if (key.includes("allocation")) {
            // Extract the resource name from the key
            const resourceName = key.replace("allocation", "");
            const resourceId = formData.get(`${resourceName}id`);
            const allocatedUnits = parseInt(value, 10);
            const neededUnits = parseInt(formData.get(`${resourceName}need`), 10);

            allocation.push({
                rid: resourceId,  // Resource ID
                units: allocatedUnits,  // Allocated units
                need: neededUnits  // Needed units
            });
        } else {
            formValues[key] = value;
        }
    });

    // Add allocation array to the form data
    formValues.allocation = allocation;

    fetch("/create/process", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formValues)
    }).then(response => {
        return response.json();
    }).then(data => {
        alert(data.message);
    }).catch(error => {
        console.error(error);
        alert("An error occurred!");
    });
});
