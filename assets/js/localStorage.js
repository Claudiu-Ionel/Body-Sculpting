export function addToLocalStorage(key, value) {
  const localStorageData = window.localStorage.getItem("exerciseList");
  // if there is data in local storage add on top of it
  if (localStorageData) {
    const newObj = { ...JSON.parse(localStorageData) };
    newObj[key] = value;
    window.localStorage.setItem("exerciseList", JSON.stringify(newObj));
  }
  // if there is no data in local storage set it
  if (!localStorageData) {
    const newObj = {};
    newObj[key] = value;
    console.log(newObj);
    window.localStorage.setItem("exerciseList", JSON.stringify(newObj));
  }
}

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
