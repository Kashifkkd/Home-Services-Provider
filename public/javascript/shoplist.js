const mainContainer = document.getElementsByClassName('shoplist')[0];

console.log(username,city,area,service);

async function getNearbyShops() {
    const getShops = await fetch(`http://localhost:4000/nearby-shops`, {
        method: 'POST',
        body: JSON.stringify({ city, area, service }),
        headers: { 'Content-Type': 'application/json'}
    });

    const res = await getShops.json();

    Object.values(res).forEach(value => {
        

        let cartRow = document.createElement('div');
        cartRow.classList.add('shops');

        Object.values(value.category).forEach(cat => {

            if(Object.keys(cat).some(key => key === service)){

                let cartRowContents = `
                    <a class='temp' href="/${username}/${value.shopName}/${service}/${value._id}/${cat[service]}/details">${value.shopName}</a>
                    <p id='temp2' style="display:inline-block">${service}</p>
                    <p id='temp3' style="display:inline-block">Price : ${cat[service]}</p>
                    <p id='temp4' style="display:inline-block">Ratings : ${value.rating}/5 </p>
                    <img src="/elec5.jpeg" id='a1' alt="shop image">
                `

                // const img = document.createElement("img");

                cartRow.innerHTML = cartRowContents;

                console.log(value.shopName);
                mainContainer.append(cartRow);
                
            } else{
                console.log(cat,'Not present')
            }
            
        })

        // let price;

        // let cartRowContents = `
        //         <a class='temp' href="/${value.shopName}/${service}/${value._id}/details">${value.shopName}</a>
        //         <p id='temp2'>${value.category}</p>
                
        // `

        // cartRow.innerHTML = cartRowContents;

        // console.log(value.shopName);
        // mainContainer.append(cartRow);
    });

    // loadShops();
};

getNearbyShops();

// async function loadShops() {
//     const shopListItem = Array.from(mainContainer.getElementsByClassName('shops'));
//     console.log(shopListItem)

//     shopListItem.forEach((element,i) => {
//         element.addEventListener('click', () => {
//             console.log('Full detail: ',element);
//             const shopName = document.getElementsByClassName('temp')[i];
//             console.log('Shop Name:', shopName.innerText);
//             location.assign('/shopName/${service}/details');
//         })
//     })
// }

// loadShops();

