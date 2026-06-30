import { getCurrentUser, requireUser } from "@/lib/auth/dal";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  return Response.json({ user });
}

export async function PATCH(request) {
  try {
    const me = await requireUser();
    const body = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: me.id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        bio: body.bio,
        avatar: body.avatar,
      },
    });

    // Strip password from response
    const { password, ...userWithoutPassword } = updatedUser;

    return Response.json({ success: true, user: userWithoutPassword });
  } catch (err) {
    console.error("PATCH /api/user/profile:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}