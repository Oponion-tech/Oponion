import { convertJsonToUserModel } from "../models/userModel";

export async function getUserInformation() {
  const mockUserInformation = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    points: 1000
  };
  return convertJsonToUserModel(mockUserInformation);
}