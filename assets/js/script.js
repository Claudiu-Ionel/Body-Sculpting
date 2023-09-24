import { exercises } from "../data/data.js";

window.addEventListener("load", () => {
  const frontBodyViewButton = document.getElementById("front-body-button");
  const backBodyViewButton = document.getElementById("back-body-button");
  // Get the Object by ID
  const objectSVGBack = document.getElementById("body-svg-back");
  const objectSVGFront = document.getElementById("body-svg-front");
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
  let exerciseListData = {
    "Crescent-Tucks": {},
  };
  var exerciseListDataProxy = new Proxy(exerciseListData, {
    get: function (obj, name) {
      console.log("read request to " + name + " property");
      if (obj.hasOwnProperty(name)) return obj[name];
      else return false;
    },
    set: function (obj, name, value) {
      if (obj.hasOwnProperty(name)) return;
      obj[name] = value;
      console.log(
        `set request to exerciseListData with key: ${name} value:`,
        value
      );
    },
    hasProperty(target, key) {
      if (key[0] === "_") {
        return false;
      }
      return key in target;
    },
  });

  // event listeners added to body parts
  attachEventListeners(initialColor, svgGroups, exerciseListData);
  // event listeners added to body view buttons
  frontBodyViewButton.addEventListener("click", () => {
    objectSVGBack.style.visibility = "hidden";
    objectSVGFront.style.visibility = "visible";
    objectSVGFront.style.opacity = "1";
  });
  backBodyViewButton.addEventListener("click", () => {
    objectSVGBack.style.visibility = "visible";
    objectSVGFront.style.visibility = "hidden";
    objectSVGBack.style.opacity = "1";
  });
});

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

  // Make the window scroll down to the exercise section
  const exercisesSection = document.getElementById("exercises-wrapper");
  exercisesSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function attachEventListeners(initialCol, svgG, exerciseListDataProxy) {
  for (let bodyPart of svgG) {
    // add transition animation on body parts
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
      bodyPart.style.color = "rgb(255, 195, 0)";
      onClick(svgG, bodyPart, exerciseListDataProxy);
    });
  }
}

function addDataToExerciseSection(bodyP, exerciseListDataProxy) {
  let bodyPartData = exercises[bodyP.id];
  // Make exercise section visible
  const exercisesSection = document.getElementById("exercises-wrapper");
  exercisesSection.style.display = "flex";

  // Add data to the section

  let html = `
  <h2>${bodyPartData.title}</h2>
  <h3>${bodyPartData.description}</h3>
  <p>${bodyPartData["fun-fact"]}<p>
  <h4>Exercises: </h4>

  `;

  // Add videos tutorials
  for (const [key, value] of Object.entries(bodyPartData["exercises"])) {
    html += `<h5>${value.title}</h5>
    <iframe width="560" height="315" src=${value.videoUrl} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
    <button class="add-exercise-button" data-exercise=${key}>Add Exercise</button>
    `;
  }
  exercisesSection.innerHTML = html;

  const addExerciseButtons = document.getElementsByClassName(
    "add-exercise-button"
  );
  // add event listeners to add exercise buttons
  for (let button of addExerciseButtons) {
    let bodyPartD = bodyPartData;
    let exerciseList = exerciseListDataProxy;
    // Check if the exercise already exists in the exerciseListData - disable button
    if (button.getAttribute("data-exercise") in exerciseList) {
      button.setAttribute("disabled", true);
    }
    button.addEventListener("click", (event) => {
      addExercise(event, bodyPartD, exerciseList);
    });
  }
}

function addExercise(event, bodyPartData, exerciseList) {
  // on click disable button so that the exercise cannot be added again
  event.target.setAttribute("disabled", true);
  // the button has data-exercise attribute that has the same key name as in the data.js file
  const keyName = event.target.getAttribute("data-exercise");
  // set data to exerciseList object and proxy
  exerciseList[keyName] = bodyPartData.exercises[keyName];
  // add html to exercise list section
  let exerciseListHtml = `<div>${exerciseList[keyName].title}</div>`;

  document.getElementById("exercise-list").innerHTML += exerciseListHtml;
}
