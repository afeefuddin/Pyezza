import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

//hero-patterns
const Backgrounds = [
  {
    backgroundColor: "#f5f5f5",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%23f97416' fill-opacity='0.27'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E\")",
  },
  {
    backgroundColor: "#f5f5f5",
    backgroundImage: `url('data:image/svg+xml,%3Csvg width="12" height="24" viewBox="0 0 12 24" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f97416" fill-opacity="0.4"%3E%3Cpath d="M2 0h2v12H2V0zm1 20c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM9 8c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm-1 4h2v12H8V12z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`,
  },
  {
    backgroundColor: "#f5f5f5",
    backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f97416" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`,
  },
  {
    backgroundColor: "#f5f5f5",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='16' viewBox='0 0 20 16'%3E%3Cg fill='%23f97416' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M0 .04C2.6.22 4.99 1.1 7 2.5A13.94 13.94 0 0 1 15 0h4c.34 0 .67.01 1 .04v2A12 12 0 0 0 7.17 12h5.12A7 7 0 0 1 20 7.07V14a5 5 0 0 0-3-4.58A5 5 0 0 0 14 14H0V7.07c.86.12 1.67.4 2.4.81.75-1.52 1.76-2.9 2.98-4.05C3.79 2.83 1.96 2.2 0 2.04v-2z'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  {
    backgroundColor: "#f5f5f5",
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='42' height='44' viewBox='0 0 42 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Page-1' fill='none' fill-rule='evenodd'%3E%3Cg id='brick-wall' fill='%23f97416' fill-opacity='0.4'%3E%3Cpath d='M0 0h42v44H0V0zm1 1h40v20H1V1zM0 23h20v20H0V23zm22 0h20v20H22V23z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  },
  {
    backgroundColor: "#f5f5f5",
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='36' height='36' viewBox='0 0 36 36' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 0H0v36h36V0zM15.126 2H2v13.126c.367.094.714.24 1.032.428L15.554 3.032c-.188-.318-.334-.665-.428-1.032zM18 4.874V18H4.874c-.094-.367-.24-.714-.428-1.032L16.968 4.446c.318.188.665.334 1.032.428zM22.874 2h11.712L20 16.586V4.874c1.406-.362 2.512-1.468 2.874-2.874zm10.252 18H20v13.126c.367.094.714.24 1.032.428l12.522-12.522c-.188-.318-.334-.665-.428-1.032zM36 22.874V36H22.874c-.094-.367-.24-.714-.428-1.032l12.522-12.522c.318.188.665.334 1.032.428zm0-7.748V3.414L21.414 18h11.712c.362-1.406 1.468-2.512 2.874-2.874zm-18 18V21.414L3.414 36h11.712c.362-1.406 1.468-2.512 2.874-2.874zM4.874 20h11.712L2 34.586V22.874c1.406-.362 2.512-1.468 2.874-2.874z' fill='%23f97416' fill-opacity='0.29' fill-rule='evenodd'/%3E%3C/svg%3E")`,
  },
  {
    backgroundColor: "#f5f5f5",
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='16' viewBox='0 0 12 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 .99C4 .445 4.444 0 5 0c.552 0 1 .45 1 .99v4.02C6 5.555 5.556 6 5 6c-.552 0-1-.45-1-.99V.99zm6 8c0-.546.444-.99 1-.99.552 0 1 .45 1 .99v4.02c0 .546-.444.99-1 .99-.552 0-1-.45-1-.99V8.99z' fill='%23f97416' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
  },
];

export default function IntegrationCard({
  data,
}: {
  data: {
    teamName: string | null;
    teamId: string;
    type: string;
    publicId: string;
  };
}) {
  const random = Math.floor(Math.random() * 10) % Backgrounds.length;
  return (
    <div className="h-72 bg-muted rounded-lg">
      <div
        className="h-2/5 rounded-t-lg"
        style={{ ...Backgrounds[random] }}
      ></div>
      <div className="flex grow flex-col space-y-4 px-4 py-4 sm:px-6">
        <div className="flex h-full flex-row justify-between">
          <div className="flex w-full flex-col justify-between ">
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex flex-row items-center justify-between">
                  <p className="pointer-events-none text-muted-foreground block truncate font-semibold text-xl">
                    {data.teamId}
                  </p>
                </div>
                <p className="pointer-events-none block font-medium text-muted-foreground text-sm">
                  {data.teamName}
                </p>
              </div>
              <span className="font-medium text-lg">
                <span className="text-muted-foreground text-sm"></span>
              </span>
            </div>
            <div className="flex flex-row gap-2">
              <span className="inline-flex items-center rounded-md bg-primary-foreground px-2.5 py-0.5 font-medium text-primary-muted text-sm capitalize dark:bg-primary-muted dark:text-primary-foreground">
                Free
              </span>
              <span
                className="z-10 inline-flex cursor-pointer items-center rounded-md bg-primary-foreground px-2.5 py-0.5 font-medium text-primary-muted text-sm capitalize dark:bg-primary-muted dark:text-primary-foreground"
                data-state="closed"
              >
                Onboarding Incomplete
              </span>
            </div>
          </div>
          <div>
            {data.type === "slack" && (
              <Image src="/slack.svg" alt="" height={20} width={20} />
            )}
          </div>
        </div>

        <Link
          href={`/integrations/${data.publicId}`}
          prefetch
          className="w-full flex items-center  "
        >
          <Button className="font-bold w-full">View</Button>
        </Link>
      </div>
    </div>
  );
}
