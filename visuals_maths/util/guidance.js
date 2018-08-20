let modal = document.getElementsByClassName("guideModal")[0],
    guide = document.getElementsByClassName("guide")[0],
    modalContent = document.getElementsByClassName("modalContent")[0];

let currentSlideNumber = 0,
    maxSlideNumber = 4,
    slideIDs;

function openModal(){
    modal.style.display = "block";
    modalContent.style.display = "block";
    $(".nextBtn").html("Next  ▶");
    $(".backBtn").prop("disabled",true);
    $(".guide").hide();

    for (var i=0; i < slideIDs.length; ++i){
        $("#" + slideIDs[i]).addClass("whitened");
    }
    return 0;
}

function closeModal(){
    modal.style.display = "none";
    $( "#modal_" +  (currentSlideNumber) ).hide();
    $( "#modal_0" ).show();
    currentSlideNumber = 0;
    $(".guide").show();

    $("div, ul, h1, input, label, canvas").removeClass("whitened");
    return 0;
}

function triggerAnimation() {
    modalContent.style.animation = 'none';
    modalContent.offsetHeight; /* trigger reanimation */
    modalContent.style.animation = null;
    return 0;
}

function nextModal(){
    $("#" + slideIDs[currentSlideNumber - 1]).addClass("whitened");
    $("#" + slideIDs[currentSlideNumber]).removeClass("whitened");
    if (currentSlideNumber < maxSlideNumber){
        $(".backBtn").prop("disabled",false);

        $( "#modal_" +  currentSlideNumber).hide();
        $( "#modal_" +  (++currentSlideNumber) ).show();

        if (currentSlideNumber == maxSlideNumber){
            $(".nextBtn").html("Close ×");
        }
    } else {
        closeModal();
    }
    return 0;
}

function backModal(){
    $("#" + slideIDs[currentSlideNumber -1]).addClass("whitened");
    $("#" + slideIDs[currentSlideNumber -2]).removeClass("whitened");
    $(".nextBtn").html("Next  ▶");

    $( "#modal_" +  currentSlideNumber).hide();
    $( "#modal_" +  (--currentSlideNumber) ).show();

    if (currentSlideNumber == 0){
        $(".backBtn").prop("disabled",true);
    }
    return 0;
}

function guidanceShow() {guide.style.left = "97vw";};
function guidanceHide() {guide.style.left = "98vw"; guide.style.transitionDuration = "1s";};

/*Initialisation*/
function initGuidance(ids=[]) {
    slideIDs = ids;
    maxSlideNumber = slideIDs.length + 1;
    $(".guide").each(function () {
        $(this).mouseenter(function () {guidanceShow();});
        $(this).mouseleave(function () {guidanceHide();});
        $(this).click(function() {openModal();});
    });

    $(".nextBtn").click(function () {nextModal();});
    $(".backBtn").click(function () {backModal();});

    window.addEventListener("click", function (e) {if(e.target === modal){closeModal();}});

    setTimeout(function() {
        guidanceHide();
    }, 3000);
    return 0;
}