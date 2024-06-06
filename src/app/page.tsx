import SubscriptionCards from "@/components/home/SubscriptionCards";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center md:py-[100px]">
      <div className="w-full space-y-4 p-4 pr-8 text-left md:pr-0 md:text-center">
        <h1 className="w-full text-3xl font-bold md:text-5xl">Subscriptions</h1>

        <p className="text-md text-black text-opacity-50">
          A customizable subscription service from Duality to enhance your
          business model.
        </p>
      </div>

      <SubscriptionCards />
    </main>
  );
}
