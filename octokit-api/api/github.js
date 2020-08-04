const { Octokit } = require("@octokit/rest");
const { retry } = require("@octokit/plugin-retry");
const MyOctokit = Octokit.plugin(retry);
export class Github {
    constructor(owner, repo, personelToken) {
        this.owner = owner;
        this.repo = repo;
        this.personelToken = personelToken; //c7a9a870bf8f3a5bd5489f8e879c56baee14f498
        this.octokit = new MyOctokit({
            auth: this.personelToken,
            log: {
                debug: () => { },
                info: () => { },
                warn: console.warn,
                error: console.error
            }
        });
    }
    // Get Methods -----------------------------------------------------
    async getBranches() {
        await this.octokit
            .paginate(`GET /repos/${this.owner}/${this.repo}/branches`, {
            },
            )
            .then((data) => {
                console.log(data);
            });
    }

    async getMasterBranch() {
        return await this.octokit
            .paginate(`GET /repos/${this.owner}/${this.repo}/git/refs/heads/master`, {
            },
            )
            .then((data) => {
                if (data[0]) {
                    const sha1 = data[0].object.sha;
                    return sha1;
                } else {
                    return null;
                }
            })
    }

    async getMasterCommits(sha_master_ref) {
        return await this.octokit
            .paginate(`GET /repos/${this.owner}/${this.repo}/git/commits/${sha_master_ref}`, {
            }
            )
            .then((arrayCommits) => {
                if (arrayCommits[0]) {
                    const commitSha = arrayCommits[0].sha;
                    //console.log(shaOfLatestCommit);
                    const treeSha = arrayCommits[0].tree.sha;
                    //commits.map((com) => com.tree.sha);
                    //console.log(commits.map((com) => com.tree.sha));
                    //console.log(`tre ${shaOfLatestCommitTree}`);
                    console.log(arrayCommits);

                    return { commitSha, treeSha };
                }
                else {
                    return null;
                }
            });
    }
    async getPullRequests() {
        return await this.octokit
            .paginate(this.octokit.pulls.list, {
                owner: this.owner,
                repo: this.repo,
            }, (response) => response.data.map((pull) => pull.title)
            )
            .then((pulls) => {
                console.log(pulls)
                // pull requests title
            });
    }

    async getIssues() {
        return await this.octokit
            .paginate(
                `GET /repos/${this.owner}/${this.repo}/issues`,
                {},
                (response) => response.data.map((issue) => [issue.title, issue.state])
            )
            .then((issueTitlesAndStates) => {
                console.log(issueTitlesAndStates);

            });
    }

    async getAllTags() {
        return await this.octokit
            .paginate(
                `GET /repos/${this.owner}/${this.repo}/tags`,
                {}
            )
            .then((data) => {
                console.log(data);
            });
    }

    async getReleases() {
        return await this.octokit
            .paginate(
                `GET /repos/${this.owner}/${this.repo}/releases`,
                {}
            )
            .then((data) => {
                console.log(data);
            });
    }

    async getRootTree(treeSha) {
        return await this.octokit.git.getTree({
            owner: this.owner,
            repo: this.repo,
            tree_sha: treeSha,
            recursive: true
        }).then((response) => {
            console.log(response);
        })
    }

    async getBlob(fileSha) {
        return await this.octokit.git.getBlob({
            owner: this.owner,
            repo: this.repo,
            file_sha: fileSha,
        }).then((data) => {
            console.log(data.data.content);
        })
    }

    async getMasterRef() {
        return await this.octokit
            .paginate(
                `GET /repos/${this.owner}/${this.repo}/git/matching-refs/heads/master`,
                {}, (response) => response.data.map((elemtent) => elemtent.ref)
            )
            .then((data) => {
                console.log(`getmaster ref ${data}`);
                if (data[0]) {
                    ref = data[0];
                }
            });
    }

    // -----------------------------------------------------

    // Create Methods ----------------------------------------------
    async createBlob(input) {
        return await this.octokit.git.createBlob({
            owner: this.owner,
            repo: this.repo,
            content: input,
            encoding: "utf-8|base64",
        }).then((blobResponse) => {
            if (blobResponse.status === 201) {
                console.log(blobResponse);
                const shaOfBlob = blobResponse.data.sha;
                const urlOfBlob = blobResponse.data.url;
                return { shaOfBlob, urlOfBlob }
            }
        })
    }

    async createTree(path, mode, type, shaOfNode, base_tree) {
        return await this.octokit.git.createTree({
            owner: this.owner,
            repo: this.repo,
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
            if (response.status === 201) {
                const newTreeSha = response.data.sha
                return newTreeSha;
            }
            else {
                return null;
            }
        })

    }

    async createCommit(message = "Default empty message", new_tree, parent) {
        return await this.octokit.git.createCommit({
            owner: this.owner,
            repo: this.repo,
            message: message,
            tree: new_tree,
            parents: [parent],
        }).then((response) => {
            console.log(response);
            if (response.status === 201) {
                const commitSha = response.data.sha;
                return commitSha
            }
            else {
                return null;
            }
        })
    }

    async updateRef(newCommitSha) {
        console.log(`sha of new commit ${newCommitSha}`)
        return await this.octokit.git.updateRef({
            owner: this.owner,
            repo: this.repo,
            ref: "heads/master",
            sha: newCommitSha,
        })
    }

    async createFile(input = "empty file", path = "testfile2.txt") {
        try {
            const sha_master_ref = await this.getMasterBranch();
            const latestCommitIds = await this.getMasterCommits(sha_master_ref);
            const blobIds = await this.createBlob(input);
            const newTreeSha = await this.createTree(`${path}`, "100644", "blob", blobIds["shaOfBlob"], latestCommitIds["treeSha"]);
            const newCommitSha = await this.createCommit(`createFile ${path}`, newTreeSha, latestCommitIds["commitSha"]);
            this.updateRef(newCommitSha);
            alert("success");
        }
        catch (err) {
            alert(`Error: "${err}" \n Might be too many request to git API wait 30 seconds`)
        }
    }
    async deleteFile(path) {
        try {
            const sha_master_ref = await this.getMasterBranch();
            const latestCommitIds = await this.getMasterCommits(sha_master_ref);
            const newTreeSha = await this.createTree(`${path}`, "100644", "blob", null, latestCommitIds["treeSha"]);
            const newCommitSha = await this.createCommit(`deleteFile ${path}`, newTreeSha, latestCommitIds["commitSha"]);
            this.updateRef(newCommitSha);
        }
        catch (err) {
            alert(`Error ${err} \n Try again later and check if object is not already deleted`);
        }
    }
    async editFile(originPath, newName, input) {
        try {
            const sha_master_ref = await this.getMasterBranch();
            const latestCommitIds = await this.getMasterCommits(sha_master_ref);
            const newTreeSha = await this.createTree(`${path}`, "100644", "blob", null, latestCommitIds["treeSha"]);
            const newCommitSha = await this.createCommit(`editFile ${path}`, newTreeSha, latestCommitIds["commitSha"]);
            this.updateRef(newCommitSha);
        }
        catch (err) {
            alert(`Error ${err} \n Try again later and check if object is not already deleted`);
        }
    }
}