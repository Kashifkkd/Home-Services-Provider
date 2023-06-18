const form = document.querySelector('form');
const addressForm = document.getElementById('addAddress')
const otpForm = document.getElementById('otp-form')
const firstNameError = document.querySelector('.fname-error');
const lastNameError = document.querySelector('.lname-error');
const genderError = document.querySelector('.gender-error');
const emailError = document.querySelector('.email-error');
const mobileNumberError = document.querySelector('.mobileNo-error');
const profile = document.getElementById('profile');
const addressInfomation = document.getElementById('addressInfomation');
const myProfile = document.getElementById('myProfile');
const submitButton = document.getElementById('submit-button');
const editButton = document.getElementById('edit-button');
const radios = document.getElementsByName('contact');
const verifyButton = document.getElementById('verify-button');
const verifyMail = document.getElementById('verify-email-button');
const emailSended = document.querySelector('.msg-sended');
const verifyEmailIcon = document.getElementById('verify-email-icon');
const verifyNumberIcon = document.getElementById('verify-number-icon');
const countdownDiv = document.getElementById('countdown');
const countdownTimer = document.getElementById('otp-timer');
const resendOTP = document.getElementById('resend-otp');
const address = document.getElementById('address');
const addAddress = document.getElementById('add-address-form');
const cancelButton = document.getElementById('cancel-button');

console.log(verifyEmailIcon)

console.log('Number verified:',verifiedNumberFlag,typeof verifiedNumberFlag)
console.log('Email verified:',verifiedEmailFlag, typeof verifiedEmailFlag)

let flag = true;
let enableRedirect = true;

if(verifiedNumberFlag){
    verifyNumberIcon.style.display = 'block';
} else{
    verifyNumberIcon.style.display = 'none';
}

if(verifiedEmailFlag){
    verifyEmailIcon.style.display = 'block';
} else{
    verifyEmailIcon.style.display = 'none';
}

defaultBlock();
checkGender();

myProfile.addEventListener('click', (e)=> {
    e.preventDefault();
    console.log('clicked')        
    profile.style.display = 'block'
    addressInfomation.classList.remove("active");
    myProfile.classList.add("active");

    firstNameError.textContent = '';
    lastNameError.textContent = '';
    genderError.textContent = '';
    mobileNumberError.textContent = '';

    address.style.display = 'none';
})

addressInfomation.addEventListener('click', (e)=> {
    e.preventDefault();
    console.log('clicked')
    if(profile.style.display = 'block' && enableRedirect){
        profile.style.display = 'none'
        myProfile.classList.remove("active");
        // addressInfomation.className = "active";
        addressInfomation.classList.add("active");
        console.log('block')
    };

    submitButton.style.display = 'none';
    editButton.style.display = 'block';
    defaultBlock();

    address.style.display = 'block';
})


editButton.addEventListener('click',  (e) => {
    
    defaultAllowed();

    submitButton.style.display = 'block';
    addressInfomation.style.cursor = 'not-allowed';
    editButton.style.display = 'none';

    checkVerfiedEmail();
    checkVerfiedNumber();

    enableRedirect = false;

    console.log(verifyButton)

    verifyButton.addEventListener('click', mobileNumberVerification);
    

    verifyMail.addEventListener('click', emailVerification);

})

addressForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log('Saved');

    let hName = addressForm.add1.value;
    let streetName = addressForm.add2.value;
    let areaName = addressForm.add3.value;
    let cityName = addressForm.add4.value;

    // var sn = document.getElementById("add5");
    // var value = sn.options[sn.selectedIndex].value;
    // var stateName = sn.options[sn.selectedIndex].text;

    let ab = document.getElementById("add5");
    let value = ab.value;
    let stateName = ab.options[ab.selectedIndex].text;

    // let stateName = addressForm.add5.value;
    // let username = <%= username %>;

    console.log(hName,streetName, areaName, cityName, stateName, username);

    try {
        if(hName && streetName && areaName && cityName){
            const res2 = await fetch('/username/profile', {
                method: 'POST',
                body: JSON.stringify({ username, hName, streetName, areaName, cityName, stateName}),
                headers: { 'Content-Type' : 'application/json' },
            })
            console.log(res2);
            addressForm.style.display = 'none';
            window.location.reload();
        }
    } catch(err) {
        console.log(err)
    }
})

cancelButton.addEventListener('click', () =>{
    addressForm.style.display = 'none';
    cancelButton.style.display = 'none';
})

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log('saved..')

    let firstName = form.fname.value;
    let lastName = form.lname.value;
    let gender = getRadioButtonValue();
    let email = form.email.value;
    let mobileNumber = form.mobileNo.value;

    firstNameError.textContent = '';
    lastNameError.textContent = '';
    genderError.textContent = '';
    emailError.textContent = '';
    mobileNumberError.textContent = '';
    
    let fNameCheck = checkEmptyValues(firstName,firstNameError,'first name');
    let lNameCheck = checkEmptyValues(lastName,lastNameError,'last name');

    if(flag){
        genderError.textContent = 'Please select gender';
    }

    let numberCheck = checkEmptyValues(mobileNumber,mobileNumberError,'mobile number');
    let emailCheck = validateEmail(email);
    if(!emailCheck){
        emailError.textContent = 'Please enter valid email';
    }
    let validNumberCheck;
    if(mobileNumber != ""){
        validNumberCheck = phonenumber(mobileNumber);
    }

    console.log(firstName, lastName, gender, email, mobileNumber);
    console.log(fNameCheck, lNameCheck, numberCheck, !flag, emailCheck, validNumberCheck);
    console.log('Email: ',validateEmail(email));

    try{
        if(fNameCheck && lNameCheck && numberCheck && !flag && validNumberCheck && emailCheck){
            console.log('All details are proper')

            submitButton.style.display = 'none';
            editButton.style.display = 'block';
            addressInfomation.style.cursor = 'auto'
            enableRedirect = true;
            verifyButton.style.display = 'none';
            verifyMail.style.display = 'none';
            defaultBlock();
            
            const res = await fetch('/username/profile', {
                method: 'POST',
                body: JSON.stringify({ username, firstName, lastName, gender, mobileNumber }),
                headers: { 'Content-Type' : 'application/json' },
            })
            console.log(res);
        }
    } catch(err) {
        console.log(err)
    }
});

addAddress.addEventListener('click', () => {
    addressForm.style.display = 'block';
    cancelButton.style.display = 'block';
});

// functions 

function changePointerToAllowed(id){
    const currentField = document.getElementById(id);
    currentField.disabled = false;
    currentField.style.cursor = "auto";
}

function changePointerToBlock(id){
    const currentField = document.getElementById(id);
    currentField.disabled = true;
    currentField.style.cursor = "not-allowed";
}

function getRadioButtonValue(){
    for(var radio of radios){
        if(radio.checked){
            flag = false;
            return radio.value;
        } 
        flag = true;
    }
}

function phonenumber(inputtxt){
    var regx = /^[6-9]\d{9}$/ ;

    if(regx.test(inputtxt)){
        return true;
    }
    else{
        mobileNumberError.textContent = 'Please enter valid phone number'
        return false;
    }
}

function checkEmptyValues(value,errorName,name){
    if(value === ''){
        errorName.textContent = `Please enter ${name}`
        return false;
    } 
    return true;
}

function checkGender(){
    if(gender==='male'){
        const maleField = document.getElementById('male');
        maleField.checked = true;
    } else if(gender === 'female'){
        const femaleField = document.getElementById('female');
        femaleField.checked = true;
    } else if(gender === 'other'){
        const otherField = document.getElementById('other');
        otherField.checked = true;
    }
}

function validateEmail(email){
    const emailRegex =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(email.match(emailRegex)){
        return true;
    }
    return false;
}

function defaultBlock(){
    changePointerToBlock('fname');
    changePointerToBlock('lname');
    changePointerToBlock('email');
    changePointerToBlock('mobNumber');
    changePointerToBlock('male');
    changePointerToBlock('female');
    changePointerToBlock('other');
}

function defaultAllowed(){
    changePointerToAllowed('fname');
    changePointerToAllowed('lname');
    changePointerToAllowed('email');
    changePointerToAllowed('mobNumber');
    changePointerToAllowed('male');
    changePointerToAllowed('female');
    changePointerToAllowed('other');
}

function checkVerfiedNumber() {
    console.log(verifiedNumberFlag)
    if(verifiedNumberFlag===true){
        verifyNumberIcon.style.display = 'block';
        verifyButton.style.display = 'none';
        changePointerToBlock('mobNumber')
    } else{
        verifyNumberIcon.style.display = 'none';
        verifyButton.style.display = 'block';
    }
}

async function mobileNumberVerification() {
   
    let sendFlag = true;

    let mnvFlag = false;
    let currentNumber = form.mobileNo.value;
    console.log(currentNumber)

    if(currentNumber === ''){
        mobileNumberError.textContent = 'Please enter phone number';
    }
    if(currentNumber != ""){
        phonenumber(currentNumber);
        if(phonenumber(currentNumber))
            mnvFlag = true;
    }
    console.log(mnvFlag, typeof mnvFlag);

    if(mnvFlag){
        otpForm.style.display = 'block';
        verifyButton.style.display = 'none';
        console.log('2nd inside');
        mobileNumberError.textContent = '';
        countdownDiv.style.display = 'block';

        timerFunction();

        let res1;
        let res2;
        async function sendOTPRes() {
            console.log('resended otp')
            res1 = await fetch('/username/profile/send-otp', {
                method: 'POST',
                body: JSON.stringify({ sendFlag, currentNumber }),
                headers: { 'Content-Type' : 'application/json' },
            })
        }
       
        sendOTPRes();

        resendOTP.addEventListener('click', async () => {
            timerFunction();
            res2 = await fetch('/username/profile/send-otp', {
                method: 'POST',
                body: JSON.stringify({ sendFlag, currentNumber }),
                headers: { 'Content-Type' : 'application/json' },
            });
        });

        const otpVerificationButton = document.getElementById('otp-verification-button');
        console.log(res1);

        console.log('after');
        
        otpVerificationButton.addEventListener('click', async () => {
            console.log('clicked')
            const otpValue = otp.value;
            console.log(otpValue);

            const res = await fetch('/username/profile/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ otpValue, username }),
                headers: { 'Content-Type' : 'application/json' },
            })

            console.log(res);

            if(res.ok){
                verifiedNumberFlag = true;
                otpForm.style.display = 'none';
                verifyNumberIcon.style.display = 'block';
                changePointerToBlock('mobNumber'); 
                resendOTP.style.display = 'block';  
                clearInterval(myInterval);
                countdownDiv.style.display = 'none'; 
                resendOTP.style.display = 'none';      
            }
        })
    }
        
};

async function emailVerification() {

    verifyMail.style.display = 'none';
    emailSended.textContent = 'Please check your gmail inbox and click on verification link to verify account.'
    const currentEmail = form.email.value;

    const res = await fetch('/username/profile/send-verification-email', {
        method: 'POST',
        body: JSON.stringify({ currentEmail, username }),
        headers: { 'Content-Type' : 'application/json' },
    });

    console.log(res);

    const res1 = await fetch('/username/profile/verify-email', {
        method: 'POST',
        body: JSON.stringify({ username }),
        headers: { 'Content-Type' : 'application/json' },
    });

    if(res1.ok){
        console.log('Success:', res1);
        verifyEmailIcon.style.display = 'block';
        emailSended.style.display = 'none';
        changePointerToBlock('email');
    }
}

function checkVerfiedEmail() {
    console.log(verifiedEmailFlag)
    if(verifiedEmailFlag===true){
        console.log('inside')
        verifyEmailIcon.style.display = 'block';
        verifyMail.style.display = 'none';
        changePointerToBlock('email');
    } else{
        verifyEmailIcon.style.display = 'none';
        verifyMail.style.display = 'block';
    }
}

// function updateCountdown(time) {
//     const minutes = Math.floor(time/60);
//     let seconds = time % 60;
//     countdownTimer.innerHTML = `${minutes}:${seconds}`;
//     time--;
// }

function timerFunction() {
    const startingTime = 0.40;
    let time = startingTime * 60 - 1;
    
    let myInterval = setInterval(updateCountdown,1000);

    function updateCountdown() {
        const minutes = Math.floor(time/60);
        let seconds = time % 60;
        countdownTimer.innerHTML = `${minutes}:${seconds}`;
        time--;
        if(time === 1){
            console.log('triggered')
            clearInterval(myInterval);
            resendOTP.style.display = 'block';
            countdownDiv.style.display = 'none';
        }
    }
}
