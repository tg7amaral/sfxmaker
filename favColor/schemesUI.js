let newSchemeButton = document.querySelector("#newScheme");
let schemesContainer = document.querySelector("#schemesContainer");

let schemesCore = document.querySelector("#schemesCore");
let schemesCoreContainer = document.querySelector("#schemesCoreContainer");

let schemes = [];

function updateSchemes(){
	schemesContainer.innerHTML = "";

	let newElement;

	for(var scheme of schemes){
		newElement = document.createElement("div");

		newElement.classList.add("scheme");
		newElement.innerText = scheme.name;

		schemesContainer.appendChild(newElement);
	}
}

newSchemeButton.addEventListener("click",function(){
	schemes.push({name:"..."})

	updateSchemes();
})