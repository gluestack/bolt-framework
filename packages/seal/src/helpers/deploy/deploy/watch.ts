import Store from "../../../libraries/store";
import { deployment } from "../apis/handlers/gql";

let count = 50;

export const watch = async (store: Store) => {
  let deploymentId = store.get("deployment_id");

  // prompts to collect Project ID from user
  if (!deploymentId) {
    console.log("> Deployment not saved properly... Please try again later.");
    return;
  }

  let interval = setInterval(async () => {
    const isDone: boolean = await getDeployment(deploymentId, store);
    if (isDone) {
      clearInterval(interval);
    }
  }, 5 * 1000);
};

async function getDeployment(
  deploymentId: number,
  store: Store,
): Promise<boolean> {
  try {
    const team = store.get("team");
    const { db_deployments_by_pk }: any = await deployment(deploymentId, team.token);
    return await showAndGetProgress(
      db_deployments_by_pk.infra_json,
    );
  } catch (err) {
    console.log("> Error fetching deployment... Please try again later.");
    return true;
  }
}

function parseToTable(obj: any) {
  return {
    Step: obj.deployment_task.action.replaceAll("_", " "),
    Status: obj.status,
    "Started at": obj.started_at
      ? new Date(obj.started_at).toLocaleString()
      : "N/A",
    "Ended at": obj.ended_at ? new Date(obj.ended_at).toLocaleString() : "N/A",
  };
}

async function showAndGetProgress(
  infra_json: string,
): Promise<boolean> {
  if (!infra_json) {
    if (--count === 0) {
      console.log("> Error fetching deployment... Please try again later.");
      return true;
    }
    return false;
  }
  try {
    let infra_object: any = JSON.parse(infra_json);
    if (infra_object.error) {
      console.log(`> Error : ${infra_object.error}`);
      return true;
    }

    const myTable: any = [];
    let flag = true;
    Object.keys(infra_object).map((key: any) => {
      if (infra_object[key].status === "inprogress" || infra_object[key].status === "pending") {
        flag = false;
      }
      myTable.push(parseToTable(infra_object[key]));
    });
    console.clear();
    console.log('> Watching deployment!\n');
    console.log("> Refreshed at...", new Date().toLocaleString());
    console.table(myTable);
    if (flag) {
      Object.keys(infra_object).map((key: any) => {
        if (infra_object[key].deployment_task.action === "domain_mapping") {
          try {
            const comments = JSON.parse(infra_object[key].comments);
            const endpoints: any = comments.data.endpoints.map(
              (endpoint: any) => {
                return {
                  "Domain": `https://${endpoint.domain}`,
                };
              },
            );
            console.table(endpoints);
          } catch (e) {
            //
          }
        }
      });
    }
    return flag;
  } catch (e) {
    //
  }
  return true;
}
