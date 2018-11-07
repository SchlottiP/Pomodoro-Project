var isRunning = false
var workTimeMin = 25;
var pause = 5
var amountTillBig = 4;
var a = 0
var timeout = 0;
var showInterval;
var bleDevice = null;
var currentTimer=getWorkTime();


var mainButton = document.getElementById("bMain");
var time = document.getElementById("timeState");
var content = document.getElementById("content")
var settings_opened = document.getElementById("settingsOpened");
var workTimeInput = document.getElementById("workTime");
var pauseTimeInput = document.getElementById("pauseTime");
var achieved = document.getElementById("achieved");
var settingsBtn = document.getElementById("settingsBtn");

if(webkit.isMobile()){
  mainButton.disabled = true;
document.addEventListener('deviceready', function () {
    mainButton.disabled = false
    cordova.plugins.backgroundMode.enable();
  }, false);
}

function getWorkTime(){
  return workTimeMin * 1000 * 60;
}

function getPause(){
  return pause * 1000 * 60;
}

function onButtonClicked(){
  isRunning = !isRunning;
  if(isRunning){
    startTimer();
  }else {
    stopTimer();
  }
}

function startTimer(){

      timeout = setTimeout(alertBTpause, getWorkTime());
    currentTimer = getWorkTime() / 1000;
    achieved.innerHTML = "WORK";
    showInterval = setInterval(changeBtnState, 1000);
}
function changeBtnState(){
  if(currentTimer>= 0){
    currentTimer -= 1;
  }
  mainButton.innerHTML = getMin(currentTimer) + ":" + getSecond(currentTimer);
}
function getMin(val){
  var res = val - (val%60);
  res= res/60;
  if(res<10){
    return "0" + res;
  }else{
    return res;
  }
}

function getSecond(val){
 var res = val%60;
 if(res<10){
   return "0" + res;
 }else{
   return res;
 }
}


function alertBTwork(){
  vibrationMode(150, 500, 3, 1000);
  achieved.innerHTML = "WORK";
  currentTimer = getWorkTime() / 1000;
  timeout = setTimeout(alertBTpause, getWorkTime());
}

function alertBTpause(){
  a++
  vibrationMode(125, 500, 4, 1000);
  achieved.innerHTML = "PAUSE";
  currentTimer = getPause() / 1000;
  timeout = setTimeout(alertBTwork, getPause())
  }
function showSettings(){
  if(settings_opened.classList.contains('show')){
    settings_opened.classList.remove('show');
    settings_opened.style.display = 'none';
    settingsBtn.classList.remove('fa-chevron-left');
    settingsBtn.classList.add('fa-cog');
    content.classList.add('show');
    content.style.display = 'block';
  }else{
    settings_opened.style.display = 'block';
    settings_opened.classList.add('show');
    content.classList.remove('show');
    workTimeInput.value = workTimeMin;
    pauseTimeInput.value = pause;
    content.style.display = 'none';
    settingsBtn.classList.add('fa-chevron-left');
    settingsBtn.classList.remove('fa-cog');
    finishChangeTime();
  }
}

function finishChangeTime(){
  if(isRunning){
    isRunning=false;
    stopTimer();
  }
  newWorkTimeMin = workTimeInput.value;
  newPause = pauseTimeInput.value;
  if(newWorkTimeMin != null){
    workTimeMin = newWorkTimeMin;
  }
  if(newPause != null){
    pause = newPause;
  }
  mainButton.innerHTML = workTimeMin + ":00";
}

function stopTimer(){
  mainButton.innerHTML = workTimeMin + ":00";
  achieved.innerHTML = "STOPPED";
  clearTimeout(timeout);
  clearInterval(showInterval);
}


achieved.innerHTML = "STOPPED";
console.log("mainloaded");
