function getRandomHEX(length){
    const charMap = "0123456789ABCDEF";

    let color = "";

    for(let i = 0;i < length;i++){
        color += charMap[Math.floor(Math.random() * 16)];
    }

    return color;
}

function getHEX(index){
	let HEXColors = [
		"ff1111","11ff11","1111ff","ff11ff","ffff11",
		"ff1166","11ff66","11ffff","4411ff","1166ff",
	];

	return HEXColors[index];
}

function editScheme(){
	schemesCore.style.display = "inline-block";

	let newColor;

	for(var i = 0;i < 10;i++){
		newColor = document.createElement("div");

		newColor.classList.add("color");
		newColor.style.background = `#${getHEX(i)}`;

		schemesCoreContainer.appendChild(newColor);
	}
}

editScheme();