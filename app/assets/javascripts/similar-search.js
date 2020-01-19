window.addEventListener("DOMContentLoaded", function() {
  var form = document.getElementById("similar-search-form");
  if (!form) {
    return;
  }
  var moreItem = document.getElementById("similar-search-more")

  var resultElementTemplate = null;

  form.addEventListener("ajax:success", function(event) {
    moreItem.querySelector("input[name=terms]").value = form.querySelector("input[name=terms]").value;
    moreItem.querySelector("input[name=page]").value = 2;
    document.querySelectorAll(".similar-search-result").forEach(function(n) {
      n.parentNode.removeChild(n);
    });
    addResults(event.detail[0]);
  });

  moreItem.addEventListener("ajax:success", function(event) {
    addResults(event.detail[0]);
    moreItem.querySelector("input[name=page]").value = parseInt(moreItem.querySelector("input[name=page]").value) + 1;
    if (event.detail[0].length < 25) {
      moreItem.style.display = "none";
    }
  });

  function addResults(results) {
    var resultsElement = document.getElementById("similar-search-results");
    var nodes = Array.from(resultsElement.querySelectorAll(".similar-search-result"));

    results.forEach(function(d) {
      var resultElement = getResultElementTemplate();
      resultElement.score = d.distance;

      var link = resultElement.querySelector(".similar-search-result-script-link");
      link.appendChild(document.createTextNode(d.name));
      link.setAttribute("href", d.url);

      var diff = resultElement.querySelector(".similar-search-result-diff-link");
      diff.setAttribute("href", diff.getAttribute("href") + encodeURIComponent("https://greasyfork.org" + d.url) + "#script-comparison");

      resultElement.insertBefore(document.createTextNode(d.distance.toFixed(3) + " "), resultElement.firstChild);

      nodes.push(resultElement);
    });

    var fragment = document.createDocumentFragment();

    nodes.sort(function(a, b) { return b.score - a.score }).forEach(function(n) {
      fragment.appendChild(n);
    });

    resultsElement.insertBefore(fragment, moreItem);
  }

  function getResultElementTemplate() {
    if (!resultElementTemplate) {
      resultElementTemplate = document.createElement("li");
      resultElementTemplate.setAttribute("class", "similar-search-result");

      var diff = document.createElement("a");
      diff.appendChild(document.createTextNode(("[Diff]")));
      diff.setAttribute("class", "similar-search-result-diff-link");
      diff.setAttribute("href", "admin?compare=");
      resultElementTemplate.appendChild(diff);

      resultElementTemplate.appendChild(document.createTextNode(": "));

      var link = document.createElement("a");
      link.setAttribute("class", "similar-search-result-script-link")
      resultElementTemplate.appendChild(link);
    }
    return resultElementTemplate.cloneNode(true);
  }

});