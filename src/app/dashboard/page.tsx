import { checkUserCanManageLinks, getServerSideSession } from "~/server/auth";
import { prisma } from "~/server/db";
import LinkList from "~/components/LinkList";
import AddLink from "~/components/AddLink";

const getLinks = async (userId?: string) =>
  prisma.link.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

const DashboardPage = async () => {
  await checkUserCanManageLinks();
  const session = await getServerSideSession();
  const links = await getLinks(session?.user.id);

  return (
    <div className="container grid gap-2">
      <h1>Dashboard</h1>
      <LinkList links={links} />
      <AddLink />
    </div>
  );
};

export default DashboardPage;
