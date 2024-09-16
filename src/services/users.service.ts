import config from "@/config";
import CustomError from "@/errors/customError";
import UserModel from "@/models/users.model";
import bcrypt from "bcrypt";
import { getRoleIdByName } from "./roles.service";

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
		.withGraphFetched("roles")
		.modifyGraph("roles", builder => {
			builder.select();
		})
		.onError(e => {
			throw new CustomError(500, e.message);
		});

	return user;
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

	return userDB;
};

const getUserFromDB = async (email: string, username: string = "") => {
	return await UserModel.query()
		.withGraphFetched("roles")
		.modifyGraph("roles", builder => {
			builder.select();
		})
		.where({ email })
		.orWhere({ username })
		.first();
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

const getHashPassword = async (password: string) => {
	try {
		return await bcrypt.hash(password, config.auth.saltRounds);
	} catch (error) {
		throw new CustomError(500, "Error hashing password");
	}
};

const getDecryptPassword = async (password: string, hashPassword: string) => {
	try {
		return await bcrypt.compare(password, hashPassword);
	} catch (error) {
		throw new CustomError(500, "Error decoding password");
	}
};
