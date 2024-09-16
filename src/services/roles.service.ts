import CustomError from "@/errors/customError";
import RoleModel from "@/models/roles.model";

let roleCache: Record<string, number> = {};

export const getRoleIdByName = async (roleName: string) => {
	if (roleCache[roleName]) return roleCache[roleName];

	const role = await RoleModel.query().findOne({ name: roleName });
	if (!role) throw new CustomError(404, `Role not found: ${roleName}`);

	roleCache[roleName] = role.id;
	return role.id;
};
