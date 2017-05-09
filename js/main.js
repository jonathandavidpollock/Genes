window.addEventListener("load", ()=>{
  console.log("loaded JS.");
  var form = document.querySelector('form');
  var input = document.querySelector('input');
  var articleHeader = document.querySelector('article h2');
  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    articleHeader.innerHTML = input.value;

    console.log(e);
  });
});
