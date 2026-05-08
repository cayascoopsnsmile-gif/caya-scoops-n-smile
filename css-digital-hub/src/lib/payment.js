export async function createCheckoutIntent(orderPayload) {
  return {
    status: "placeholder",
    message: "Payment flow is currently a placeholder until a gateway is connected.",
    orderPayload
  };
}
