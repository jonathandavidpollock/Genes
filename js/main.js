window.addEventListener("load", () => {
  var form = document.querySelector('form');
  var input = document.querySelector('input');
  var main = document.querySelector('main');
  var learnmore = document.querySelector('#learnmore')
  console.log(learnmore);
  console.log(learnmore.getAttribute('href'))

  form.addEventListener("submit", e => {
    var articleHeader = document.querySelector('article:first-of-type h2');
    console.log('form submitted');
    console.log(`Article Header: ${articleHeader.innerHTML}`);
    e.preventDefault();

    // RESET the article for input becuase
    // No Results found removed them
    if (articleHeader.innerHTML == 'No Results Found') {
      console.log(`Removing "No Results Found" from article`);
      // Reset the article to original article
      let article = document.querySelector('article')
      article.innerHTML = `
          <article>
            <h2>PICST_49658</h2>
            <p><strong>Definition: </strong> <span id="definition">Homeographic Gene</span></p>
            <p><strong>Pathways: </strong><span id="pathways">No Pathways Exist</span></p>
            <p><strong>Chemical Reactions: </strong><span id="reactions">No Chemical Reactions Exist</span></p>
            <p class="btnWrap"><a  href="" target="_blank" id="learnmore">Learn More</a></p>
          </article>
        `
    }


    // Get the value of the input
    // Replace the search value
    let searchTerm = e.srcElement[0].value;
    articleHeader.innerHTML = searchTerm;

    // main.appendHTML = '<article class="loading"><p><img src="assets/Loading_icon.gif" alt="spinner"></p></article>';
    console.log("Event Fired");
    getContent(input.value);
  });
});

function getContent($ext) {
  // Variables
  var $domain = "http://www.genome.jp/dbget-bin/www_bget?pic";
  var $char = ":";
  var $url = $domain + $char + $ext;
  var $noChemicalReaction = "No Chemical Reactions Found.";
  var $noPathways = "No Pathways Found.";
  var $buttonLink = $url;

  console.log(`Going to URL: ${$url}`);
  document.querySelector('#learnmore').setAttribute("href", $url);

  // Get the contents of the url
  let promise = fetch("https://crossorigin.me/" + $url);
  promise.then(response => {
    return response.text();
  })
    .then(data => {
      var doc = data;
      if (!doc.includes("No such data")){
        var defintion = getDefinition(doc);
        var pathways = getPathways(doc);
        var reactions = getReactions(doc)


        var information = [defintion,pathways,reactions];
        return information;
      } else {
        // Display no Results Found
        document.querySelector('main').innerHTML = "<article><h2>No Results Found</h2></article>";
      }
      })
    .then(information => {
        document.querySelector('#definition').innerHTML = information[0];
        document.querySelector('#pathways').innerHTML = information[1];
      })
    .catch(error => {throw error})
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
  // Spliting the document on these
  // four Values to extract the
  // needed items
  let split1 = '<nobr>Pathway</nobr>';
  let split2 = '</table>';
  let split3 = '<div>';
  let split4 = '</div>';

  if(doc.includes(split1)) {
    let array = doc.split(split1);
    array = array[1].split(split2);
    array = array[0].split(split3);
    let string = "";
    array.forEach(element => {
      if(element.includes(split4)) {
        let ary = element.split(split4);
        let i = 0;
        ary.forEach(el => {
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
      .then(data => {
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
    .catch(error => {throw error})
    return returnValue;
  } else {
    return "No Chemical Reaction found.";
  }
}
