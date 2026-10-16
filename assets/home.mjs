const order = ["tinyml", "rlgym", "can"];
const names = { tinyml: "TinyML Deployer", rlgym: "Rylgam / RL Gym", can: "CAN Display" };
const layers = [...document.querySelectorAll("[data-project]")];
const selectors = [...document.querySelectorAll("[data-select-project]")];
function selectProject(id) {
  if (!order.includes(id)) return;
  const positions = [id, ...order.filter(key => key !== id)];
  for (const layer of layers) {
    const selected = layer.dataset.project === id;
    layer.dataset.position = ["front", "middle", "back"][positions.indexOf(layer.dataset.project)];
    layer.querySelector(".layer-content").inert = !selected;
  }
  for (const button of selectors) button.setAttribute("aria-pressed", String(button.dataset.selectProject === id));
  document.getElementById("project-announcement").textContent = names[id] + " is the foreground project.";
}
for (const button of selectors) button.addEventListener("click", () => selectProject(button.dataset.selectProject));
