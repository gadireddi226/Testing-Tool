import {Github} from '../api/github.js';

////
document.getElementById("show").addEventListener("click", evalText)

function evalText() {
  var input = document.getElementById("textField").value;
  switch (input) {
    case "branches":
      getBranches();
      break;
    case "tree":
      getRootTree();
      break;
    case "master":
      getMasterBranch();
      break;
    case "releases":
      getReleases();
      break;
    case "pull requests":
      getPullRequests();
      break;
    case "issues":
      getIssues();
      break;
    case "tags":
      getAllTags();
      break;
  }
  document.getElementById("textField").value = "";
}

const github = new Github("gadireddi226","Testing-Tool","c7a9a870bf8f3a5bd5489f8e879c56baee14f498");
//github.getIssues();
github.createFile();
