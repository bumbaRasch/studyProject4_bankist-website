"use strict";

console.group('1.184. PROJECT: "Bankist" Website');

// Popup window
//add elements 
const popup = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnClosePopup = document.querySelector('.btn__close-modal');
const btnShowPopup = document.querySelectorAll('.btn__show-modal');

//show popup
const showPopup = function(e) {
    e.preventDefault()
    popup.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

//close popup
const closePopup = function(e) {
    e.preventDefault()
    popup.classList.add('hidden');
    overlay.classList.add('hidden');
};

// btns popup show 
btnShowPopup.forEach(btn => btn.addEventListener('click', showPopup));


// btn close
btnClosePopup.addEventListener('click', closePopup);
overlay.addEventListener('click', closePopup);

// Escape key
document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && !popup.classList.contains('hidden')){
        closePopup();
    }
});

////////////////////////////////////////////////////////////////////////////

// Create Element cookie
window.onload = function (){
    setTimeout(showCookiePopup, 5000)
}

const showCookiePopup = function(){
    // create cookie element 
    const cookieMessage = document.createElement('div');
    // header element
    const headerEl = document.querySelector('.header');
    // add classname
    cookieMessage.classList.add('cookie__message');

    // add text in message 
    cookieMessage.innerHTML = `
    <div class="cookie__message--container">
        <h4 class="cookie__message--text">We use cookies for improved functionality and analytics.</h4> 
        <button class="btn btn__close-cookie close-cookie__cancel">Cancel</button>
        <button class="btn btn__close-cookie close-cookie__ok">Got it!</button>
    </div>`;
    
    // add element into HTML
    headerEl.before(cookieMessage);

    // add cookie button element
    const cookieCancel = document.querySelector('.close-cookie__cancel');
    const cookieOk = document.querySelector('.close-cookie__ok');

    // action confirm and remove cookie message
    cookieOk.addEventListener('click', () => cookieMessage.remove())

    // action cancel , remove cooke and setTimeout
    cookieCancel.addEventListener('click', () => {
        cookieMessage.remove();
        setTimeout(showCookiePopup, 5000);
    });
};

//////////////////////////////////////////////////////////////////////////////

// 1.188. Implementing Smooth Scrolling'

// add elements 
const btnScrollTo = document.querySelector('.btn__scroll-to');
const sectionFeatures = document.querySelector('#features');

// event handler scroll
btnScrollTo.addEventListener('click', function(e){
    e.preventDefault();

    // coordinates of Features section
    const featuresCoord = sectionFeatures.getBoundingClientRect(); // position element in DOM (Button)
    console.log(featuresCoord);
    console.log(e.target.getBoundingClientRect()); // Position (Section)
    console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset);

    console.log('heght/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth)

    // old Methode

    /* // new position + distance from the button to the top and to the left of the page
    window.scrollTo(featuresCoord.left + window.pageXOffset, featuresCoord.top + window.pageYOffset); */

    /* window.scrollTo({
        left: featuresCoord.left + window.pageXOffset,
        top: featuresCoord.top + window.pageYOffset,
        behavior: "smooth", 
    });
    */
    
    // New methode
    sectionFeatures.scrollIntoView({behavior: "smooth",})
});


///////////////////////////////////////////////////////////////////////////

// Page navigation

// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function(e){
    // doesn't reload page
    e.preventDefault();

    // Matching strategy
    if(e.target.classList.contains('nav__link')){
        // add attribute with "href" in element (event.target)
        const id = e.target.getAttribute('href');

        // smooth scroll
        document.querySelector(id).scrollIntoView({behavior: "smooth",});
    }
});


////////////////////////////////////////////////////////////////////////

// Tabbed components
const tabs = document.querySelectorAll('.operation__tab')
const tabsContainer = document.querySelector('.operation__tab-container');
const tabsContent = document.querySelectorAll('.operation__content');

tabsContainer.addEventListener('click', function(e){
    // traverses the element and its parents
    const clicked = e.target.closest('.operation__tab');

    // Guard clause
    if(!clicked) return;

    // Remove active classes
    tabs.forEach(t => t.classList.remove('operation__tab--active'))
    tabsContent.forEach(content => content.classList.remove('operation__content--active'));
    
    // Activate tab
    clicked.classList.add('operation__tab--active');

    // Activate content area
    document.querySelector(`.operation__content--${clicked.dataset.tab}`).classList.add('operation__content--active');
});

///////////////////////////////////////////////////////////////////
// Menu fade animation

//add element
const navigation = document.querySelector('.nav');

// Function handler event

const handleHover= function(e){
    if(e.target.classList.contains('nav__link')){
        const link = e.target;
        const subling = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('.nav__logo');

        subling.forEach(element => {
            if(element !== link) {
                logo.style.opacity = element.style.opacity = this;
            }
        })
    }
};


// add event listener
navigation.addEventListener('mouseover', handleHover.bind(0.5));
navigation.addEventListener('mouseout', handleHover.bind(1));


/////////////////////////////////////////////////////////////////////////////////

/* 
// Sticky navigation
const initialCoordsFeature = sectionFeatures.getBoundingClientRect();


window.addEventListener('scroll', function(e){
    window.scrollY > initialCoordsFeature.top ? navigation.classList.add('sticky') : navigation.classList.remove('sticky');
    
     or 
    // greater than section height
     window.scrollY > this.document.querySelector('.hero__body').offsetHeight ? navigation.classList.add('sticky') : navigation.classList.remove('sticky');
});

 */
//////////////////////////////////////////////////////////////////////////////////

// The Intersection Observer API

// add header element
const header = document.querySelector('.header');

// add section hero 
const heroBody = document.querySelector('.hero__body'); // target element

// add header height
const headerHeight = header.getBoundingClientRect().height;

// Observer functions

// callback observer
const obsCallback = function(entries){
    const [entry] = entries;
    if(!entry.isIntersecting) {
        navigation.classList.add('sticky')
    } else navigation.classList.remove('sticky')
};

// Observer option
const optionObserver = {
    root: null,
    threshold: 0,
    rootMargin: `-${headerHeight}px`, // margin
};


const heroObserver = new IntersectionObserver(obsCallback, optionObserver); 
heroObserver.observe(heroBody); 


///////////////////////////////////////////////////////////////////////////////////////////

//Reveal sections (Elements on Scroll)

const allSections = document.querySelectorAll('.section');

const revealSectionCallback = function(entries, observer) {
    const [entry] = entries;
    if(!entry.isIntersecting){
        return;
    };

    // Remove hidden class
    entry.target.classList.remove('section--hidden');

    // Stop observer
    observer.unobserve(entry.target);
   
};

const sectionObserver = new IntersectionObserver(revealSectionCallback, {
    root: null,
    threshold: 0.15,
});
allSections.forEach(function(section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});




//////////////////////////////////////////////////////////////////////////////////

// Lasy loading images

//add elements 
const lazyImgs = document.querySelectorAll('img[data-src]');

const showImg = function(entries, observer){
    const [entry] = entries;
    if(!entry.isIntersecting){
        return;
    };

    // Replace src with data-src
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function(){
        entry.target.classList.remove('lazy-img');
    });

    // Stop observer
    observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(showImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
});

lazyImgs.forEach(function(image){
    imageObserver.observe(image);
});


///////////////////////////////////////////////////////////////////////////

//// Slider ////

const sliderFuncution = function() {

// add image elements
const slidesEl = document.querySelectorAll('.slide');

// add slider buttons
const sliderBtns = document.querySelectorAll('.slider__btn');

// add slider 
const slider = document.querySelector('.slider');

// add slide length
const maxSlide = slidesEl.length - 1;

// add dots element
const dotContainer = document.querySelector('.dots');

// add current image
let currentSlide = 0;


//// FUNCTIONS ////

// Create dots
const createDots = function() {
    slidesEl.forEach((_, index) => {
        dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${index}"></button>`);
    });
};

// Active dots
const activateDot = function(currentSlide){

    // Remove classList
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

    // add classList
    document.querySelector(`.dots__dot[data-slide="${currentSlide}"]`).classList.add('dots__dot--active');
};

// Functon Go to slide
const goToSlide = function (currentSlide) {
    slidesEl.forEach((slide, index) => {
    slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`
    });
};

// Function change slides
const nextSlide = function(){
    if(currentSlide === maxSlide){
        currentSlide = 0; 
    } else {
        currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
};

const prevSlide = function(){
    if(currentSlide === 0){
        currentSlide = maxSlide; 
    } else {
        currentSlide--;
    };
    goToSlide(currentSlide);
    activateDot(currentSlide);
};

// Default image
const init = function(){
    createDots();
    goToSlide(currentSlide);
    activateDot(currentSlide);
};
init();

//////////////////////////////// 

// Next and previous slide 
const changeSlide = function (e) {
    e.target.classList.contains('slider__btn--right') && nextSlide();
    e.target.classList.contains('slider__btn--left') && prevSlide();
};


//// Event handlers //// 

// Event listener 'click'
sliderBtns.forEach(btn => btn.addEventListener('click', changeSlide));

// Event listener 'keydown'
document.addEventListener('keydown', function(e){
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
});

// Event listener dot
dotContainer.addEventListener('click', function(e){
    if(e.target.classList.contains('dots__dot')){
        const {slide} = e.target.dataset;
        goToSlide(slide);
        activateDot(slide);
    }
});
};
sliderFuncution();


///////////////////////////////////////////////////////////////

//add elements 

const locationEl = document.querySelector('.exchange__location');

// USD
const sellUSD = document.querySelector('.currency__sell--USD');
const buyUSD = document.querySelector('.currency__buy--USD');

// CHF
const sellCHF = document.querySelector('.currency__sell--CHF');
const buyCHF = document.querySelector('.currency__buy--CHF');

// GBP
const sellGBP = document.querySelector('.currency__sell--GBP');
const buyGBP = document.querySelector('.currency__buy--GBP');



// Create current date and time
const locale = navigator.language;

const exchangeDateOptions = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  };


const exchangeDate = () => {
    locationEl.textContent = new Intl.DateTimeFormat('en-GB', exchangeDateOptions).format();
    setTimeout(exchangeDate, 1000);
  };
exchangeDate();


///////////////////////////////////////////////////////////////////////////////////////////


// Currency converter

//add rate button
const exchangeBtn = document.querySelector('.exchangePage__btn');



//add Icon element
const exchangeImg = document.querySelector('.exchangePage__icon');



// FUNCTIONS
const defaultExchange = () =>{
  document.querySelector('.exchangePage__input').value = '';
  document.querySelector('.exchangePage__text--rate').innerHTML = 'Getting exchange rate...';
}
defaultExchange();



// 
const getExchangeRate = async() => {
  const base = document.querySelector('.exchangePage__select--from').value;
  const CURRENCY_URL = `https://api.exchangerate.host/latest?/source=ecb&base=${base}`;
  fetch(CURRENCY_URL).then(resonse => resonse.json()).then(data => {

      //add input element
      const amount = document.querySelector('.exchangePage__input');
      if(amount.value === '' || amount.value === 0){
          amount.value = 1;
      }
      
      //add select to element
      const currencyTo = document.querySelector(".exchangePage__select--to");

      // create rate 
      const rate = data.rates[currencyTo.value];

      //function convert
      const convert = () => amount.value * rate;

      //add result text
      const totalRateTxt = document.querySelector('.exchangePage__text--rate');
      totalRateTxt.innerHTML = `${amount.value} ${base.toUpperCase()} = ${convert().toFixed(2)} ${currencyTo.value}`;
  }).catch((error) => {
      alert("Error: ", error)
  })
  return false;
};


// Get base array
const getBaseArray = async() => {
  const url = `https://api.exchangerate.host/latest?/source=ecb&base`;
  fetch(url).then(resonse => resonse.json()).then(data => {

    //create array with currency for option tag
    const baseArray = Object.keys(data.rates);

    // add select element
    const selectCountry = document.querySelectorAll('.exchangePage__select');

    //create option in HTML with currency
    for (let i = 0; i < selectCountry.length; i++){
      
      // create Select a Currency text
      const htmlDisable = `<option class="exchangePage__option--from" selected disabled>Select a Currency</option>`;

      // insert disabled options tag inside select tag
      selectCountry[i].insertAdjacentHTML('beforeend', htmlDisable);
      for (let key of baseArray){
        // create option tag witn passing key as a text and value
        const html = `<option class="exchangePage__option" value="${key}">${key}</option>`;
        // insert options tag inside select tag
        selectCountry[i].insertAdjacentHTML('beforeend', html);
      }
     /*  selectCountry[i].addEventListener('change', (e) => {
        // calling loadFlag with target element as an argument
          loadFlag(e.target);
      }); */
    };
  });
};


// Exchange event listener
exchangeImg.addEventListener('click', function(){
  exchangeImg.classList.toggle('exchangePage__icon-on');
  [document.querySelector('.exchangePage__select--from').value, document.querySelector(".exchangePage__select--to").value] = [document.querySelector(".exchangePage__select--to").value, document.querySelector('.exchangePage__select--from').value];
  getExchangeRate();
});


// EVENT LISTENERS


document.addEventListener('DOMContentLoaded', () => {
  getBaseArray();
});

// Button event listener EXCHANGE
exchangeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  getExchangeRate();
  
});


console.groupEnd();
