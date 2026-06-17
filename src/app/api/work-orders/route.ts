import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Work order received:", body);
    
    return NextResponse.json({ success: true, message: "Work order created successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process work order" }, { status: 400 });
  }
}
