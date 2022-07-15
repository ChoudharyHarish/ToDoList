// console.log(module)

module.exports = getDay;
function getDay() {

const day = new Date();
const options = {
    weekday : "long",
    day : "numeric",
    month : "long"
}
const today = day.toLocaleDateString("en-US",options); //see date objext refernce for this options modify the output for date u can see more in mozilla developer reference

return today;
} 
// getDay function banadiya phir isko export krdege apne app.js me so vaha confusion kam hoga aur jo cheez root se related he bas vhi hogi 


// Making code shorter  by making annoynmous function let variable = function() {  } 

// exports.getDay = function () {
    
// } 
// or     dont need to write module.exports
// module.exports.getDay = function() {

//     let day = new Date();
//     let options = {
//         weekday : "long",
//         day : "numeric",
//         month : "long"
//     }
//     return  day.toLocaleDateString("en-US",options);
// }