import { NextResponse } from 'next/server';
import { hash } from 'bcrypt-ts';
import { prisma } from '@/lib/prisma';

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params; // `id` is now an incremental integer
    const { password, ...data } = await req.json();

    if (password) {
        data.password = await hash(password, 10);
    }

    const updatedLocation = await prisma.location.update({
        where: { id: parseInt(id) }, // Parse `id` as an integer
        data,
    });

    return NextResponse.json(updatedLocation);
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    await prisma.location.delete({
        where: { id: parseInt(id) }, // Parse `id` as an integer
    });

    return NextResponse.json({ message: 'Location deleted successfully' });
}

