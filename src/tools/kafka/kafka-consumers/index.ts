import { userConsumer } from "./user.consumer";
import { notificationConsumer } from "./utils.consumer";

export async function loadConsumer() {
    await Promise.all([notificationConsumer()]);
    console.log("consumer loaded");
}