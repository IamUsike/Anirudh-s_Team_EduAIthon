// app/api/problems/route.js
import { NextResponse } from "next/server";
import { Problem } from "../../../models/Problem"; // adjust import path if needed
// import { connectDB } from "@/lib/db"; // your DB connection logic
import dbConnect from "@/utils/dbConnect";

export async function POST(req) {
  await dbConnect();
  try {
    // await connectDB();
    const body = await req.json();
    const newProblem = await Problem.create(body);
    return NextResponse.json(newProblem, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
