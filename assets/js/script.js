window.addEventListener("load", () => {
  // Get the Object by ID
  const objectSVG = document.getElementById("body-svg");
  objectSVG.style.opacity = "1";
  // Get the SVG document inside the Object tag
  const svgDoc = objectSVG.contentDocument;
  // Get the back side of the body svg;
  const svgGroups = svgDoc.getElementById("body-back").children;

  // mouseover stores the color of the hovered body part and mouseout event sets the color back to initial.
  let initialColor;

  // event listeners added to body parts
  for (let bodyPart of svgGroups) {
    // add transition animation on body parts
    bodyPart.style.transition = "color 100ms ease-in";

    // skip adding event listeners to fingers
    if (bodyPart.id === "hands-fingers") continue;

    bodyPart.addEventListener("mouseover", () => {
      initialColor = bodyPart.style.color;
      mouseOver(bodyPart);
    });
    bodyPart.addEventListener("mouseout", () => {
      mouseOut(initialColor, bodyPart);
    });
    bodyPart.addEventListener("click", () => {
      bodyPart.style.color = "orange";
      onClick(svgGroups, bodyPart);
    });
  }
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
  for (let group of svgG) {
    if (group.id !== bodyP.id) {
      let colorChange = "#8a8a8a";
      group.style.color = colorChange;
      initialColor = colorChange;
    } else {
      group.style.color = "orange";
    }
  }
}
