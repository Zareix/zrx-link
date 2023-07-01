import { checkUserCanManageLinks } from "~/server/auth";
import { prisma } from "~/server/db";
import LinkList from "~/components/LinkList";
import AddLink from "~/components/AddLink";

const getLinks = async () =>
  prisma.link.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

const DashboardPage = async () => {
  await checkUserCanManageLinks();
  const links = await getLinks();

  return (
    <div className="container grid gap-2">
      <h1>Dashboard</h1>
      <LinkList links={links} />
      <AddLink />
    </div>
  );
};

export default DashboardPage;
