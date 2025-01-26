import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function CTA() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/40 via-primary/30 to-primary/20 p-8 w-full flex items-center justify-center text-center">
      <div className=" gap-4 max-w-2xl">
        <div className="flex flex-col space-y-4">
          <h3 className="text-3xl font-bold">Connect with Slack</h3>
          <p className="text-muted-foreground">
            Integrate pyezza with your Slack workspace to enable seamless
            communication. Send messages, receive notifications, and collaborate
            effectively with your team.
          </p>
          <Link href="/api/auth/slack">
            <Button
              className="bg-secondary hover:bg-secondary/90 py-4 text-base font-medium"
              size="lg"
            >
              <Image height={20} width={20} alt="" src="/slack.svg" />
              Add to Slack
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
