import config from "@/config";
import CustomError from "@/errors/customError";
import UserModel from "@/models/users.model";
import bcrypt from "bcrypt";
import { getRoleIdByName, getRoleNameById } from "./roles.service";

interface UserInfo {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	role: string;
}

export const createUserService = async (userInfo: UserInfo) => {
	const { username, firstName, lastName, email, role, password } = userInfo;

	const userDB = await getUserFromDB(email, username);
	if (userDB) {
		throw new CustomError(
			409,
			"A user with the same email or username already exists"
		);
	}

	const hashPassword = await getHashPassword(password);
	const roleId = +(await getRoleIdByName(role));

	const user = await UserModel.query()
		.insertAndFetch({
			username,
			firstName,
			lastName,
			email,
			roleId,
			password: hashPassword,
		})
		.onError(e => {
			throw new CustomError(500, e.message);
		});
	return formatUserResponse(user, role);
};

export const authUserService = async (email: string, password: string) => {
	const userDB = await getUserFromDB(email);
	if (!userDB) {
		throw new CustomError(401, "Invalid email or password");
	}

	const verifyPassword = await getDecryptPassword(password, userDB.password);
	if (!verifyPassword) {
		throw new CustomError(401, "Invalid email or password");
	}

	const role = String(await getRoleNameById(userDB.roleId));

	return formatUserResponse(userDB, role);
};

export const getAllUsersService = async (role?: string) => {
	const query = UserModel.query()
		.withGraphFetched("roles")
		.modifyGraph("roles", builder => {
			builder.select();
		});

	if (role) {
		query.joinRelated("roles").where("roles.name", role);
	}

	return await query.onError(e => {
		throw new CustomError(500, e.message);
	});
};

export const getHashPassword = async (password: string) => {
	try {
		return await bcrypt.hash(password, config.auth.saltRounds);
	} catch (error) {
		throw new CustomError(500, "Error hashing password");
	}
};

export const getDecryptPassword = async (
	password: string,
	hashPassword: string
) => {
	try {
		return await bcrypt.compare(password, hashPassword);
	} catch (error) {
		throw new CustomError(500, "Error decoding password");
	}
};

export const getUserFromDB = async (email: string, username: string = "") => {
	return await UserModel.query().where({ email }).orWhere({ username }).first();
};

const formatUserResponse = (user: any, role: string) => {
	const result = user.$omitFromJson(["roleId"]).toJSON();
	return {
		...result,
		role,
	};
};
