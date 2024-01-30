import { exitWithMsg } from "../../exit-with-msg";
import { apiRequest } from "../apis/api-request";

export const deploy = async ({
  fileId,
  projectId,
  userId,
}: {
  fileId: number;
  projectId: number;
  userId: number;
}) => {
  // submits the deployment
  try {
    const { data } = await apiRequest({
      method: "POST",
      data: {
        file_id: fileId,
        project_id: projectId,
        user_id: userId,
      },
      route: "/deploy",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!data || !data.success || !data.data.id) {
      exitWithMsg("> Failed to create deployment:", data);
    }

    return data.data;
  } catch (error: any) {
    console.log("Error", error);
    await exitWithMsg("Error creating deployment!");
  }
};
