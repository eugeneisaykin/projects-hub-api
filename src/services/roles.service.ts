import CustomError from "@/errors/customError";
import RoleModel from "@/models/roles.model";

let roleCache: Record<string | number, string | number> = {};

export const getRoleIdByName = async (roleName: string) => {
	if (roleCache[roleName]) {
		return roleCache[roleName];
	}

	const role = await RoleModel.query().findOne({ name: roleName });
	if (!role) throw new CustomError(404, `Role not found: ${roleName}`);

	roleCache[roleName] = role.id;
	roleCache[role.id] = roleName;

	return role.id;
};

export const getRoleNameById = async (roleId: number) => {
	if (roleCache[roleId]) {
		return roleCache[roleId];
	}

	const role = await RoleModel.query().findById(roleId);
	if (!role) throw new CustomError(404, `Role not found with ID: ${roleId}`);

	roleCache[roleId] = role.name;
	roleCache[role.name] = roleId;

	return role.name;
};
