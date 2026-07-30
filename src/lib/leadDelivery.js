/*
 * Runs a lead through multiple delivery channels (email, external lead API,
 * ...) concurrently, succeeding as a whole if any configured channel
 * succeeds. Used by src/app/api/contact/route.js and
 * src/app/api/chatbot/route.js so both forms share one delivery/error
 * pattern instead of duplicating Promise.allSettled handling.
 */

export async function deliverToChannels(channels, context) {
  const configured = channels.filter((channel) => channel.configured);

  if (configured.length === 0) {
    return { attempted: false, anySucceeded: false };
  }

  const results = await Promise.allSettled(
    configured.map((channel) => channel.send()),
  );

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `Failed to deliver ${context} via ${configured[index].name}:`,
        result.reason,
      );
    }
  });

  return {
    attempted: true,
    anySucceeded: results.some((result) => result.status === "fulfilled"),
  };
}
