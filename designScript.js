
var menuBtn = document.getElementById("configButton");
var navUl = document.querySelector("nav ul ul");

menuBtn.addEventListener("mouseover", function() {
  navUl.classList.toggle("menu-cascading");
});
menuBtn.addEventListener("mouseout", function() {
  navUl.classList.toggle("menu-cascading")
});

navUl.addEventListener("mouseover", function(){
  menuBtn.style.backgroundColor= "#004353";
});

navUl.addEventListener("mouseout", function(){
  menuBtn.style.backgroundColor= "";
});