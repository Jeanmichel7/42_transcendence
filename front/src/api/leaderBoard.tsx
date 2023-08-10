import { apiRequest } from "./index";
import { ApiErrorResponse, UserInterface } from "../types";

export async function getLeaderboard(
  page: number,
  offset: number
): Promise<UserInterface[] | ApiErrorResponse> {
  return apiRequest<UserInterface[]>(
    "get",
    "/users/leaderboard?page=" + page + "&offset=" + offset,
    "Failed to get leaderboard: "
  );
}
