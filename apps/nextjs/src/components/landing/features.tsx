import Image from "next/image";

export default function Features() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="py-32 flex flex-col gap-16">
          <div className="mx-auto max-w-3xl text-2xl md:text-4xl font-bold lg:text-center">
            Awesome features to spark conversations
          </div>
          <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 flex flex-col">
            {[
              {
                title: "Social Sips",
                desc: "Random Activity Starter. Participate in activities virtually with teams.",
                src: "/socialsips-3d.png",
                background: "bg-[#fcf1e6]",
              },
              {
                title: "Would You Rather",
                desc: "Know colleagues opinion about thing that they would choose over the other.",
                src: "/wouldyourather-3d.png",
                background: "bg-[#fff4e4]",
              },
              {
                title: "Spotlight",
                desc: "Put People on the spot and get to know about them via spotlight.",
                src: "/spotlight-3d.png",
                background: "bg-[#f9efe5] ",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex flex-col bg-[#f9efe5] rounded-xl ring-1 ring-neutral-200 shadow hover:shadow-lg transition-all h-full ${item.background}`}
              >
                <div className="p-6 flex flex-col gap-2">
                  <div className="text-xl font-semibold">{item.title}</div>
                  <div className="text-muted-foreground text-sm">
                    {item.desc}
                  </div>
                </div>
                <div className="relative h-[500px] w-full overflow-hidden rounded-b-xl">
                  <Image src={item.src} alt="" fill className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
