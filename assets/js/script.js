import { exercises } from "../data/data.js";

window.addEventListener("load", () => {
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
  // Get the back side of the body svg;
  const svgGroupsBack = svgDocBack.getElementById("body-back").children;

  const svgGroupsFront = svgDocFront.getElementById("body-front").children;
  const svgGroups = [...svgGroupsFront, ...svgGroupsBack];

  // mouseover stores the color of the hovered body part and mouseout event sets the color back to initial.
  let initialColor;

  // data variable for exercise list
  let exerciseListData = {};
  let exerciseListDataProxy = new Proxy(exerciseListData, {
    get: function (obj, name) {
      console.log("read request to " + name + " property");
      return Reflect.get(obj[name]);
    },
    set: function (target, key, value) {
      console.log(
        `set request to exerciseListData with key: ${key} value:`,
        value
      );
      let attNumber = Number(
        exerciseListButton.getAttribute("data-exercisesNum")
      );
      exerciseListButton.setAttribute("data-exercisesNum", ++attNumber);

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
  });
  backBodyViewButton.addEventListener("click", () => {
    objectSVGBack.style.visibility = "visible";
    objectSVGFront.style.visibility = "hidden";
    objectSVGBack.style.opacity = "1";
    objectSVGFront.style.opacity = "0";
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

function toggleExerciseListOpen() {
  const exerciseListElement = document.getElementById("exercise-list");
  exerciseListElement.classList.toggle("open");
}

function attachEventListeners(initialCol, svgG, exerciseListDataProxy) {
  for (let bodyPart of svgG) {
    // add color transition on body parts
    bodyPart.style.transition = "color 100ms ease-in";

    // skip adding event listeners to some body parts - fingers / neck muscles / lower leg muscles
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
  if (bodyP.style.color === "rgb(255, 195, 0)") return;
  bodyP.style.color = "rgb(255, 214, 10)";
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
  // Body parts functionality
  for (let group of svgG) {
    if (group.id !== bodyP.id) {
      let colorChange = "#8a8a8a";
      group.style.color = colorChange;
      // initialColor = colorChange;
    } else {
      group.style.color = "rgb(255, 195, 0)";
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
  ];
  // target message div
  const message = document.getElementById("buddy-message");
  //random number to target a message
  const randomNumber = Math.floor(Math.random() * messages.length);
  // set styling for message div
  message.style.opacity = 1;
  message.textContent = messages[randomNumber].message;
  message.style.left = messages[randomNumber].left;
  // make div disappear after 1s
  setTimeout(() => {
    message.style.opacity = 0;
  }, 1000);
}

function addDataToExerciseSection(bodyP, exerciseListDataProxy) {
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

  addDifficultySection(bodyPartData.exercises[keyName], keyName);
}

function addDifficultySection(obj, keyName) {
  const title = obj.title;

  // add title and difficulty buttons
  let exerciseListHtml = `<div class="exercise">
  <p>${title}</p>
  <div class="exercise-info" id=${keyName}>
  <div class="bubble" id=${keyName}-bubble>!</div>
  Difficulty: 
  <button class="difficulty-button easy" data-difficulty="easy" data-targetID=${keyName}>Easy</button>
  <button class="difficulty-button medium" data-difficulty="medium" data-targetID=${keyName}>Medium</button>
  <button class="difficulty-button hard" data-difficulty="hard" data-targetID=${keyName}>Hard</button>
  </div>
  </div>`;
  document.getElementById("exercise-list").innerHTML += exerciseListHtml;
  const difficultyButtons =
    document.getElementsByClassName("difficulty-button");
  for (let button of difficultyButtons) {
    let exerciseInfoId = button.getAttribute("data-targetID");
    let difficultyAttribute = button.getAttribute("data-difficulty");
    button.addEventListener("click", () => {
      //set difficulty in exerciseList object and proxy
      obj.difficulty = difficultyAttribute;
      // add data according to selected difficulty
      difficultyHandler(difficultyAttribute, obj, exerciseInfoId);

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
  console.log(percentage);
  let html = `
  <span>Time:${obj.time}s per set</span>
  <span>Reps:${obj.reps * percentage} reps</span>
  <span>Sets:${obj.sets * percentage} </span>
  <span>Break:${obj.breaks * obj.sets}s</span>
  `;
  document.getElementById(keyName).innerHTML = html;
}
