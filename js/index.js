'use strict';

var firebaseConfig = {
    apiKey: "AIzaSyC6A9cw0Ze_f8UrSPgB1f7ITuZb_QlCYYY",
    authDomain: "sessionsergey.firebaseapp.com",
    databaseURL: "https://sessionsergey.firebaseio.com",
    projectId: "sessionsergey",
    storageBucket: "sessionsergey.appspot.com",
    messagingSenderId: "576321818052",
    appId: "1:576321818052:web:a01d7974fa90960b66a891",
    measurementId: "G-W8CPEV4L3S"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

const database = firebase.database();
const rootRef = database.ref('feedbacks')

let feedbackTemplateMain = document.querySelector('#feedback__template')
    .content
    .querySelector('.carousel-item');

let form = document.querySelector('.feedback__form');

let carouselInner = document.querySelector('.carousel-inner');
let slide = document.querySelector('.slide');
// slide.style.display = 'none';


rootRef.orderByKey().on('value', snapshot => {
    while (carouselInner.firstChild) {
        carouselInner.removeChild(carouselInner.firstChild);
    }
    snapshot.forEach(function (childSnapshot) {
        let value = childSnapshot.val();
        let feedbackChild = createFeedback(value);
        carouselInner.appendChild(feedbackChild);
    });
    console.log(carouselInner.firstChild);
    carouselInner.firstChild.classList.add('active');
})


let ratingBlockQuality = document.querySelector('.rating_block--quality');



let sentButton = document.querySelector('.feedback__send');


sentButton.addEventListener('click', function() {


    let checkratingSpeed = false;
    var ratingSpeeds = form.querySelectorAll('input[name="rating--speed"]');
    // debugger;
    ratingSpeeds.forEach((item) => {
        if (item.checked) {
            checkratingSpeed = true;
            ratingSpeeds[0].setCustomValidity("");
        }
    })
    if (!checkratingSpeed) {
        ratingSpeeds[0].setCustomValidity("Поставьте рейтинг!");
    }

    let checkratingQuality = false;
    var ratingQualitys = form.querySelectorAll('input[name="rating--quality"]');
    ratingQualitys.forEach((item) => {
        if (item.checked) {
            checkratingQuality = true;
            ratingQualitys[0].setCustomValidity("");
        }
    })
    if (!checkratingQuality) {
        ratingQualitys[0].setCustomValidity("Поставьте рейтинг!");
    }
});

form.addEventListener('submit', function(evt) {

    evt.preventDefault();
    var formData = new FormData(form);
    let name =formData.get('feedback__name');
    let text = formData.get('feedback__text');
    let ratingQuality = formData.get('rating--quality');
    let ratingSpeed = formData.get('rating--speed');

    const autoId = rootRef.push().key
    rootRef.child(autoId).set({
        name,
        text,
        ratingQuality,
        ratingSpeed
    }).then(() => {
        alert("Данные успешно отправлены!");
    })
    .catch(error => {
        console.error(error);
    })
    form.reset();
});

let createFeedback = function (data) {
    let feedbackTemplate = feedbackTemplateMain.cloneNode(true);
    // feedbackTemplate.classList.add('active');

    let feedback = feedbackTemplate.querySelector('.feedback');


    let name = feedback.querySelector('.feedback__username');
    name.textContent = data.name;

    let text = feedback.querySelector('.feedback__text');
    text.textContent = data.text;

    // debugger;
    var allInputSpeed = feedback.querySelectorAll('.rating_block--speed input[type="radio"]');
    var allLabelSpeed = feedback.querySelectorAll('.rating_block--speed .label_rating');


    allInputSpeed.forEach((item, index) => {
        item.name = 'rating--speed--' + data.name;
        item.id = 'rating--speed--' + data.name;
        allLabelSpeed[index].htmlFor = 'rating--speed--' + data.name;
    })



    var currentInputSpeed = feedback.querySelector(`input[name="rating--speed--${data.name}"][value="${data.ratingSpeed}"]`);
    currentInputSpeed.checked = true;

    var allInputQuality = feedback.querySelectorAll('.rating_block--quality input[type="radio"]');
    var allLabelQuality = feedback.querySelectorAll('.rating_block--quality .label_rating');


    allInputQuality.forEach((item, index) => {
        item.name = 'rating--quality--' + data.name;
        item.id = 'rating--quality--' + data.name;
        allLabelQuality[index].htmlFor = 'rating--quality--' + data.name;
    })

    var currentInputQuality = feedback.querySelector(`input[name="rating--quality--${data.name}"][value="${data.ratingQuality}"]`);
    currentInputQuality.checked = true;

    return feedbackTemplate;
}