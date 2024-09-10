import config from "@/config";
import CustomError from "@/errors/customError";
import RoleModel from "@/models/roles.model";
import UserModel from "@/models/users.model";
import bcrypt from "bcrypt";

let roleCache: Record<string, number> = {};

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

	await getUserIsExist(email, username);

	const hashPassword = await getHashPassword(password);
	const roleId = await getRoleIdByName(role);

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

	const result = user.$omitFromJson(["roleId"]).toJSON();

	return {
		...result,
		role,
	};
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

export const getUserIsExist = async (email: string, username: string) => {
	const existingUser = await UserModel.query()
		.where({ email })
		.orWhere({ username })
		.first();
	if (existingUser) {
		throw new CustomError(
			409,
			"A user with the same email or username already exists"
		);
	}
};

export const getRoleIdByName = async (roleName: string) => {
	if (roleCache[roleName]) return roleCache[roleName];

	const role = await RoleModel.query().select().where("name", roleName).first();
	if (!role) throw new CustomError(404, "Role not found");

	roleCache[roleName] = role.id;
	return role.id;
};
