import config from "@/config";
import CustomError from "@/errors/customError";
import UserModel from "@/models/users.model";
import bcrypt from "bcrypt";
import { getRoleInfo } from "./roles.service";

interface UserInfo {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export const createUserService = async (userInfo: UserInfo) => {
	const { username, firstName, lastName, email, password } = userInfo;

	const userDB = await getUserFromDB(email, username);
	if (userDB) {
		throw new CustomError(
			409,
			"A user with the same email or username already exists"
		);
	}

	const hashPassword = await getHashPassword(password);
	const roleInfo = await getRoleInfo(config.defaultUserInfo.role);

	if (!roleInfo) {
		throw new CustomError(404, "Role not found");
	}

	const user = await UserModel.query()
		.insertAndFetch({
			username,
			firstName,
			lastName,
			email,
			roleId: roleInfo.id,
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

export const getUserFromDB = async (email: string, username: string = "") => {
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

export const updateUserRoleService = async (
	userId: number,
	newRole: string
) => {
	const userToUpdate = await UserModel.query()
		.findById(userId)
		.withGraphFetched("roles")
		.modifyGraph("roles", builder => {
			builder.select();
		});

	if (!userToUpdate) {
		throw new CustomError(404, "User not found");
	}

	if (userToUpdate?.roles?.name === "admin") {
		throw new CustomError(403, "You cannot change the role of another admin");
	}

	const newRoleInfo = await getRoleInfo(newRole);

	if (!newRoleInfo) {
		throw new CustomError(400, "Invalid role");
	}

	const updatedUser = await UserModel.query()
		.patchAndFetchById(userId, { roleId: newRoleInfo.id })
		.withGraphFetched("roles");

	return updatedUser;
};

export const deleteUserService = async (userId: number) => {
	const userToDelete = await UserModel.query()
		.findById(userId)
		.withGraphFetched("roles")
		.modifyGraph("roles", builder => {
			builder.select();
		});

	if (!userToDelete) {
		throw new CustomError(404, "User not found");
	}

	if (userToDelete?.roles?.name === "admin") {
		throw new CustomError(403, "You cannot change the role of another admin");
	}

	await UserModel.query()
		.deleteById(userId)
		.onError(e => {
			throw new CustomError(500, e.message);
		});
};

export const updateUserService = async (userId: string, newUserValue: any) => {
	if (newUserValue.password) {
		newUserValue.password = await getHashPassword(newUserValue.password);
	}
	const updatedUser = await UserModel.query()
		.patchAndFetchById(userId, newUserValue)
		.withGraphFetched("roles")
		.modifyGraph("roles", builder => {
			builder.select();
		})
		.onError(e => {
			throw new CustomError(500, e.message);
		});
	return updatedUser;
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
