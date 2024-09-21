import CustomError from "@/errors/customError";
import StatusModel from "@/models/statuses.model";

interface StatusInfo {
	name: string;
	description: string;
}

export const createStatusService = async (statusInfo: StatusInfo) => {
	const { name, description } = statusInfo;

	const statusDB = await getStatusInfo(name);
	if (statusDB) {
		throw new CustomError(409, "A status with the same name already exists");
	}

	const status = await StatusModel.query()
		.insertAndFetch({
			name,
			description,
		})
		.onError(e => {
			throw new CustomError(500, e.message);
		});

	return status;
};

export const deleteStatusService = async (statusId: number) => {
	const statusInfo = await getStatusInfo(statusId);

	if (!statusInfo) {
		throw new CustomError(404, "Status not found");
	}

	await StatusModel.query()
		.deleteById(statusId)
		.onError(e => {
			throw new CustomError(500, e.message);
		});
};

export const getAllStatusesService = async () => {
	return await StatusModel.query().onError(e => {
		throw new CustomError(500, e.message);
	});
};

export const getStatusInfo = async (identifier: number | string) => {
	try {
		let status;

		if (typeof identifier === "number") {
			status = await StatusModel.query().findById(identifier);
		} else if (typeof identifier === "string") {
			status = await StatusModel.query().findOne({ name: identifier });
		} else {
			throw new CustomError(400, "Invalid identifier type");
		}

		return status;
	} catch (error: any) {
		throw new CustomError(500, error.message);
	}
};
