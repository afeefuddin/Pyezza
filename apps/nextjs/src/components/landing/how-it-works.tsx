import Image from "next/image";

export default function HowItWorks() {
  return (
    <section className="px-4 md:px-0 py-16 overflow-x-hidden bg-orange-50 text-black">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-black">
            Bringing teams closer with effortless social interactions.
          </h2>
          <p className="mx-auto max-w-2xl text-lg  ">
            Get started with pyezza in just three simple steps and transform how
            your team communicates.
          </p>
        </div>
        <div className="flex flex-col  md:grid grid-cols-2 gap-12">
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex gap-4">
                  <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="font-semibold text-xl">Add to Slack</div>
                </div>
                <div className="flex flex-col gap-2  border-l-2 mx-4 border-gray-600  pl-8">
                  Connect Pyezza to your Slack workspace with just a few clicks.
                  Our seamless integration process makes setup quick and easy.
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-4">
                  <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="font-semibold text-xl">
                    Create a channel of your choice
                  </div>
                </div>
                <div className="flex flex-col gap-2  border-l-2 mx-4 border-gray-600  pl-8">
                  Set up a dedicated channel where Pyezza will live. Add you
                  teammates to the channel so everyone can have fun.
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-4">
                  <div className="bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="font-semibold text-xl">
                    Configure channel setting
                  </div>
                </div>
                <div className="flex flex-col gap-2  border-l-2 mx-4 border-gray-600  pl-8">
                  Customize when and how pyezza sends messages. Set up, date
                  time, timezones and more to customize you experience.
                </div>
              </div>
            </div>
          </div>
          <div className="p-8">
            <Image
              src="/happy-team-1.png"
              alt="Happy Team"
              className="h-auto w-auto max-w-full max-h-[500px]"
              width={0}
              height={0}
              sizes="100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
