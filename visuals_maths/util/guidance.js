let modal = document.getElementsByClassName("guideModal")[0],
    guide = document.getElementsByClassName("guide")[0],
    modalContent = document.getElementsByClassName("modalContent")[0];

let currentSlideNumber = 0;
let slidePositions;
let maxSlideNumber = 7;

function scrollToTop(){
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
function scrollToBottom(){
    document.body.scrollTop = 1000; // For Safari
    document.documentElement.scrollTop = 1000; // For Chrome, Firefox, IE and Opera
}
function openModal(){
    modal.style.display = "block";
    modalContent.style.display = "block";
}
function closeModal(){
    modal.style.display = "none";
    $( "#modal_" +  (currentSlideNumber) ).hide();
    $( "#modal_0" ).show();
    $("#guideHeader").show();
    $( ".nextBtn").show();
    currentSlideNumber = 0;
    setPosition();
}

function nextModal(){
    $("#guideHeader").hide();

    $( "#modal_" +  currentSlideNumber).hide();
    $( "#modal_" +  (++currentSlideNumber) ).show();
    setPosition();

    modalContent.style.animation = 'none';
    modalContent.offsetHeight; /* trigger reanimation */
    modalContent.style.animation = null;

    if (currentSlideNumber + 1 == maxSlideNumber){
        $( ".nextBtn").hide();
    }
}

function guidanceShow() {guide.style.left = "97vw";};
function guidanceHide() {guide.style.left = "98vw"; guide.style.transitionDuration = "1s";};

function setPosition() {
    modalContent.style.left = slidePositions[currentSlideNumber][0] + "vw";
    modalContent.style.top = slidePositions[currentSlideNumber][1] + "vh";
}

/*Initialisation*/
function initGuidance(positions=[[30, 30]]) {
    slidePositions = positions;
    maxSlideNumber = positions.length;
    setPosition();

    $(".guide").each(function () {
        $(this).mouseenter(function () {guidanceShow();});
        $(this).mouseleave(function () {guidanceHide();});
        $(this).click(function() {openModal(); scrollToTop();});
    });
    $(".closeBtn").click(function () {closeModal();});
    $(".nextBtn").click(function () {nextModal();});

    window.addEventListener("click", function (e) {if(e.target === modal){closeModal();}});

    setTimeout(function() {
        guidanceHide();
    }, 3000);
};