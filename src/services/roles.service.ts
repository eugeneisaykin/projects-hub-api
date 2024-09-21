import CustomError from "@/errors/customError";
import RoleModel from "@/models/roles.model";

interface RoleInfo {
	name: string;
	description: string;
}

export const createRoleService = async (userInfo: RoleInfo) => {
	const { name, description } = userInfo;

	const roleDB = await getRoleInfo(name);
	if (roleDB) {
		throw new CustomError(409, "A role with the same name already exists");
	}

	const role = await RoleModel.query()
		.insertAndFetch({
			name,
			description,
		})
		.onError(e => {
			throw new CustomError(500, e.message);
		});

	return role;
};

export const getAllRolesService = async () => {
	return await RoleModel.query().onError(e => {
		throw new CustomError(500, e.message);
	});
};

export const getRoleInfo = async (identifier: number | string) => {
	try {
		let role;

		if (typeof identifier === "number") {
			role = await RoleModel.query().findById(identifier);
		} else if (typeof identifier === "string") {
			role = await RoleModel.query().findOne({ name: identifier });
		} else {
			throw new CustomError(400, "Invalid identifier type");
		}

		return role;
	} catch (error: any) {
		throw new CustomError(500, error.message);
	}
};
