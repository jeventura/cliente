const playInTeamCheckbox = document.getElementById("playInTeam");
const teamOptions = document.getElementById("teamOptions");

const createTeamBtn = document.getElementById("createTeamBtn");
const joinTeamBtn = document.getElementById("joinTeamBtn");

const createTeamFields = document.getElementById("createTeamFields");
const joinTeamFields = document.getElementById("joinTeamFields");

playInTeamCheckbox.addEventListener("change", () => {
  if (playInTeamCheckbox.checked) {
    teamOptions.style.display = "block";
  } else {
    teamOptions.style.display = "none";
    // Reset selección de team
    createTeamBtn.classList.remove("active");
    joinTeamBtn.classList.remove("active");
    createTeamFields.classList.remove("active");
    joinTeamFields.classList.remove("active");
    document.getElementById("teamNameCreate").value = "";
    document.getElementById("teamNameJoin").value = "";
  }
});

createTeamBtn.addEventListener("click", () => {
  createTeamBtn.classList.add("active");
  joinTeamBtn.classList.remove("active");

  createTeamFields.classList.add("active");
  joinTeamFields.classList.remove("active");
  document.getElementById("teamNameJoin").value = "";
});

joinTeamBtn.addEventListener("click", () => {
  joinTeamBtn.classList.add("active");
  createTeamBtn.classList.remove("active");

  joinTeamFields.classList.add("active");
  createTeamFields.classList.remove("active");
  document.getElementById("teamNameCreate").value = "";
});

// Submit del formulario (demo)
document.getElementById("playerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  console.log("Player data:", data);

  // Aquí luego puedes reemplazar esto por un fetch hacia tu backend
  alert("Registro completado (demo). Aquí conectaríamos con el backend.");

  // Ejemplo de redirección:
  // window.location.href = "/challenges/index.html";
});
