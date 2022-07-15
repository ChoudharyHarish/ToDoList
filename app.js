const express = require("express");
const bodyParser = require("body-parser");
const day = require(__dirname + "/date.js") // local modules ke liye path specify krna hota h
const res = require("express/lib/response");
const { redirect } = require("express/lib/response");
const mongoose = require("mongoose");
const req = require("express/lib/request");


const app = express();


//Now we will store data using database so no need of this

// const items = ["Buy Milk", "Eat" , "Sleep"]; 
// const workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// Creating new Database using mongodb
mongoose.connect("mongodb://localhost:27017/toDoListDB");  // slash ke baad database ka name aata he remeber

// Creating itemShcema

const itemShcema = new mongoose.Schema({
    name: String
});

//Creating model/collection

const Item = new mongoose.model("Item", itemShcema);

//Creating Document/data for our database

const item1 = new Item({
    name: "Eat"
})
const item2 = new Item({
    name: "Sleep"
})
const item3 = new Item({
    name: "Create"
})

const defaultItems = [item1, item2, item3];

// Inserting items document to our database using insertMany()
// When  we deploy our application we will not want to comment insert many manually so we need to do something like when list is empty then only insert or not in other case we will use if() in our get() request




app.get("/", function (req, res) {
    const today = day();
    Item.find({}, function (err, items) {   // find me first parameter condition hoti thi pr yaha hame sare item chiye so no 
        if (err) console.log(err); // condition return me array milta tha remember second paramter of callback function
        else {          //render ko yaha rkege
            // jo items array hogi uski lengt h check krlege ki empty he ki nhi so we can decide on what to do with our default items  
            if (items.length === 0) {
                Item.insertMany(defaultItems, function (err) {
                    if (err) console.log(err);
                    else console.log("Added to database successfully");
                })
                res.redirect("/");  
                //sabse pehle agar items nhi he to insert krdega aur phir redirect krdege so is time vo else wali condition me jaeg aur render ho jaega
                
            }
            else{
            res.render("index", { listTitle: today, itemsList: items });
            } //{} obj me hame key value pair bhejna key equals to hamara ejs ka variable  //Items array milega database se using find() aur phir apne itemsList ko dedege 
            // so itemsList ek array hoga containing document from our database phir unke name propert me chale jaege
        }
    })

})

// Post request me basically apn ne jo array banai thi unme push ho rha tha but abhi apn ko database me add krna he remeber 
// so post request me jab apn ko value milege listItem ki using req.body.listItem then we will make document of it and insert it in our database 
app.post("/", function (req, res) {
    const itemName = req.body.listItem;

    const newItem = new Item({
        name : itemName
    })
    newItem.save();
    // Database me document add hogaya ab bas phirse redirect krdo homepage pr 

    res.redirect("/");



    // if (req.body.listButton === "WorkList") {
    //     workItems.push(item);
    //     res.redirect("/work");
    //     //    agar worklist title he then workItems array me populate krdiya aur work wale page pe redirect krdiya
    // }
    // sabse pehle apne button ka name attribute dediya listButton aur ek value bhi  jo ki list title(variable) hogi so uski value check krke apn decide kr skte he ki kis array me populate krna he data.

})

// remeber apn ne checkbox ko value di h then we can tap into its name attribute to get value of id 
app.post("/delete", function(req,res){
        const delItemId = req.body.itemToDelete

   // Item.deleteOne({_id : delItemId});   // so jisko id match kregi vo delte hojaegi iske baad phir se redirect krdege  or mongoose ka findByIdAndRemove use krskte he  remember in this function callback is necessary

   Item.findByIdAndRemove(delItemId,function (err) {
       if(err) console.log(err);
       else console.log("Item is been removed from the database");
   })

    res.redirect("/");
})


//Creating storage for our work items

const workItemShcema = new mongoose.Schema({
    name : String
})

const WorkItem = new mongoose.model("WorkItem", workItemShcema);

const workItem1 = new WorkItem({
    name : "Code"
})
const workItem2 = new WorkItem({
    name : "Learn"
})
const workItem3 = new WorkItem({
    name : "Read"
})
 
const workItemArray = [workItem1,workItem2,workItem3];

app.get("/work", function (req, res) {
    
    WorkItem.find({},function(err,workItem){  //remember callback is optional

        if(workItem.length === 0){
            WorkItem.insertMany(workItemArray,function(err){
                if(err) console.log(err)
                else console.log("WorkItems added to database Successfully")
            })
            res.redirect("/work");
        }
        else
        res.render("index", { listTitle: "WorkList", itemsList: workItem});

    })

})
app.listen("3000", function () {
    console.log("Server started at port 3000");
})