import { NextResponse } from "next/server";
import { getUser } from "@/lib/server/getUser"; // ✅ サーバー専用の getUser を呼び出す

export async function GET() {
  const user = await getUser();
  return NextResponse.json(user);
}
