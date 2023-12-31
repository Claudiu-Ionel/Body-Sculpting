import { exercises } from "../data/data.js";
import {
  addToLocalStorage,
  addFromLocalStorageToExerciseList,
} from "./localStorage.js";
window.addEventListener("load", () => {
  // Check if there is data in localStorage
  const localStorageData = JSON.parse(
    window.localStorage.getItem("exerciseList")
  );
  // If there is data in the local storage add it to exercise list
  if (localStorageData) {
    for (const [key, value] of Object.entries(localStorageData)) {
      addFromLocalStorageToExerciseList(value, key);
    }
  }
  // Exercise list button
  const exerciseListButton = document.getElementById("exercise-list-button");
  // Exercise list close button
  const exerciseListCloseButton = document.getElementById(
    "close-exercise-list-button"
  );
  // Body view buttons
  const frontBodyViewButton = document.getElementById("front-body-button");
  const backBodyViewButton = document.getElementById("back-body-button");
  // Get the Object by ID
  const objectSVGBack = document.getElementById("body-svg-back");
  const objectSVGFront = document.getElementById("body-svg-front");
  // Make svg fade in
  objectSVGFront.style.opacity = "1";
  // Get the SVG document inside the Object tag
  const svgDocBack = objectSVGBack.contentDocument;
  const svgDocFront = objectSVGFront.contentDocument;
  // Body parts for SVG (back view)
  const svgGroupsBack = svgDocBack.getElementById("body-back").children;
  // Body parts for SVG (front view)
  const svgGroupsFront = svgDocFront.getElementById("body-front").children;
  // Group all body parts into an array
  const svgGroups = [...svgGroupsFront, ...svgGroupsBack];
  // mouseover stores the color of the hovered body part and mouseout event sets the color back to initial.
  let initialColor;
  // data variable for exercise list
  let exerciseListData = localStorageData || {};
  // Proxy for exercise list - used to create notification bubble in exercise list button
  let exerciseListDataProxy = new Proxy(exerciseListData, {
    get: function (obj, name) {
      console.log("read request to " + name + " property");
      return Reflect.get(obj[name]);
    },
    set: function (target, key, value) {
      // increase exercise number attribute - this makes the bubble show
      let attNumber = Number(
        exerciseListButton.getAttribute("data-exercisesNum")
      );
      exerciseListButton.setAttribute("data-exercisesNum", ++attNumber);

      // reflect changes to original object - exerciseListData
      return Reflect.set(...arguments);
    },
    hasProperty(target, key) {
      if (key[0] === "_") {
        return false;
      }
      return key in target;
    },
  });

  // event listeners added to body parts
  attachEventListeners(initialColor, svgGroups, exerciseListDataProxy);
  // event listeners added to body view buttons
  frontBodyViewButton.addEventListener("click", () => {
    objectSVGBack.style.visibility = "hidden";
    objectSVGFront.style.visibility = "visible";
    objectSVGFront.style.opacity = "1";
    objectSVGBack.style.opacity = "0";
    const localStorageData = window.localStorage.getItem("exerciseList");
    console.log(localStorageData);
  });
  backBodyViewButton.addEventListener("click", () => {
    objectSVGBack.style.visibility = "visible";
    objectSVGFront.style.visibility = "hidden";
    objectSVGBack.style.opacity = "1";
    objectSVGFront.style.opacity = "0";
    const localStorageData = window.localStorage.getItem("exerciseList");
    console.log(localStorageData);
  });
  // event listener added to exerciseListButton
  exerciseListButton.addEventListener("click", () => {
    // open - close exercise list
    toggleExerciseListOpen();
  });
  // event listener added to closeExerciseListButton
  exerciseListCloseButton.addEventListener("click", () => {
    // open - close exercise list
    toggleExerciseListOpen();
  });
});

function attachEventListeners(initialCol, svgG, exerciseListDataProxy) {
  for (let bodyPart of svgG) {
    // add color transition on body parts
    bodyPart.style.transition = "color 100ms ease-in";

    // lack of data for these body parts so skip them
    if (bodyPart.id === "hands-fingers-back") continue;
    if (bodyPart.id === "hands-fingers-front") continue;
    if (bodyPart.id === "head-front") continue;
    if (bodyPart.id === "head-back") continue;
    if (bodyPart.id === "legs-lower-back") continue;
    if (bodyPart.id === "legs-lower-front") continue;

    bodyPart.addEventListener("mouseover", () => {
      initialCol = bodyPart.style.color;
      mouseOver(bodyPart);
    });
    bodyPart.addEventListener("mouseout", () => {
      mouseOut(initialCol, bodyPart);
    });
    bodyPart.addEventListener("click", () => {
      // #d56370
      bodyPart.style.color = "#d56370";
      onClick(svgG, bodyPart, exerciseListDataProxy);
    });
  }
}

function mouseOver(bodyP) {
  const orange = "rgb(255, 195, 0)";
  const orangeLight = "rgb(255, 214, 10)";
  if (bodyP.style.color === orange) return;
  bodyP.style.color = orangeLight;
  bodyP.style.opacity = "1";
  bodyP.style.cursor = "pointer";
}
function mouseOut(initialRColor, bodyP) {
  let initC = "rgb(255, 195, 0)";
  return bodyP.style.color === initC
    ? initC
    : (bodyP.style.color = initialRColor);
}

function onClick(svgG, bodyP, exerciseListDataProxy) {
  const orange = "rgb(255, 195, 0)";
  // remove orange color from other body parts
  for (let group of svgG) {
    if (group.id !== bodyP.id) {
      let colorChange = "#8a8a8a";
      group.style.color = colorChange;
    } else {
      // set color to clicked body part
      group.style.color = orange;
    }
  }
  // Add data to the exercise section
  addDataToExerciseSection(bodyP, exerciseListDataProxy);

  // render message body
  renderMessageBuddy();
  // Make the window scroll down to the exercise section
  const exercisesSection = document.getElementById("exercises-wrapper");
  setTimeout(() => {
    exercisesSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 1200);
}

function renderMessageBuddy() {
  // possible messages for message div
  const messages = [
    { message: "Hell Yeah!", left: "5%" },
    { message: "Let's go!", left: "8%" },
    { message: "Pump it!", left: "8%" },
  ];
  // target message div
  const messageDiv = document.getElementById("buddy-message");
  //random number to target a message in array
  const randomNumber = Math.floor(Math.random() * messages.length);
  // set styling for message div
  messageDiv.style.opacity = 1;
  messageDiv.textContent = messages[randomNumber].message;
  messageDiv.style.left = messages[randomNumber].left;
  // make div disappear after 1s
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 1000);
}

function addDataToExerciseSection(bodyP, exerciseListDataProxy) {
  // get exercises from data.js
  let bodyPartData = exercises[bodyP.id];
  // Make exercise section visible
  const exercisesSection = document.getElementById("exercises-wrapper");
  exercisesSection.style.display = "flex";

  // Add data to the section
  let html = `
  <h2 class="muscle-group-title">${bodyPartData.title}</h2>
  <h3 class="muscle-group-description">${bodyPartData.description}</h3>
  <p class="muscle-group-funfact">${bodyPartData["fun-fact"]}<p>
  <h4>Exercises:</h4>  
  `;
  // Add videos tutorials
  for (const [key, value] of Object.entries(bodyPartData["exercises"])) {
    html += `<div class="iframe-wrapper">
    <h4>${value.title}</h4>
    <iframe width="560" height="315" src=${value.videoUrl} title="YouTube video player" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    <button class="add-exercise-button" data-exercise=${key}>Add Exercise</button>
    </div>
    `;
  }
  exercisesSection.innerHTML = html;

  const addExerciseButtons = document.getElementsByClassName(
    "add-exercise-button"
  );
  // add event listeners to add exercise buttons
  for (let button of addExerciseButtons) {
    let bodyPartD = bodyPartData;
    // Check if the exercise already exists in the exerciseListData - disable button
    if (button.getAttribute("data-exercise") in exerciseListDataProxy) {
      button.setAttribute("disabled", true);
    }
    button.addEventListener("click", (event) => {
      addExercise(event, bodyPartD, exerciseListDataProxy);
    });
  }
}

function addExercise(event, bodyPartData, exerciseList) {
  // on click disable button so that the exercise cannot be added again
  event.target.setAttribute("disabled", true);
  // the button has data-exercise attribute that has the same key name as in the data.js file
  const keyName = event.target.getAttribute("data-exercise");
  // set data to exerciseList object and proxy
  exerciseList[keyName] = { ...bodyPartData.exercises[keyName] };
  // render difficulty section
  addDifficultySection(bodyPartData.exercises[keyName], keyName);
}

function addDifficultySection(obj, keyName) {
  const title = obj.title;

  // add title and difficulty buttons
  // we attach name of exercise as id for parent div for buttons
  let exerciseListHtml = `<div class="exercise">
  <p>${title}</p>
  <div class="exercise-info flex-row" id=${keyName}>
  <div class="bubble" id=${keyName}-bubble>!</div>
  Difficulty: 
  <button class="difficulty-button easy" data-difficulty="easy" data-targetID=${keyName}>Easy</button>
  <button class="difficulty-button medium" data-difficulty="medium" data-targetID=${keyName}>Medium</button>
  <button class="difficulty-button hard" data-difficulty="hard" data-targetID=${keyName}>Hard</button>
  </div>
  </div>`;
  // add html to exercise list
  document.getElementById("exercise-list").innerHTML += exerciseListHtml;

  // targeting close button for exercise list again
  const exerciseListCloseButton = document.getElementById(
    "close-exercise-list-button"
  );
  // adding the click event listener again because we are removing it above by changing the html
  exerciseListCloseButton.addEventListener("click", toggleExerciseListOpen);

  // targeting difficulty buttons
  const difficultyButtons =
    document.getElementsByClassName("difficulty-button");

  // attaching click event listeners
  for (let button of difficultyButtons) {
    // buttons have data attribute that contains exercise name - parent id is the same
    let exerciseInfoId = button.getAttribute("data-targetID");
    let difficultyAttribute = button.getAttribute("data-difficulty");
    button.addEventListener("click", () => {
      //set difficulty in exerciseList object and proxy
      obj.difficulty = difficultyAttribute;
      // add data according to selected difficulty
      const dataAfterDifficulty = difficultyHandler(
        difficultyAttribute,
        obj,
        exerciseInfoId
      );
      // add data to local storage - key: exercise name , value: exercise data after difficulty set
      addToLocalStorage(exerciseInfoId, dataAfterDifficulty);
      // decrease number of exercises in bubble notification on exerciseListButton
      const exerciseListButton = document.getElementById(
        "exercise-list-button"
      );
      let attNumber =
        Number(exerciseListButton.getAttribute("data-exercisesNum")) - 1;
      exerciseListButton.setAttribute("data-exercisesNum", attNumber);
    });
  }
}

function difficultyHandler(difficulty, obj, keyName) {
  let percentage;
  if (difficulty === "easy") percentage = 50 / 100;
  if (difficulty === "medium") percentage = 100 / 100;
  if (difficulty === "hard") percentage = 150 / 100;

  const time = obj.time;
  const reps = obj.reps * percentage;
  const sets = obj.sets * percentage;
  const breaks = obj.breaks * obj.sets;
  // Create new html for exercise-info
  let html = `
  <span>Time:${obj.time}s per set</span>
  <span>Reps:${obj.reps * percentage} reps</span>
  <span>Sets:${obj.sets * percentage} </span>
  <span>Break:${obj.breaks * obj.sets}s</span>
  `;
  // change flex direction from row to column
  document.getElementById(keyName).classList.toggle("flex-row");
  // add new html
  document.getElementById(keyName).innerHTML = html;

  // return object to use in addToLocalStorage function - data after difficulty set
  return {
    title: keyName,
    time: time,
    reps: reps,
    sets: sets,
    breaks: breaks,
    difficulty: difficulty,
  };
}

function toggleExerciseListOpen() {
  const exerciseListElement = document.getElementById("exercise-list");
  exerciseListElement.classList.toggle("open");
}
