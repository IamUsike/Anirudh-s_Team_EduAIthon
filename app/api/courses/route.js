import { Course } from "@/models/Course";
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";

export async function GET() {
  try {
    await dbConnect();
    const courses = await Course.find({});
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await dbConnect();
    const course = await Course.create(body);
    return NextResponse.json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 },
    );
  }
}
