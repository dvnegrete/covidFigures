const URLCovid = "https://covid-api.mmediagroup.fr/v1";
const URLCountry = "https://raw.githubusercontent.com/M-Media-Group/country-json/master/src/countries-master.json";
const nodeShowCountries = document.getElementById("selectCountry");

const getDataCovid = async (abName)=> {    
    const vaccines = `/vaccines?ab=${abName}`;
    //const deaths = `/history?status=deaths&ab=${abName}`;
    try {
        const res = await fetch(URLCovid + vaccines)
        //const res2 = await fetch(URLCovid + deaths)
        const resVaccines = await res.json();
        //const resDeaths = await res2.json();        
        const nameCountry = resVaccines.All.country;
        const peopleVaccinated = resVaccines.All.people_vaccinated;
        const partiallyVaccinated= resVaccines.All.people_partially_vaccinated;
        const resultVaccines = {
            country: nameCountry,
            people: peopleVaccinated,
            partial: partiallyVaccinated
        };
        return resultVaccines;
    } catch {   
        console.log("Error en la consulta API");
    }
}

function showCountries(countryList, abbreviationList) {
    let containerCountriesShow = [];    
    const totalCountries = countryList.length;
    for (let i = 0; i < totalCountries; i++) {
        const country = countryList[i];
        const abName = abbreviationList[i];
        if (abName != undefined) {            
            const labelCheckbox = document.createElement("label");
            labelCheckbox.textContent = country;
            
            const inputCheckbox = document.createElement("input");
            inputCheckbox.type = "radio";
            //inputCheckbox.dataset.abbreviation = abName;
            inputCheckbox.id = abName;
            labelCheckbox.appendChild(inputCheckbox);
            
            containerCountriesShow.push(labelCheckbox);
        }
    }
    nodeShowCountries.append(...containerCountriesShow);    
}

async function showCovidInformation(event) {
    //consulta a la api. Parametro ID    
    //const countryName = event.dataset.abbreviation;
    const nodeIdName = event.id;
    const infoVaccines = await getDataCovid(nodeIdName);
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
            showCovidInformation(event);
        });
    } catch {   
        console.log("error en algun lado");
    }
}
getCountry();