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
  auth: "c7a9a870bf8f3a5bd5489f8e879c56baee14f498",
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

function getMasterCommits(sha_master_ref) {
  return octokit
        .paginate(`GET /repos/${owner}/${repo}/git/commits/${sha_master_ref}`, {
        }
        )
        .then((arrayCommits) => {
          if (arrayCommits[0]){
            const commitSha = arrayCommits[0].sha;
            //console.log(shaOfLatestCommit);
            const treeSha = arrayCommits[0].tree.sha;
            //commits.map((com) => com.tree.sha);
            //console.log(commits.map((com) => com.tree.sha));
            //console.log(`tre ${shaOfLatestCommitTree}`);
            console.log(arrayCommits);

            return { commitSha, treeSha};
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
function getRootTree(treeSha) {
  var tree = octokit.git.getTree({
    owner: owner,
    repo: repo,
    tree_sha: treeSha,
    recursive: true
  }).then((response) => {
    console.log(response);
  })
}

function getBlob(fileSha) {
  octokit.git.getBlob({
    owner: owner,
    repo: repo,
    file_sha: fileSha,
  }).then((data) => {
    console.log(data.data.content);
  })
}

// -----------------------------------------------------

// Create ----------------------------------------------
function createBlob(input) {
  return octokit.git.createBlob({
    owner: owner,
    repo: repo,
    content: input,
    encoding: "utf-8|base64",
  }).then((blobResponse) => {
    if(blobResponse.status === 201){
      console.log(blobResponse);
      const shaOfBlob = blobResponse.data.sha;
      const urlOfBlob = blobResponse.data.url;
      return {shaOfBlob,urlOfBlob}
    }
  })
}

function removeFile(path, base_tree) {
  octokit.git.createTree({
    owner: owner,
    repo: repo,
    tree: [
      {
        "path": path,
        "mode": "100644",
        "type": "blob",
        "sha": null,
      }
    ],
    base_tree: base_tree
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
// TODO
function updateFile(base_tree) {
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
    base_tree: base_tree
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

function createTree(path,mode,type,shaOfNode,base_tree) {
  return octokit.git.createTree({
    owner: owner,
    repo: repo,
    tree: [
      {
        "path": path,
        "mode": mode,
        "type": type,
        "sha": shaOfNode,
      }
    ],
    base_tree: base_tree
  }).then((response) => {
    console.log(response);
    if(response.status === 201){
      const newTreeSha = response.data.sha
      return newTreeSha;
    }
    else {
      return null;
    }
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

function createCommit(message = "Default empty message", new_tree, parent) {
  return octokit.git.createCommit({
    owner: owner,
    repo: repo,
    message: message,
    tree: new_tree,
    parents: [parent],
  }).then((response) => {
    console.log(response);
    if(response.status === 201){
      const commitSha = response.data.sha;
      return commitSha
    }
    else {
      return null;
    }
  })
}

function updateRef(newCommitSha) {
  console.log(`sha of new commit ${newCommitSha}`)
  return octokit.git.updateRef({
    owner: owner,
    repo: repo,
    ref: "heads/master",
    sha: newCommitSha,
  }).then((data) => {
    if(data.status === 200){
      alert("Success new file commited to repository");
      return data;
    }
    else {
      alert(`Error ${data.status}`);
    }
  })
}

async function createFile(input = "empty file",path = "testfile.txt") {
  const sha_master_ref = await getMasterBranch();
  const latestCommitIds = await getMasterCommits(sha_master_ref);
  //const blobIds = await createBlob(input);
  //const newTreeSha = await createTree(`${path}`,"100644","blob",blobIds["shaOfBlob"],latestCommitIds["treeSha"]);
  //const newCommitSha = await createCommit(`createFile ${path}`,newTreeSha,latestCommitIds["commitSha"]);
  //const updateRefShaResponse = await updateRef(newCommitSha);
}

createFile();
//removeAndUpdate();
//createCommit();
//updateRef();
//tryCommits();
// getMasterBranch();
// getMasterRef();
//createBlob();
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