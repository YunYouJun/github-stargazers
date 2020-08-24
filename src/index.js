const fs = require("fs");
const { Octokit } = require("@octokit/core");
const octokit = new Octokit();

/**
 * 获得星数
 * @param {*} owner
 * @param {*} repo
 */
async function getStar(owner, repo) {
  const res = await octokit.request("GET /repos/{owner}/{repo}", {
    owner,
    repo,
  });
  return res.data.stargazers_count;
}

/**
 * 获得所有 Star 该项目的用户信息
 * @param {*} owner
 * @param {*} repo
 * @param {*} page
 */
async function getAllStargazers(owner, repo) {
  const star_count = await getStar(owner, repo);
  const page = Math.ceil(star_count / 100);

  let stargazers = [];
  for (let i = 1; i <= page; i++) {
    const res = await octokit.request("GET /repos/{owner}/{repo}/stargazers", {
      owner,
      repo,
      per_page: 100,
      page: i,
    });
    stargazers = stargazers.concat(res.data);
  }
  return stargazers;
}

/**
 * 主入口
 */
async function main() {
  const owner = "YunYouJun";
  const repo = "hexo-theme-yun";

  // write all stargazers to txt
  const stargazers = await getAllStargazers(owner, repo);
  let content = "";
  stargazers.forEach((stargazer) => {
    content += "@" + stargazer.login + "\n";
  });
  fs.writeFileSync("./dist/stargazers.txt", content);
}

main();
