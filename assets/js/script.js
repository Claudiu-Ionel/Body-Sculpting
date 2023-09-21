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
  console.log(svgGroupsBack);
  const svgGroupsFront = svgDocFront.getElementById("body-front").children;
  const svgGroups = [...svgGroupsFront, ...svgGroupsBack];

  // mouseover stores the color of the hovered body part and mouseout event sets the color back to initial.
  let initialColor;

  // event listeners added to body parts
  attachEventListeners(initialColor, svgGroups);
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
  if (bodyP.style.color === "orange") return;
  bodyP.style.color = "#3a3a3a";
  bodyP.style.opacity = "1";
  bodyP.style.cursor = "pointer";
}
function mouseOut(initialRColor, bodyP) {
  let initC = "orange";
  return bodyP.style.color === initC
    ? initC
    : (bodyP.style.color = initialRColor);
}

function onClick(svgG, bodyP) {
  // Body parts functionality
  for (let group of svgG) {
    if (group.id !== bodyP.id) {
      let colorChange = "#8a8a8a";
      group.style.color = colorChange;
      // initialColor = colorChange;
    } else {
      group.style.color = "orange";
    }
  }
  // Add data to the exercise section
  addDataToExerciseSection(bodyP);

  // Make the window to scroll down to the exercise section
  const exercisesSection = document.getElementById("exercises-wrapper");
  exercisesSection.scrollIntoView({ behavior: "smooth", block: "end" });
}

function attachEventListeners(initialCol, svgG) {
  for (let bodyPart of svgG) {
    console.log(bodyPart.id);
    // add transition animation on body parts
    bodyPart.style.transition = "color 100ms ease-in";

    // skip adding event listeners to fingers
    if (bodyPart.id === "hands-fingers-back") continue;
    if (bodyPart.id === "hands-fingers-front") continue;
    bodyPart.addEventListener("mouseover", () => {
      initialCol = bodyPart.style.color;
      mouseOver(bodyPart);
    });
    bodyPart.addEventListener("mouseout", () => {
      mouseOut(initialCol, bodyPart);
    });
    bodyPart.addEventListener("click", () => {
      bodyPart.style.color = "orange";
      onClick(svgG, bodyPart);
    });
  }
}

function addDataToExerciseSection(bodyP) {
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
  exercisesSection.innerHTML = html;
}
