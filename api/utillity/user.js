import { makeApiCall } from "./basefunctions";
import { ShowError } from "./utillity";
import { getCookies } from "./cookieManager";
import UserModel from "../models/userModel";

export async function getUserByID() {
    
}

export async function getUserByUsernameOrEMail(search) {
   
}

export async function getAllUsers() {
   
}

function convertJsonToModel(data) {
    if (Array.isArray(data)) {
        return data.map(d => new UserModel(
            d.id,
            d.email,
            d.name,
        ));
    } else {
        return new UserModel(
            data.id,
            data.email,
            data.name,
        );
    }
}
