import cron from "node-cron";
import lucia from "./lucia.service";

const deleteExpiredSessions = async () => {
	try {
		await lucia.deleteExpiredSessions();
		console.log("Expired sessions have been successfully deleted");
	} catch (error) {
		console.error("Error deleting expired sessions:", error);
	}
};

export const startSessionCleanupCron = (interval: string) => {
	cron.schedule(interval, () => {
		console.log("Start deleting expired sessions");
		deleteExpiredSessions();
	});

	console.log("Cron task for clearing expired sessions is configured");
};
