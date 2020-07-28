const { Octokit } = require("@octokit/rest");
const { retry } = require("@octokit/plugin-retry");
const MyOctokit = Octokit.plugin(retry);

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
//// initialize
const octokit = new MyOctokit({
  auth: "91530905c8a942915ce978ad766c8947e3dcc9f8",
   log: {
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error
  }
});

const owner = "gadireddi226"
const repo = "Testing-Tool"
var ref;
var tree_sha;

//get all branches
function getBranches() {
  octokit
    .paginate(`GET /repos/${owner}/${repo}/branches`, {
    },
    )
    .then((data) => {
      console.log(data);

    });
}


// Get Methods -----------------------------------------------------

function getMasterBranch() {
  return octokit
    .paginate(`GET /repos/${owner}/${repo}/git/refs/heads/master`, {
    },
    )
    .then((data) => {
      if(data[0]){
      const sha1 = data[0].object.sha;
      return sha1;
      } else {
        return null;
      }
      // octokit
      //   .paginate(`GET /repos/${owner}/${repo}/git/commits/${sha}`, {
      //   }
      //   )
      //   .then((commits) => {
      //     console.log(commits);
      //     const tree_sha_array = commits.map((com) => com.tree.sha);
      //     //console.log(commits.map((com) => com.tree.sha));
      //     tree_sha = tree_sha_array[0];
      //     console.log(tree_sha);
      //   });
    })
}

function getMasterCommits() {
  return octokit
        .paginate(`GET /repos/${owner}/${repo}/git/commits/217433e5e496149ba3ea0a97ec377bb072339a3f`, {
        }
        )
        .then((arrayCommits) => {
          if (arrayCommits[0]){
          const shaOfLatestCommit = arrayCommits[0].sha;
          //console.log(shaOfLatestCommit);
          const shaOfLatestCommitTree = arrayCommits[0].tree.sha;
          //commits.map((com) => com.tree.sha);
          //console.log(commits.map((com) => com.tree.sha));
          //console.log(`tre ${shaOfLatestCommitTree}`);

          return { shaOfLatestCommit, treeSha: shaOfLatestCommitTree};
          }
          else{
            return null;
          }
        });
}
function getPullRequests() {
  octokit
    .paginate(octokit.pulls.list, {
      owner: owner,
      repo: repo,
    }, (response) => response.data.map((pull) => pull.title)
    )
    .then((pulls) => {
      console.log(pulls)
      // pull requests title
    });
}

function getIssues() {
  octokit
    .paginate(
      `GET /repos/${owner}/${repo}/issues`,
      {},
      (response) => response.data.map((issue) => [issue.title, issue.state])
    )
    .then((issueTitlesAndStates) => {
      console.log(issueTitlesAndStates);

    });
}

// //list tags
function getAllTags() {
  octokit
    .paginate(
      `GET /repos/${owner}/${repo}/tags`,
      {}
    )
    .then((data) => {
      console.log(data);
    });
}

//list releases
function getReleases() {
  octokit
    .paginate(
      `GET /repos/${owner}/${repo}/releases`,
      {}
    )
    .then((data) => {
      console.log(data);
    });
}

// get file_tree
// testing sha-tree 88aff31d37aaa221b809167a93cc9a4891cf491c
function getRootTree() {
  var tree = octokit.git.getTree({
    owner: owner,
    repo: repo,
    tree_sha: "5cad5e5130fddd678491691a287cf1e1c6b637e9",
    recursive: true
  }).then((response) => {
    console.log(response);
  })
}

function getBlob() {
  octokit.git.getBlob({
    owner: owner,
    repo: repo,
    file_sha: "fda67d724654d41ceb8996065fc0705a9ac58224",
  }).then((data) => {
    console.log(data.data.content);
  })
}

// -----------------------------------------------------

// Create ----------------------------------------------
function createBlob() {
  var resp = octokit.git.createBlob({
    owner: owner,
    repo: repo,
    content: "Content of the blob",
    encoding: "base64",
  }).then((data) => {
    console.log(data);
  })
  console.log(resp);
}

function removeAndUpdate() {
  octokit.git.createTree({
    owner: owner,
    repo: repo,
    tree: [
      {
        "path": "testFile.txt",
        "mode": "100644",
        "type": "blob",
        "sha": null,
      }
    ],
    base_tree: "5cad5e5130fddd678491691a287cf1e1c6b637e9"
  }).then((response) => {
    console.log(response);
    // octokit.git.createCommit({
    //   owner:owner,
    //   repo:repo,
    //   message:"New commit",
    //   tree:"5cad5e5130fddd678491691a287cf1e1c6b637e9",
    //   parents:["f221bd506e9b772bd149ed912693da6eb8f17628"],
    // }).then((data)=>{
    //   console.log(data);
    // })
  })
}

function getMasterRef() {
  octokit
    .paginate(
      `GET /repos/${owner}/${repo}/git/matching-refs/heads/master`,
      {},(response) => response.data.map((elemtent) => elemtent.ref)
    )
    .then((data) => {
      console.log(`getmaster ref ${data}`);
      if (data[0]) {
      ref = data[0];
      }
    });
}

function createCommit() {
  octokit.git.createCommit({
    owner: owner,
    repo: repo,
    message: "New commit3",
    tree: "f3c8aa091d6d536fc15b5bd8b75bdbdea5c98d1f",
    parents: ["465f7da6995f565a3548175d05fae214a48a6eaf"],
  }).then((data) => {
    console.log(data.sha);
    console.log(data);
  })
}

function updateRef() {
  octokit.git.updateRef({
    owner: owner,
    repo: repo,
    ref: "heads/master",
    sha: "217433e5e496149ba3ea0a97ec377bb072339a3f",
  }).then((data) => {
    console.log(data);
  })
}

async function createFile() {
  const sha_master_ref = await getMasterBranch();
  const latestCommitIds = await getMasterCommits();
  console.log(sha_master_ref);
  console.log(latestCommitIds);
  //to be continued
}
//removeAndUpdate();
//createCommit();
//updateRef();
//tryCommits();
// getMasterBranch();
// getMasterRef();
tryCommits();
//getRootTree();
//getMasterBranch();
//removeAndUpdate();
//createCommit();
//createCommit();
//createBlob();
//getBlob();
//removeAndUpdate();
//getMasterBranch();
//"5cad5e5130fddd678491691a287cf1e1c6b637e9"
//"465f7da6995f565a3548175d05fae214a48a6eaf"