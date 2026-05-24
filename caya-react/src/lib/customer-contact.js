import { addDoc, collection } from "firebase/firestore";
import { db, firestoreServerTimestamp } from "@/lib/firebase.js";

export function submitCustomerFeedback({ customerEmail, message, rating }) {
  return addDoc(collection(db, "customerFeedback"), {
    createdAt: firestoreServerTimestamp(),
    customerEmail: String(customerEmail || "").trim().toLowerCase(),
    message: String(message || "").trim(),
    rating: Number(rating || 5)
  });
}

export function buildCustomerContactWhatsappUrl({ businessPhone, message, name, phone }) {
  const normalizedPhone = String(businessPhone || "18687643467").replace(/[^\d]/g, "");
  const text = `Hi Caya Scoops N Smile, this is ${String(name || "Customer").trim() || "Customer"}.\nPhone: ${String(phone || "N/A").trim() || "N/A"}\n\n${String(message || "").trim()}`;
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(text)}`;
}
