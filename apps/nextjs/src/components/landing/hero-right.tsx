import Link from "next/link";
import { BrandIcon } from "@/components/brand-logo";

export default function HeroRight() {
  return (
    <div className="relative flex flex-col gap-8">
      <div className="flex bg-orange-50 p-3 rounded-xl gap-2 md:w-[450px] hover:ring-2 transition-all duration-300 hover:cursor-pointer hover:ring-primary ">
        <div>
          <BrandIcon alt="" />
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <span className="font-bold">Pyezza</span>
            <span className="text-muted-foreground pl-2 text-xs">8:30 PM</span>
          </div>
          <div>
            {" "}
            ⭐ The Spotlight is on{" "}
            <span className="bg-sky-500/20 text-sky-700 px-px rounded">
              @afeef
            </span>{" "}
            ⭐
          </div>
          <div className="mt-2 ml-2 border-l-[3px] border-neutral-300 pl-2">
            <div>What's You favourite slack app?</div>
          </div>
        </div>
      </div>
      <div className="flex bg-orange-50 p-3 rounded-xl gap-2  md:w-[450px] md:self-end hover:ring-2 hover:ring-primary transition-all duration-300 hover:cursor-pointer ">
        <div>
          <div className="flex size-10 items-center justify-center rounded-md bg-neutral-200 font-bold text-neutral-700">
            A
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <span className="font-bold">afeef</span>
            <span className="text-muted-foreground pl-2 text-xs">8:30 PM</span>
          </div>
          <div>
            {" "}
            That's a no brainer!{" "}
            <Link href="/" className="text-blue-600">
              pyezza.live
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
