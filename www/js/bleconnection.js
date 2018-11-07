
var bleConnectedAndReady = false;
var isBLEWanted = false;


var vibrationIntensity = new Uint8Array(4);
var CHAR_WRITE_MOTORS = "713d0003-503e-4c75-ba94-3148f18d941e";
var SERVICE_UUID = "713d0000-503e-4c75-ba94-3148f18d941e";

var deviceId;

var settingsBLEstatus = document.getElementById("bleStatus");

function setChecked(value){
  return document.getElementById("bleSwitch").checked = value;
}


function vibrationMode(intensity, pauseTime, maxRounds, repeatTime) {
    console.log("vibrationStarted")
    var rounds = 0;
    var mode = setInterval(function(){
        rounds++;
        console.log("vibrationStarted round " + rounds)
        if (rounds >= maxRounds) {
            clearInterval(mode);
            startAllMotors(0);
        } else {
            startAllMotors(intensity);
            setTimeout(function() {
            startAllMotors(0);
            }, pauseTime);
        }
    }, repeatTime);
}

function bleSwitched(){
  isBLEWanted = !isBLEWanted;
  setChecked(isBLEWanted);
  console.log("swiched");
  if(isBLEWanted){
    connectToBLE();
    }else{
    disconectBLE("Diconnected");
  }
}
function disconectBLE(text){
  settingsBLEstatus.innerHTML =  text;
  isBLEWanted = false;
  ble.disconnect(deviceId);
  setChecked(isBLEWanted);
}

function connectToBLE(){
  settingsBLEstatus.innerHTML = "Connecting ...";
  ble.scan([],5, found, notFound);
}

function found(device){
  if (device.name === "TECO Wearable 5") {
    settingsBLEstatus.innerHTML += "<br>Device found!"
    deviceId = device.id;
    ble.connect(device.id, connectDevice, connectionError);
  }
}

function notFound(){
  disconectBLE("No Device found!");
}

function connectDevice(event){
  bleConnectedAndReady = true;
  settingsBLEstatus.innerHTML = "Successfull connected";
}

function connectionError(e){
  disconectBLE("Error while connecting");
}
function startAllMotors(intensity) {
    console.log("startEngines")
    ble.isConnected(deviceId, function() {
        console.log("connected, beginning to write data...");
        vibrationIntensity[0] = intensity;
        vibrationIntensity[1] = intensity;
        vibrationIntensity[2] = intensity;
        vibrationIntensity[3] = intensity;
        ble.writeWithoutResponse(deviceId, SERVICE_UUID, CHAR_WRITE_MOTORS, vibrationIntensity.buffer,
            function() {
                console.log("write success!");
                console.log(vibrationIntensity);
            },
            function(e) {
                console.log("write failure!"+ e);
            });
    }, function(e) {
         console.log("lost connection, reconnect" + e);
         bleConnectedAndReady=false;
         connectToBLE();

    });
}


function reconnectLoop() {
  if(isBLEWanted && bleConnectedAndReady){
   ble.isConnected(deviceId, function() {
            console.log("Still connected");
        }, function() {
          console.log("reconnect");
            connectToBLE();
        });
    }
}

setInterval(reconnectLoop, 5000);
