'use server'
import { NextRequest, NextResponse } from "next/server";
import { UpdateAddressData} from "../camAddr/route";
import { UpdatePortData} from "../camPort/route";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
    if (request.nextUrl.searchParams.get('useLocal')){
        await UpdateAddressData('local');
    }
    else {
        await UpdateAddressData(request.nextUrl.searchParams.get('addr'));
    }
    await UpdatePortData(request.nextUrl.searchParams.get('port'));
    redirect('/settings');
}