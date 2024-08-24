import Button from "@/app/components/ui/Button";
import AddBidRemind from "./Screens/AddBidRemind";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-5">
      <p>Bid Manager</p>
      <AddBidRemind/>
    </main>
  );
}
