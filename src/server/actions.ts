"use server";

import { type Link } from "@prisma/client";
import { prisma } from "~/server/db";

export const addLink = async (
  link: Pick<Link, "url" | "slug">,
  userId: string
) => {
  // TODO: uncomment this when auth is working
  //   const session = await getServerSideSession();
  const session = { user: { id: userId } };

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
  // TODO Check user is owner of link
  return await prisma.link.delete({ where: { slug } });
};
