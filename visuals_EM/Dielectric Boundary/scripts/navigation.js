$(".rightnav").on('click',function(){
    console.log(window.location.href)
    if(window.location.href==
        "file:///C:/Users/cydco/OneDrive/Documents/UROP/Imperial-Visualizations/visuals_EM/Dielectric%20Boundary/Home_page.html"){
        window.location.href= "file:///C:/Users/cydco/OneDrive/Documents/UROP/Imperial-Visualizations/visuals_EM/Dielectric%20Boundary/Page_1.html"
    }
    else if(window.location.href== "file:///C:/Users/cydco/OneDrive/Documents/UROP/Imperial-Visualizations/visuals_EM/Dielectric%20Boundary/Page_1.html"){
        window.location.href="file:///C:/Users/cydco/OneDrive/Documents/UROP/Imperial-Visualizations/visuals_EM/Dielectric%20Boundary/Page_2.html"
    }
});

$(".leftnav").on('click',function(){
    console.log(window.location.href)
    if(window.location.href==
        "file:///C:/Users/cydco/OneDrive/Documents/UROP/Imperial-Visualizations/visuals_EM/Dielectric%20Boundary/Page_1.html"){
        window.location.href= "file:///C:/Users/cydco/OneDrive/Documents/UROP/Imperial-Visualizations/visuals_EM/Dielectric%20Boundary/Home_page.html"
    }
    else if(window.location.href==
    "file:///C:/Users/cydco/OneDrive/Documents/UROP/Imperial-Visualizations/visuals_EM/Dielectric%20Boundary/Page_2.html"){
        window.location.href="file:///C:/Users/cydco/OneDrive/Documents/UROP/Imperial-Visualizations/visuals_EM/Dielectric%20Boundary/Page_1.html"
    }
});