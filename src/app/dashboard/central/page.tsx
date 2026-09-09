import { redirect } from "next/navigation";

export const metadata = {
  title: "Central — Dashboard | NP Music Group",
};

export default function CentralPage() {
  redirect("/admin");
}
