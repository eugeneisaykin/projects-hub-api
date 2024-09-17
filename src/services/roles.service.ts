import CustomError from "@/errors/customError";
import RoleModel from "@/models/roles.model";

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

		if (!role) {
			throw new CustomError(404, `Role not found: ${identifier}`);
		}

		return role;
	} catch (error: any) {
		throw new CustomError(500, error.message);
	}
};
