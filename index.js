const fs = require('fs');
const readline = require('readline');
let inputFile = './assets/Customers_Assignment_Coding_Challenge.txt';
let originLatitude =  53.339428;
let originLongitude =  -6.257664;
let range = 100;

let processFileGetNearestUsers = (originLongitude, originLatitude, inputFile, range, callBack) =>{
    console.log('processFileGetNearestUsers');
    getUserListInRange(originLongitude, originLatitude, inputFile, range, (userList)=>{
        sortedUserList = sortUsersList(userList);
        if(sortedUserList){
            callBack(null, sortedUserList);
        }else{
            callBack("Result empty", sortedUserList);
        }
    }); 
}

// get the users list which are in range
let getUserListInRange = (originLongitude, originLatitude, inputFile, range, callBack) => {
    console.log('getUserListInRange');
    const readInterface = readline.createInterface({  
        input: fs.createReadStream(inputFile),
        console: false
    });
    let UserList = {};
    readInterface.on('line', function(line) { 
        let userObj = getUserInRange(originLongitude, originLatitude, JSON.parse(line),  range)
        if(userObj){
            UserList[userObj.user_id] = userObj;
        }
    });
    readInterface.on('close', function() { 
        callBack(UserList);
    });
}

// To sort user list
let sortUsersList = (userList) => {
    let userIdsArray = Object.keys(userList);
    userIdArray = userIdArray.map((val)=>{return parseInt(val)});
    userIdArray = userIdArray.sort((a, b)=>{return a-b});
    resultUserArray = [];
    for(let i in userIdArray){
        resultUserArray.push(userList[userIdArray[i]])
    }
    return resultUserArray;
}

// To find the user is in range or not. 
let getUserInRange =  (originLongitude, originLatitude, row,  range) => {
    originLong = degreeToRadian(originLong)
    originLat = degreeToRadian(originLat)
    rowLongitude = degreeToRadian(row.longitude);
    rowLatitude = degreeToRadian(row.latitude);
    let distance = getDistanceInKm(originLong, originLat, rowLongitude, rowLatitude);
    if(distance <= range ){
        let outRow = {
            user_id : row.user_id,
            name : row.name,
        }
        return outRow;
    }
}

// This function will find the distance between origin to givin point.
let getDistanceInKm = (originLongitude, originLatitude, pointLongitude, pointLatitude) => {
    let longitudeDistance = originLongitude - pointLongitude;  
    let latitudeDistance = originLatitude - pointLatitude; 
    let distanceInKm = 6371* 2* Math.asin( Math.sqrt (Math.pow(Math.sin(latitudeDistance / 2), 2) 
             + Math.cos(pointLatitude) * Math.cos(originLatitude) 
             * Math.pow(Math.sin(longitudeDistance / 2),2)));
    return distanceInKm;
};

// This function will convert the degree of latitude or longitude to radian.
let  degreeToRadian = (degree) => {
    let pi = Math.PI;
    return parseFloat(degree) * (pi/180);
};
module.exports = {
    processFileGetNearestUsers: processFileGetNearestUsers,
    getDistanceKm:getDistanceInKm,
    convertDegreeToRadians:degreeToRadian
};