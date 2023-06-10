"use server";

import { type Link } from "@prisma/client";
import { getServerActionSession } from "~/server/auth";
import { prisma } from "~/server/db";

export const addLink = async (link: Pick<Link, "url" | "slug">) => {
  const session = await getServerActionSession();

  if (!session) {
    throw new Error("You must be logged in to add a link");
  }

  return await prisma.link.create({
    data: {
      slug: link.slug,
      url: link.url,
      userId: session.user.id,
    },
  });
};

export const deleteLink = async (slug: string) => {
  const session = await getServerActionSession();
  if (!session) {
    throw new Error("You must be logged in to delete a link");
  }

  const link = await prisma.link.findUnique({ where: { slug } });

  if (!link) {
    throw new Error("Link not found");
  }

  if (link.userId !== session.user.id) {
    throw new Error("You must be the owner of the link to delete it");
  }

  return await prisma.link.delete({ where: { slug } });
};
