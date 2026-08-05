"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

type ContactMessageStatus =
  | "NEW"
  | "READ"
  | "ANSWERED"
  | "ARCHIVED";

const allowedStatuses = new Set<ContactMessageStatus>([
  "NEW",
  "READ",
  "ANSWERED",
  "ARCHIVED",
]);

export async function updateContactMessageStatus(
  messageId: number,
  status: ContactMessageStatus,
) {
  if (!Number.isInteger(messageId) || messageId <= 0) {
    return {
      success: false,
      message: "Mesajul selectat nu este valid.",
    };
  }

  if (!allowedStatuses.has(status)) {
    return {
      success: false,
      message: "Statusul selectat nu este valid.",
    };
  }

  const message = await prisma.contactMessage.findUnique({
    where: {
      id: messageId,
    },
    select: {
      id: true,
    },
  });

  if (!message) {
    return {
      success: false,
      message: "Mesajul nu mai există.",
    };
  }

  await prisma.contactMessage.update({
    where: {
      id: messageId,
    },
    data: {
      status,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/mesaje");
  revalidatePath(`/admin/mesaje/${messageId}`);

  return {
    success: true,
    message: "Statusul mesajului a fost actualizat.",
  };
}