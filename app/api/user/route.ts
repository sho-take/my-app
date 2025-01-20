import { NextResponse } from "next/server";
import { getUser } from "@/lib/server/getUser";

export async function GET() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  return NextResponse.json({ id: user.id }); // ✅ `id` キーで統一
}
