window.addEventListener("load", (event) => {
  console.log("page is fully loaded");
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
    if (bodyPart.id === "hands-fingers") continue;
    bodyPart.addEventListener("mouseover", () => {
      initialColor = bodyPart.style.color;
      if (bodyPart.style.color === "orange") return;
      bodyPart.style.color = "#3a3a3a";
      bodyPart.style.opacity = "1";
      bodyPart.style.cursor = "pointer";
    });

    bodyPart.addEventListener("mouseout", () => {
      if (bodyPart.style.color === "orange") return;

      bodyPart.style.color = initialColor;
    });
    bodyPart.addEventListener("click", () => {
      bodyPart.style.color = "orange";

      for (let group of svgGroups) {
        if (group.id !== bodyPart.id) {
          let colorChange = "#8a8a8a";
          group.style.color = colorChange;
          initialColor = colorChange;
        } else {
          group.style.color = "orange";
        }
      }
    });
  }
});
