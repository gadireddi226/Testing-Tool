import { Github } from '../api/github.js';
import Quill from '../textEditor/quill.js'
import "./styles/style.css";
import { encode, decode } from 'js-base64';
import { Tree } from "../treeWidget/tree"
import "../treeWidget/style/tree.css"
var parser = require('cron-parser');

var quill = new Quill('#editor', {
  theme: 'snow'
});

document.querySelector('#submit').addEventListener('click', saveEditedFile)
document.getElementById("show").addEventListener("click", evalText)

async function evalText() {
  var input = document.getElementById("textField").value;
  var response;
  switch (input) {
    case "branches":
      try {
        await github.getBranches().then((branches) => {
          response = branches;
        });
      }
      catch (err) {
        alert(`Error: "${err}" \n Might be too many request to git API wait 30 seconds`);
      }
      break;
    case "tree":
      try {
        const sha_master_ref = await github.getMasterBranch();
        const latestCommitIds = await github.getMasterCommits(sha_master_ref);
        const rootTree = await github.getRootTree(latestCommitIds["treeSha"]);
        createGitTree(rootTree.data.tree, github.repo, githubURL);
        alert("success tree received");
      }
      catch (err) {
        alert(`Error: "${err}" \n Might be too many request to git API wait 30 seconds`);
      }
      break;
    case "master":
      try {
        response = await github.getMasterBranch();
        alert("success sha master ref received");
      }
      catch (err) {
        alert(`Error: "${err}" \n Might be too many request to git API wait 30 seconds`);
      }
      break;
    case "releases":
      try {
        response = await github.getReleases();
        alert("success releases received");
      }
      catch (err) {
        alert(`Error: "${err}" \n Might be too many request to git API wait 30 seconds`);
      }
      break;
    case "pull requests":
      try {
        response = await github.getPullRequests();
        alert("success PRs received");
      }
      catch (err) {
        alert(`Error: "${err}" \n Might be too many request to git API wait 30 seconds`);
      }
      break;
    case "issues":
      try {
        response = await github.getIssues();
        alert("success issues received");
      }
      catch (err) {
        alert(`Error: "${err}" \n Might be too many request to git API wait 30 seconds`);
      }
      break;
    case "tags":
      try {
        response = await github.getAllTags();
        alert("success tags received");
      }
      catch (err) {
        alert(`Error: "${err}" \n Might be too many request to git API wait 30 seconds`);
      }
      break;
  }
  if (Array.isArray(response)) {
    setInfoList(response);
  }
  else if (response) {
    setInfoList([response]);
  }
  document.getElementById("textField").value = "";
}

const github = new Github("gadireddi226", "TestRunner", "1f1a066e67d18478495ca5890f2e2509d83f0d88");
const githubURL = "https://github.com/gadireddi226/TestRunner"
function visualizeBlob(name = "No title", shaOfBlob = "93a3c8033b721cb36396cc99d4a131ad9d6e8717") {
  github.getBlob(shaOfBlob).then((data) => {
    let input = decode(data.data.content);
    console.log(input);
    let titleLabel = document.querySelector("#nameOfFile");
    titleLabel.innerHTML = name;
    quill.setText(input, "api");
  })
}

function setInfoList(response) {
  console.log(response);
  let infoTable = document.querySelector("#info");
  infoTable.innerHTML = "";
  response.forEach((element) => {
    let item = document.createElement("li");
    item.innerHTML = JSON.stringify(element);
    item.addEventListener("click", showInEditor);
    infoTable.append(item);
  });

}

function showInEditor(e) {

  let type = e.target.getAttribute("data-type");

  if (type === "blob") {
    let blobSha = e.target.getAttribute("data-sha");
    let nameOfFile = e.target.getAttribute("data-path");

    sessionStorage.setItem('selectedFilePath', nameOfFile);
    visualizeBlob(nameOfFile, blobSha);
  }

}

function saveEditedFile(e) {
  e.preventDefault();
  console.log("saveEditedFile data");
  let output = quill.getText();
  console.log("output");
  console.log(output);
  github.editFile(sessionStorage.getItem('selectedFilePath'), output);
}

function createGitTree(input, repositoryName = "empty name", url) {
  createWidgetTree(input, repositoryName, url);
  var trees = document.querySelectorAll('[role="tree"]');

  for (var i = 0; i < trees.length; i++) {
    var t = new Tree(trees[i]);
    t.init();
  }

  // add event listeners 
  var treeitems = document.querySelectorAll('[role="treeitem"]');

  for (var i = 0; i < treeitems.length; i++) {

    treeitems[i].addEventListener('click', function (event) {
      var treeitem = event.currentTarget;
      var label = treeitem.getAttribute('aria-label');
      if (!label) {
        label = treeitem.innerHTML;
      }
      //console.log(treeitem.getAttribute())
      document.getElementById('last_action').value = label.trim();

      event.stopPropagation();
      event.preventDefault();
    });
    treeitems[i].addEventListener('click', showInEditor);

  }

}

function createWidgetTree(treeInput, nameOfRepository, url) {
  // Create structure for data
  var hierarchy = treeInput.reduce(function (hier, node) {
    var x = hier;
    var path = node["path"];
    path.split('/').forEach(function (item) {
      if (!x[item]) {
        x[item] = {};
      }
      x = x[item];
    });
    x.type = node["type"];
    x.sha = node["sha"];
    x.path = node["path"];
    return hier;
  }, {});

  let info = document.querySelector("#info");

  //create title and widget for files
  let root = document.createElement("ul");
  let title = document.createElement("h3");
  title.id = "tree_label";
  title.innerHTML = nameOfRepository;
  info.append(title);

  let link = document.createElement("a");
  link.href = url;
  link.innerHTML = "Visit Repository Page!"
  info.append(link);
  // add url of git repository


  root.setAttribute("role", "tree");
  root.setAttribute("aria-labelledby", "tree_label")


  var makeHtmlTree = function (hierarchy) {
    var dirs = Object.keys(hierarchy);
    let html = "";
    dirs.forEach(function (dir) {
      if (dir == "type" || dir == "sha" || dir == "path") {
        // Attribute("data-sha",hierarchy[dir]);
        return;
      }
      var node = hierarchy[dir];
      if (node.type == "blob") { // file
        html +=
          `<li role="treeitem" class="doc" data-type="${node.type}" data-sha="${node.sha}" data-path="${node.path}">
             ${dir}
           </li>
          `
      } else {
        html +=
          `<li role="treeitem" aria-expanded="false" data-type="${node.type}" data-sha="${node.sha}" data-path="${node.path}">
            <span>
              ${dir}
            </span>
            <ul role="group">
              ${makeHtmlTree(hierarchy[dir])}
            </ul>
         `
      }
    });
    return html;;
  };

  root.innerHTML = makeHtmlTree(hierarchy);
  info.append(root);
  let selectedElement = document.createElement("p");
  selectedElement.innerHTML =
    `
  <label>
    File or Folder Selected:
    <input id="last_action"
           type="text"
           size="15"
           readonly="">
  </label>`;
  info.append(selectedElement);

}
