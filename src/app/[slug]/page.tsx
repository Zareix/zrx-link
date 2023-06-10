import { notFound, redirect } from "next/navigation";
import { prisma } from "~/server/db";

const findLink = (slug: string) => prisma.link.findUnique({ where: { slug } });

const SlugPage = async ({ params: { slug } }: { params: { slug: string } }) => {
  const page = await findLink(slug);

  if (!page) {
    notFound();
  }

  return redirect(page.url);
};

export default SlugPage;
