const express=require("express")
const app=express()
const port=3000; 
const mongoose = require('mongoose');
const path=require("path")
const axios=require("axios")
const Resource=require("./Model/Resource")
const Process=require("./Model/Process")
const methodOverride = require('method-override')
const dotenv = require('dotenv')
 
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

app.use(express.json());
 

app.use(express.urlencoded({ extended: true }));

app.set("views",path.join(__dirname,"/views"))
app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")))
app.post("/newresource",async(req,res)=>{
const{name,units}=req.body;
console.log(name,units);
let a=new Resource({name:name,
    units:units,
    curr:units
})
 a.save()
console.log(a)
res.redirect("/test")
})


app.post("/allResource",async(req,res)=>{
    let b= await Resource.find()
   
    res.status(200).send(b)

})
app.get("/edit/resource/:id",async(req,res)=>{
const {id}=req.params;
let a=await Resource.findById(id);
res.render("resourceedit",{a})
})

app.get("/test",async(req,res)=>{
    let b=await axios.post("http://localhost:3000/allResource")
    res.render("test",{all:b.data})
})
app.patch("/resource/:id",async(req,res)=>{
  const{name,units}=req.body;
  const{id}=req.params
  let a=await Resource.updateOne({_id:id},{name:name,units:units})
  console.table(a)
  res.redirect("/test")
})
app.delete("/resource/:id",async(req,res)=>{
  const {id}=req.params;
  let a= await Resource.deleteOne({_id:id})
  console.log("delete")
  console.table(a)
  res.redirect("/test")
})
app.get("/process",async(req,res)=>{
  let b=await axios.post("http://localhost:3000/allResource")
  res.render("process",{r:b.data})
})


app.post("/create/process", async (req, res) => {
  const { name, burst, allocation } = req.body;
  try {
      
    // Create a new process object
    const newProcess = new Process({
      name: name,
      burst: burst || 2,  // Default burst if not provided
      allocation: allocation.map(a => ({
          rid: a.rid,  // resource id
          units: a.units,  // allocated units
          need: a.need  // need must be included here
      })),
      max: allocation.map(a => ({
          rid: a.rid,  // resource id
          unit: a.units  // max units
      }))
  });
   
    for (let alloc of allocation) {
        // Find the resource by ID
        const resource = await Resource.findById(alloc.rid);

        if (!resource) {
            return res.status(404).json({ error: "Resource not found" });
        }

       
        if (resource.units < alloc.units) {
            return res.status(400).json({ error: `Not enough units available for resource: ${resource.name}` });
        }

       
        resource.units -= alloc.units;

   
        await resource.save();
    }

    // Save the new process
    await newProcess.save();

    console.log(req.body);
    res.status(201).json({ message: "Process created successfully", process: newProcess });

} catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while creating the process" });
}
  
});
app.post("/alld",async(req,res)=>{
  let resources = await Resource.find();
  let processes = await Process.find();
  
  const data = {
      resources: resources,
      processes: processes
  };
  res.send(data).json
})
app.post("/execute/:id", async (req, res) => {
  try {
      const { id } = req.params;

    
      const process = await Process.findById(id);
      if (!process) {
          return res.status(404).json({ message: "Process not found" });
      }

      
      for (let allocation of process.allocation) {
         
          const resource = await Resource.findById(allocation.rid);

          if (resource) {
             
              resource.units += allocation.units; 
              await resource.save(); 
              console.log(resource)
          }
      }

     
      await Process.findByIdAndDelete(id);

      res.json({ message: "Process deleted and resources updated successfully." });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
});




app.get("/alld", async (req, res) => {
  let resources = await Resource.find();
  let processes = await Process.find();
  
  const data = {
      resources: resources,
      processes: processes
  };

  console.log(data);
  res.render("execute", { data }); 
});


app.delete("/terminate", async (req, res) => {
  try {
      await Resource.deleteMany({});
      await Process.deleteMany({});
      res.status(200).json({ message: "All data deleted successfully" });
  } catch (err) {
      res.status(500).json({ message: "Error deleting data" });
  }
});

app.get("/",(req,res)=>{
    res.render("home")
})
async function main() {
  try {//mongodb://localhost:27017/
    await mongoose.connect("mongodb+srv://chiteshvarunvarun:test123@cluster0.u441nrv.mongodb.net/osy?retryWrites=true&w=majority");
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}


  main().then(()=>{
    console.log("db connect")
  }).catch(err=>console.log(err))


  app.listen(port,()=>{
    console.log("server running on "+port)
  })
  
