export default function Features() {
  return (
    <section className="bg-orange-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="py-16 flex flex-col gap-16">
          <div className="mx-auto max-w-2xl text-3xl font-bold lg:text-center">
            Awesome features to spark conversations
          </div>
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-3 ">
            <div className="gap-2 flex flex-col">
              <div className="text-xl font-semibold">🍹 Social Sips</div>
              <div className=" text-sm text-muted-foreground">
                Random Activity Starter. Participate in activities virtually
                with teams.
              </div>
            </div>
            <div className="gap-2 flex flex-col">
              <div className="text-xl font-semibold">🎭 Would You Rather</div>
              <div className=" text-sm text-muted-foreground">
                Know colleagues opinion about thing that they would choose over
                the other.
              </div>
            </div>
            <div className="gap-2 flex flex-col">
              <div className="text-xl font-semibold">🔍 SpotLight</div>
              <div className=" text-sm text-muted-foreground">
                Put People on the spot and get to know about them via spotlight.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
