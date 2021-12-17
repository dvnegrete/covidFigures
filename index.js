const URLCovid = "https://covid-api.mmediagroup.fr/v1";
const URLCountry = "https://raw.githubusercontent.com/M-Media-Group/country-json/master/src/countries-master.json";
const nodeShowCountries = document.getElementById("selectCountry");
//const nodeTransition = document.getElementById("transition");
const nodeButtonResult = document.getElementById("buttonResult");
const nodeShowResult = document.querySelector("#showResult");
const buttonNav =document.querySelector("#menu");
const nodeNav = document.getElementById("nav");

function percentage (total, dataToCalculate) {
    const percentageResult = (dataToCalculate * 100) / total;
    return percentageResult;
}

function calculateProportion(date) {    
    const notVaccinated = date.population - date.people - date.partial;    
    const percentageVaccinated = percentage(date.population, date.people);    
    const percentagePartial = percentage(date.population, date.partial);    
    const percentageNotVaccinated = percentage(date.population, notVaccinated);    
    const calculatedPercentage = {
        notPercentage : percentageNotVaccinated,
        notNumber: notVaccinated,
        partialPercentage : percentagePartial,
        vaccinesPercentage : percentageVaccinated
    }
    if (notVaccinated <= 0) {
        calculatedPercentage.notNumber =
        `La vacunacion en ${date.country} es alta. Su vacunación excede al total de su población.`;
    }
    return calculatedPercentage;
}

const getDataCovid = async (arrayAbCountry)=> {
    const vaccines = `/vaccines?ab=${arrayAbCountry[0]}`;
    //const deaths = `/history?status=deaths&ab=${arrayAbCountry[0]}`;
    try {
        const res = await fetch(URLCovid + vaccines)
        //const res2 = await fetch(URLCovid + deaths)
        const resVaccines = await res.json();
        //const resDeaths = await res2.json();
        console.log(resVaccines);        
        const nameCountry = resVaccines.All.country;
        const peopleVaccinated = resVaccines.All.people_vaccinated;
        const partiallyVaccinated= resVaccines.All.people_partially_vaccinated;
        const totalPopulation = resVaccines.All.population;
        const resultVaccines = {
            country: nameCountry,
            people: peopleVaccinated,
            partial: partiallyVaccinated,
            population: totalPopulation
        };
        const vaccinationPercentage = calculateProportion(resultVaccines);
        const totalVaccinationDataCountry = {
            ...resultVaccines, ...vaccinationPercentage
        }
        showResult(totalVaccinationDataCountry);        
    } catch {
        const queryFailed = {
            country: arrayAbCountry[1],
            notNumber: "Lo sentimos, hubo un error al realizar la consulta",
            notPercentage: -1,
            vaccinesPercentage: 0,
            partialPercentage: 0
        }        
        //usammos logica para mostrar resultados, para mostrar un error en la consulta
        showResult(queryFailed);
        console.log("Error en la consulta a: " + URLCovid);
    }
}

function showHideElements (node, styleClass) {    
    node.classList.toggle(styleClass)
}

function showCountries(countryList, abbreviationList) {
    let containerCountriesShow = [];    
    const totalCountries = countryList.length;
    for (let i = 0; i < totalCountries; i++) {
        const country = countryList[i];
        const arrayAbCountry = abbreviationList[i];
        if (arrayAbCountry != undefined) {            
            const labelCheckbox = document.createElement("label");
            labelCheckbox.className= "main__label";
            labelCheckbox.textContent = country;
            
            const inputCheckbox = document.createElement("input");
            inputCheckbox.className = "main__label--input";
            inputCheckbox.type = "radio";
            inputCheckbox.dataset.country = countryList[i];
            inputCheckbox.id = arrayAbCountry;
            labelCheckbox.appendChild(inputCheckbox);
            
            containerCountriesShow.push(labelCheckbox);
        }
    }
    nodeShowCountries.append(...containerCountriesShow);
}

function showResult (vaccinesObject) {
    console.log(vaccinesObject)
    const countryP = document.createElement("p");
    const countryName = document.createTextNode(vaccinesObject.country);
    countryP.appendChild(countryName);

    const peopleP = document.createElement("p");
    const datePeople = vaccinesObject.vaccinesPercentage;
    peopleP.textContent = `Personas vacunadas completamente: ${datePeople.toFixed(2)}`;
    peopleP.className = "section__result__container--percentage";

    const partialP = document.createElement("p");
    const datePartial = vaccinesObject.partialPercentage;
    partialP.textContent = `Personas vacunadas de forma parcial: ${datePartial.toFixed(2)}`;
    partialP.className = "section__result__container--percentage";
    const notVaccinesP = document.createElement("p");
    if (vaccinesObject.notPercentage <= 0) {
        notVaccinesP.textContent = `${vaccinesObject.notNumber}`;
        notVaccinesP.className = "section__result__container--high";
    } else {
        const dateNotVaccines = vaccinesObject.notPercentage;
        notVaccinesP.textContent = `Población sin Vacunar: ${dateNotVaccines.toFixed(2)}`;
        notVaccinesP.className = "section__result__container--percentage";
    }

    const containerResult = document.createElement("div");
    containerResult.className = "section__result__container"
    containerResult.append(countryP, peopleP, partialP, notVaccinesP);
    nodeShowResult.append(containerResult);
    //showHideElements(nodeTransition, "div__transition--show");
    showHideElements(nodeButtonResult, "button")
}

async function showCovidInformation(event) {
    //consulta a la api. Parametro ID    
    //const countryName = event.dataset.country;    
    const countryArray = [event.id, event.dataset.country];
    ()=> window.scrollTo(0,50);
    const infoVaccines = await getDataCovid(countryArray);
    console.log(infoVaccines);
}

//consulta API para identificar su abreviatura
const getCountry = async ()=> {
    try {
        const res = await fetch(URLCountry)
        const allTheCountries = await res.json();
        const nameCountries = allTheCountries.map(list => list.country);
        const abCountries = allTheCountries.map(list => list.abbreviation);   
        showCountries(nameCountries, abCountries);
        nodeShowCountries.addEventListener("click", (e) => {
            const event = e.target;
            showHideElements(nodeShowCountries, "main__hide");
            //showHideElements(nodeTransition, "div__transition--show");            
            showCovidInformation(event);
        });
    } catch {   
        console.log("Error al hacer la consulta en los nombres de los paises");
    }
}

function mainShow() {
    showHideElements(nodeShowCountries, "main__hide");
    showHideElements(nodeButtonResult, "button");
}
buttonNav.addEventListener("click", ()=> {    
    showHideElements(nodeNav, "nav");
});
getCountry();