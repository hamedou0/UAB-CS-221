window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {
    // TODO: Complete the function
    const cInput = document.getElementById("cInput");
    const fInput = document.getElementById("fInput");
    const convertButton = document.getElementById("convertButton");
    const errorMessage = document.getElementById("errorMessage");
    const weatherImage = document.getElementById("weatherImage");

    convertButton.addEventListener("click", function() {
        if (cInput.value !== "") {
            const celsius = parseFloat(cInput.value);

            if (isNaN(celsius)) {
                errorMessage.textContent = cInput.value + " is not a number";
                return;
            }

            fInput.value = convertCtoF(celsius);
            errorMessage.textContent = "";
            updateImage(convertCtoF(celsius));
        }
        else if (fInput.value !== "") {
            const fahrenheit = parseFloat(fInput.value);

            if (isNaN(fahrenheit)) {
                errorMessage.textContent = fInput.value + " is not a number";
                return;
            }

            cInput.value = convertFtoC(fahrenheit);
            errorMessage.textContent = "";
            updateImage(fahrenheit);
        }
    });

    cInput.addEventListener("input", function() {
        if (cInput.value !== "") {
            fInput.value = "";
        }
    });

    fInput.addEventListener("input", function() {
        if (fInput.value !== "") {
            cInput.value = "";
        }
    });

    function updateImage(fahrenheit) {
        if (fahrenheit < 32) {
            weatherImage.src = "images/cold.png";
        }
        else if (fahrenheit <= 50) {
            weatherImage.src = "images/cool.png";
        }
        else {
            weatherImage.src = "images/warm.png";
        }
    }
}

function convertCtoF(degreesCelsius) {
    // TODO: Complete the function
    return degreesCelsius * 9 / 5 + 32;
}

function convertFtoC(degreesFahrenheit) {
    // TODO: Complete the function
    return (degreesFahrenheit - 32) * 5 / 9;
}