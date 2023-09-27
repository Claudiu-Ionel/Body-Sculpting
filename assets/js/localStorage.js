export function addToLocalStorage(key, value) {
  const localStorageData = window.localStorage.getItem("exerciseList");
  if (localStorageData) {
    const newObj = { ...JSON.parse(localStorageData) };
    newObj[key] = value;
    window.localStorage.setItem("exerciseList", JSON.stringify(newObj));
  }

  if (!localStorageData) {
    const newObj = {};
    newObj[key] = value;
    console.log(newObj);
    window.localStorage.setItem("exerciseList", JSON.stringify(newObj));
  }
}

// window.localStorage.clear();
// addToLocalStorage("Bench-Press", {
//   title: "Bench Press",
//   videoUrl: "https://www.youtube.com/embed/vthMCtgVtFw?si=rk92tcwultkjbSQI",
//   time: 60,
//   reps: 12,
//   sets: 2,
//   breaks: 60,
//   difficulty: null,
// });

export function addFromLocalStorageToExerciseList(obj, keyName) {
  const title = obj.title.replace("-", " ");
  let html = `
    <div class="exercise">
    <p>${title}</p>
    <div class="exercise-info" id=${keyName}>
  <span>Time:${obj.time}s per set</span>
  <span>Reps:${obj.reps} reps</span>
  <span>Sets:${obj.sets} </span>
  <span>Break:${obj.breaks}s</span>
  </div>
  </div>`;
  // add new html
  document.getElementById("exercise-list").innerHTML += html;
}
