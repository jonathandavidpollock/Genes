(()=>{
  document.addEventListener("load",()=>{
    console.log("loaded JS.");
    var form = document.querySelector('form');
    form.addEventListener("submit",(e)=>{
      e.preventDefault();
    })
  })
})();
