import Providers from "~/app/providers";
import "~/styles/globals.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
      <html lang="en">
        <head>
          <title>RC | Links</title>
        </head>
        <body>
          <main className="my-8">{children}</main>
        </body>
      </html>
    </Providers>
  );
};

export default RootLayout;
