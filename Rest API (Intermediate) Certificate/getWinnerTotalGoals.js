const axios = require("axios");
/*
 * Complete the 'getWinnerTotalGoals' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts following parameters:
 *  1. STRING competition
 *  2. INTEGER year
 */

const handleRequest = async (
  team,
  year,
  page,
  whichTeam = 1,
  competition = ""
) => {
  const URL = "https://jsonmock.hackerrank.com/api/football_matches";
  const params = {};
  params["year"] = year;
  params[`team${whichTeam}`] = team;
  params["page"] = page;
  params["competition"] = competition;
  const { data } = await axios.get(URL + `?${new URLSearchParams(params)}`);
  return data;
};

const handleData = async (team, whichTeam, competition, year) => {
  let teamNum = "team" + whichTeam + "goals";
  const { data, page, total_pages, per_page } = await handleRequest(
    team,
    year,
    1,
    whichTeam,
    competition
  );
  let goals = 0;
  for (let i = 1; i < total_pages + 1; i++) {
    const { data } = await handleRequest(team, year, i, whichTeam, competition);
    goals =
      goals +
      data.reduce(
        (accumulator, currentValue) =>
          accumulator + Number(currentValue[teamNum]),
        0
      );
  }
  return goals;
};

const getTotalGoals = async (team, year, competition) => {
  let totalGoals = 0;
  totalGoals = await handleData(team, 1, competition, year);
  totalGoals = totalGoals + (await handleData(team, 2, competition, year));
  return totalGoals;
};

async function getWinnerTotalGoals(competition, year) {
  let goalsWinner = 0;
  let winnerTeam;

  const responseAPI = await axios.get(
    `https://jsonmock.hackerrank.com/api/football_competitions?${new URLSearchParams(
      {
        year: year,
        name: competition,
      }
    )}`
  );
  if (responseAPI.data && responseAPI.data.data) {
    winnerTeam = responseAPI.data.data[0].winner;
  }
  return getTotalGoals(winnerTeam, year, competition);
}

(async () => {
  const data = await getWinnerTotalGoals("UEFA Champions League", "2011");
  console.log(data);
})().catch((e) => {
  console.log(e);
});
