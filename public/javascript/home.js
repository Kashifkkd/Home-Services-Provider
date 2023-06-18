const citySelect = document.querySelector('[id="cityname"]');
const selectCityError = document.getElementById('select-city-error');
const detectLocationCursor = document.getElementById('detect-location');
const streetNameInput = document.getElementById('street-name');
const locationLoadingGIF = document.getElementById('location-loading');
const areaNameInput = document.getElementById('area-name');
const areaNameAutofill = document.getElementsByClassName('area-name-autofill');
const areaName = document.getElementsByClassName('area-name-autofill')[0];

selectCityError.textContent = '';
let city = '';
let area = '';

citySelect.addEventListener('change', (e) => {
    selectCityError.textContent = ''
    const select = e.target;
    const value = select.value;
    city = select.selectedOptions[0].text;
    console.log(city);

    if(city == 'Select City'){
        selectCityError.textContent = 'Please select your city'
    }

    let str=''; 

    let Dapoli = new Array('Kalkai Kond', 'Khonda', 'Family-Mall', 'Jalgoan', 'Patwardan Road');
    let Khed = new Array('Bharna Naka', 'Tambe Mohalla', 'Golibaar Maidan');
    let Chiplun = new Array('Shivaji Chowk', 'Chincha Naka','Bahadur Shaikh', 'Golkot Road');
    let Mumbai = new Array('Mumbra', 'Dongri', 'Vashi', 'CST', 'Nerul');

    let allCities = {
        Dapoli, 
        Khed,
        Chiplun,
        Mumbai,
    }
    console.log(allCities)

    for (var i=0; i < allCities[city].length;++i){
        str += '<option value="'+allCities[city][i]+'" />'; 
    }
    let my_list=document.getElementById("area-name");
    my_list.innerHTML = str;

});

detectLocationCursor.addEventListener('click', async () => {
    if(city == 'Select City' || city == ''){
        selectCityError.textContent = 'Please select your city'
    } else{
        console.log('clicked');
        navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
            enableHighAccuracy: true
        })   
        locationLoadingGIF.style.display = 'block';
    }
});

async function successLocation(position) {
    const userLocation = position.coords;
    let longitude = userLocation.longitude;
    let latitude = userLocation.latitude;
    console.log(longitude,latitude);

    const resPOST = await fetch(`http://localhost:4000/userdata/${user}`);

    const getLocation = await fetch('http://localhost:4000/get-location', {
        method: 'POST',
        body: JSON.stringify({user,city,longitude,latitude}),
        headers: { 'Content-Type' : 'application/json' },
    });

    const result = await getLocation.json();
    console.log('Address:', result);

    locationLoadingGIF.style.display = 'none'; 
    areaNameAutofill[0].value = result;

    console.log(areaNameAutofill);

    const nearbyServices = await fetch('http://localhost:4000/nearby-services', {
        method: 'POST',
        body: JSON.stringify({user,city,longitude,latitude}),
        headers: { 'Content-Type' : 'application/json' },
    });

    const res = await nearbyServices.json();
    console.log(res);
}

function errorLocation(position) {
    console.log(position);
    console.log("Location not found");
    locationError.textContent = 'Location not found';
}

function reply_click(service){
    console.log(service);
    console.log(city);
    console.log(areaName.value);
    area = areaName.value;
    const fullSentence = service.split('|')
    const username = fullSentence[0]
    const ser= fullSentence[1]
    console.log('Username:',username);
    console.log('Service:',ser);

    window.location = `${username}/${city}/${area}/${ser}/shop-list`
}
