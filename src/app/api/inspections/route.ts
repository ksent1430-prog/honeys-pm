import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Inspection request received:", body);
    
    return NextResponse.json({ success: true, message: "Inspection scheduled successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process inspection" }, { status: 400 });
  }
}
