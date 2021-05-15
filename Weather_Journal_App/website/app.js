/* Global Variables */

let baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "&appid=740ea3d646412cb039047fcbe5f539a9&units=imperial";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

document.getElementById("generate").addEventListener("click", performAction);

function performAction(e) {
    const getZip = document.getElementById("zip").value;
    const feelings = document.getElementById("feelings").value;
    //We get the weather data and THEN create a POST from that data
    getReport(baseURL, getZip, apiKey)
        //New Syntax!
        .then(function (data) {
            postData("/add", { city: data.name, date: newDate, temp: data.main.temp, feelings: feelings });
            //This dynamically produces the data in the static web page (Dynamic UI update)
            //Hence, because of ASYNC we can wait until we received the data, posted the data & then we can update the UI
            updateUI();
        });
}

//ASYNC gives access to AWAIT, TRY & CATCH
//AWAIT makes the code wait until it gets the weather data
//FETCH call is calling the web API
const getReport = async (baseURL, zip, key) => {
    const res = await fetch(baseURL + zip + key);
    try {
        //Here we wait & get the data in JSON format
        const data = await res.json();
        console.log(data);
        return data;
    } catch (error) {
        console.log("error", error);
        // appropriately handle the error
    }
};

//To make a POST request to our route.
const postData = async (url = "", data = {}) => {
    console.log(data);
    const res = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        // Body data type must match "Content-Type" header
        //This is how we will access the data on the server side. When sending data to a web server, the data has to be a string.
        //We can convert a JavaScript object into a string using the JavaScript method JSON.stringify(). This turns JavaScript objects and JSON data into a string for our server to receive the information.
        //Here we are turning the JavaScript object passed in the data parameter into a string.
        body: JSON.stringify(data),
    });

    try {
        const newData = await res.json();
        console.log(newData);
        return newData;
    } catch (error) {
        console.log("error", error);
    }
};

//Get the data we have posted ASYNC, to display on the static webpage
//1.Create selector, 2.Identify Data to udpate the Element & 3.Set appropriate property
const updateUI = async () => {
    const request = await fetch("/all");
    try {
        // WAIT to transform into JSON data
        const allData = await request.json();
        console.log(allData);
        document.getElementById("city").innerHTML = allData.city;
        document.getElementById("date").innerHTML = allData.date;
        document.getElementById("temp").innerHTML = allData.temp;
        document.getElementById("content").innerHTML = allData.feelings;
    } catch (error) {
        console.log("error", error);
        // appropriately handle the error
    }
};
