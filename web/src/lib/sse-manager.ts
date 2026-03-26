// sse-manager.ts
type SSEController = ReadableStreamDefaultController;

const globalForSse = global as unknown as {
  sseClients: Map<string, SSEController>;
};

// Singleton Map
export const sseClients =
  globalForSse.sseClients || new Map<string, SSEController>();

if (process.env.NODE_ENV !== "production") {
  globalForSse.sseClients = sseClients;
}

export function sendUpdate(jobId: string, stepId: number, status: string) {
  const controller = sseClients.get(jobId);

  if (!controller) {
    console.error(`❌ NO CONTROLLER for jobId: ${jobId}`);
    return;
  }

  const data = JSON.stringify({ stepId, status });

  try {
    controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
    console.log(`✅ SENT: Step ${stepId} (${status}) to Job ${jobId}`);
  } catch (err) {
    console.error(`⚠️ Failed to enqueue to ${jobId}:`, err);
    sseClients.delete(jobId); // Clean up broken connections
  }
}
