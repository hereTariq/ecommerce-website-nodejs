const toggleItems = document.getElementById('toggleItems');
const toggleButton = document.getElementById('toogleButton');
const eye = document.getElementById('eye');
const icon = document.getElementById('icon');

toggleButton.addEventListener('click',(e) => {

    if(icon.getAttribute('src').match('/images/websiteImages/bars-solid.svg')){
        icon.setAttribute('src','/images/websiteImages/xmark-solid.svg')
        toggleItems.style.transform = 'translateX(0)'
    }else{
        icon.setAttribute('src','/images/websiteImages/bars-solid.svg');
        toggleItems.style.transform = 'translateX(100%)'
    }
})


    eye.addEventListener('click',(e) => {
    const passwordInput = document.getElementById('password')
    const type = passwordInput.getAttribute('type');
    console.log(type);

    if(type === 'password'){
        console.log('if block');
        passwordInput.setAttribute('type','text');
        eye.src = '/images/websiteImages/eye-regular.svg';
    }else{
        console.log('else block');
        passwordInput.setAttribute('type','password');
        eye.src = '/images/websiteImages/eye-slash-regular.svg';
        
    }
    
})

