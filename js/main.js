window.addEventListener("load", ()=>{
  console.log("loaded JS.");
  var form = document.querySelector('form');
  var input = document.querySelector('input');
  var articleHeader = document.querySelector('article:first-of-type h2');
  form.addEventListener("submit",(e)=>{
    e.preventDefault();
    console.log("Event Fired");
    articleHeader.innerHTML = input.value;
    getContent(input.value);
  });
});

function getContent($gene) {
  // Variables
  var $domain = "http://www.genome.jp/dbget-bin/www_bget?pic";
  var $char = ":";
  var $ext = $gene;
  var $url = $domain + $char + $ext;
  console.log($url);
  document.querySelector('#learnmore').setAttribute("href", $url);
  var $noChemicalReaction = "No Chemical Reactions Found.";
  var $noPathways = "No Pathways Found.";
  var $buttonLink = $url;

  // Get the contents of the url
  let promise = fetch("https://crossorigin.me/" + $url);
  promise.then(response => {
    return response.text();
  })
    .then((data)=>{
      var doc = data;
      if (!doc.includes("No such data")){
        var defintion = getDefinition(doc);
        var pathways = getPathways(doc);
        var reactions = getReactions(doc)

        var information = [defintion,pathways,reactions];
        return information;
      } else {
        // Display no Results Found
        document.querySelector('main').innerHTML = "<article><h2>No Results found</h2></article>";
      }


  }).then(information=>{
      document.querySelector('#definition').innerHTML = information[0];
      document.querySelector('#pathways').innerHTML = information[1];
  })
  .catch((error)=> {throw error})
}

function getDefinition(doc) {
  let split1 = '<nobr>Definition</nobr>';
  let split2 = '(RefSeq) ';
  let split3 = '</div>';
  let array = doc.split(split1);
  array = array[1].split(split2);
  array = array[1].split(split3);
  var definition = array[0];

  // Remove the Br tags
  definition = definition.replace('<br>', ' ');
  console.log("Defintion: " + definition);
  return definition;
}

function getPathways(doc) {
  let split1 = '<nobr>Pathway</nobr>';
  let split2 = '</table>';
  let split3 = '<div>';
  let split4 = '</div>';

  if(doc.includes(split1)) {
    let array = doc.split(split1);
    array = array[1].split(split2);
    array = array[0].split(split3);
    let string = "";
    array.forEach(function(element){
      if(element.includes(split4)) {
        let ary = element.split(split4);
        let i = 0;
        ary.forEach(function(el){
          if(el[0].match(/[a-zA-Z]/i)){
            if (i > 1) {
              string += '&';
            }
            string += el + " ";
            i++;
          }
        });
      }
    });
    console.log("Pathways: "  + string);
    return string;
  } else {
    console.log("No Pathways.");
    return "No Pathways Found.";
  }

}

function getReactions(doc) {
  var $chem = "Chemical reaction";
  var remp = '';
  if(doc.includes($chem)) {
    let domain = "http://www.genome.jp/";
    let split1 = $chem;
    let split2 = 'href="';
    let split3 = '">';
    let array = doc.split(split1);
    array = array[0].split(split2);
    let path = array[array.length - 1];
    array = path.split(split3);
    let url  = domain + array[0];
    console.log("Chemical Reaction URL: " + url);


    let promise = fetch("https://crossorigin.me/" + url);
    let returnValue = promise.then(response => {
      return response.text();
    })
      .then((data)=>{
        let reactionPage = data;
        reactionPage = reactionPage.split('<hr>');
        reactionPage = reactionPage[0].split("<pre>");
        let reactionPagePRETAG = "<pre>" + reactionPage[1];
        reactionPagePRETAG = reactionPagePRETAG.split('href="').join('href="http://www.genome.jp/').replace(/  +/g, ' ');
        reactionPagePRETAG = reactionPagePRETAG.split('; ').join('<br>')
        reactionPagePRETAG = reactionPagePRETAG.replace('<pre>','<div>');
        reactionPagePRETAG = reactionPagePRETAG.replace('</pre>','</div>');
        document.querySelector("#reactions").innerHTML = reactionPagePRETAG;;
    })
    .catch((error)=> {throw error})
    return returnValue;
  } else {
    return "No Chemical Reaction found.";
  }
}
